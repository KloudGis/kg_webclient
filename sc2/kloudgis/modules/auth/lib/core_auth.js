//Auth properties
SC.mixin(KG, {
    /**
 * Name of localStorage where we store the auth token
 */
    AUTHENTICATION_TOKEN_LOCAL_STORE_KEY: 'KG.AuthenticationToken',

    /**
 * Name of Authentication header returned in API responses
 */
    AUTHENTICATION_HEADER_NAME: 'X-Kloudgis-Authentication',

    /**
 * All tokens to expire in 14 days
 */
    AUTHENTICATION_TOKEN_EXPIRY_SECONDS: 60 * 60 * 24 * 14,

});

//store and retreive auth token
//basic login using the auth token
KG.core_auth = SC.Object.create({

    load: function() {
        // Get token from local store
        var token = localStorage.getItem(KG.AUTHENTICATION_TOKEN_LOCAL_STORE_KEY);
        if (SC.none(token)) {
            this.logout();
            return NO;
        }

        // Decode token
        var delimiterIndex = token.indexOf('~~~');
        if (delimiterIndex < 0) {
            return NO;
        }
        var jsonString = token.substr(0, delimiterIndex);
        var json = JSON.parse(jsonString);
        if (SC.none(json)) {
            return NO;
        }

        var expiryString = json.ExpiresOn;
        if (expiryString === null) {
            return NO;
        }
        var now = new Date();
		//TODO parse the string and compare
        var expiry = null;//SC.DateTime.parse(expiryString, SC.DATETIME_ISO8601);
       // if (SC.DateTime.compare(now, expiry) > 0) {
            return NO;
       // }

        // Synchronously get user from server
        var newToken = null;
        var postData = {
            pwd: token
        };
        //synch
        $.ajax({
            url: '/kg_auth/public/login',
            type: 'POST',
            async: false,
            dataType: 'json',
            data: JSON.stringify(postData),
            error: function(jqXHR, textStatus, errorThrown) {
                SC.Logger.error('Auto login error: HTTP error status code: ' + jqXHR.status);
            },
            success: function(data, textStatus, jqXHR) {
                newToken = data.auth_token;
            }
        });

        // Save
        this.saveToken(newToken, expiry);

        if (SC.none(newToken)) {
            return NO;
        }
        return YES;
    },

    login: function(user, pwd_hashed, rememberMe, cb_target, cb, cb_params) {

        if (SC.none(rememberMe)) {
            rememberMe = NO;
        }

        var postData = {
            user: user,
            pwd: pwd_hashed
        };

        // Call server
        var url = '/kg_auth/public/login';
        var context = {
            rememberMe: rememberMe,
            callbackTarget: cb_target,
            callbackFunction: cb,
            callbackParams: cb_params
        };

        $.ajax({
            type: 'POST',
            url: url,
            data: JSON.stringify(postData),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            context: context,
            error: this.endLoginError,
            success: this.endLogin,
            async: YES
        });

        return;
    },

    endLoginError: function(jqXHR, textStatus, errorThrown) {

        var error = null;
        SC.Logger.error('HTTP error status code: ' + jqXHR.status);
        if (jqXHR.status === 500 || jqXHR.status === 400 || jqXHR.status === 401) {
            SC.Logger.error('HTTP response ' + jqXHR.responseText);
            if (!SC.empty(jqXHR.responseText) && jqXHR.responseText.charAt(0) === '{') {
                var responseJson = $.parseJSON(jqXHR.responseText);
                error = new SC.Error(responseJson.Message);
            } else {
                error = new SC.Error('Error connecting to server. ' + jqXHR.status + ' ' + jqXHR.statusText);
            }
        } else {
            error = new SC.Error('Unexpected HTTP error: ' + jqXHR.status + ' ' + jqXHR.statusText);
        }

        // Callback
        if (!SC.none(this.callbackFunction)) {
            this.callbackFunction.call(this.callbackTarget, this.callbackParams, error);
        }
        return YES;
    },

    endLogin: function(data, textStatus, jqXHR) {
        var error = null;
        try {
            // Figure out the expiry
            // Take off 1 hour so that we expire before the token does which means we have time to act
            var expiry = new Date();
            if (this.rememberMe) {
				//TODO add a delay to the current time!
                //expiry = 
            }
            // Get the token
            var token;
            if (!SC.none(data)) {
                token = data.auth_token;
            }
            if (SC.none(token)) {
                throw new SC.Error('_nullTokenError'.loc());
            }
            KG.core_auth.saveToken(token, expiry);
        }
        catch(err) {
            error = err;
            SC.Logger.error('endLogin: ' + err.message);
        }

        // Callback
        if (!SC.none(this.callbackFunction)) {
            this.callbackFunction.call(this.callbackTarget, this.callbackParams, error);
        }
        // Return YES to signal handling of callback
        return YES;
    },

    saveToken: function(token, expiry) {
        this.set('authenticationTokenExpiry', expiry);
        this.set('authenticationToken', token);
        localStorage.setItem(KG.AUTHENTICATION_TOKEN_LOCAL_STORE_KEY, token);
    },

    /*
   * Remove authentication tokens
   */
    logout: function() {
		//tell the server about the logout (invalidate token and destroy the session)
	 	var url = '/kg_auth/public/login/logout';
		 $.ajax({
	            type: 'POST',
	            url: url,
	            async: YES
	        });
        // Remove token from local store
        localStorage.removeItem(KG.AUTHENTICATION_TOKEN_LOCAL_STORE_KEY);

        // Clear cached token
        this.set('authenticationTokenExpiry', null);
        this.set('authenticationToken', null);

        return;
    }
});
