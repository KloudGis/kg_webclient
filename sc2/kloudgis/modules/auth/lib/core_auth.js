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
    AUTHENTICATION_TOKEN_EXPIRY: 14,

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
        if (delimiterIndex < 1) {
            return NO;
        }
        var expiryString = token.substr(0, delimiterIndex);
        if (SC.none(expiryString)) {
            return NO;
        }

        var now = new Date();
		//TODO parse the string and compare
        var expiry = new Date(expiryString);
        if (SC.none(expiry) || expiry.getTime() == Number.NaN ||  now > expiry) {
            return NO;
        }

        // Synchronously get user from server
        var newToken = null;
        var postData = {
			user: null,
            pwd: token.substr(delimiterIndex + 3)
        };
        //synch
        $.ajax({
			type: 'POST',
            url: '/kg_auth/public/login',             
            data: JSON.stringify(postData),
			dataType: 'json',
			contentType: 'application/json; charset=utf-8',
            error: function(jqXHR, textStatus, errorThrown) {
                SC.Logger.error('Auto login error: HTTP error status code: ' + jqXHR.status);
            },
            success: function(data, textStatus, jqXHR) {
                newToken = data.auth_token;
            },
			async: false
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
            var expiry = new Date();
            if (this.rememberMe) {
                expiry.setDate(expiry.getDate()+KG.AUTHENTICATION_TOKEN_EXPIRY);
            }else{
				expiry = '';
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
		if(SC.none(token)){
			localStorage.setItem(KG.AUTHENTICATION_TOKEN_LOCAL_STORE_KEY, '');
		}else{
        	localStorage.setItem(KG.AUTHENTICATION_TOKEN_LOCAL_STORE_KEY, expiry + '~~~' + token);
		}
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
