//Auth properties
SC.mixin(KG, {
    /**
 * Name of localStorage where we store the auth token
 */
    AUTHENTICATION_TOKEN_LOCAL_STORE_KEY: 'KG.AuthenticationToken',
	REMEMBER_ME_LOCAL_STORE_KEY:  'KG.RememberMe',

    /**
 * Name of Authentication header returned in API responses
 */
    AUTHENTICATION_HEADER_NAME: 'X-Kloudgis-Authentication',	

});

//store and retreive auth token
//basic login using the auth token
KG.core_auth = SC.Object.create({
	
	authenticationToken: null,
	activeUser: null,

    load: function(cb_target, cb, useRememberMe) {
        // Get token from local store
        var token = localStorage.getItem(KG.AUTHENTICATION_TOKEN_LOCAL_STORE_KEY);
		var rememberMe = localStorage.getItem(KG.REMEMBER_ME_LOCAL_STORE_KEY);
        if (SC.none(token) || (useRememberMe && rememberMe != 'true')) {
            this.logout();
			cb.call(cb_target, "_failed");
            return NO;
        }

        // Synchronously get user from server
        
        var postData = {
			user: null,
            pwd: token
        };
        $.ajax({
			type: 'POST',
            url: '/kg_auth/public/login',             
            data: JSON.stringify(postData),
			dataType: 'json',
			contentType: 'application/json; charset=utf-8',
			context: this,
            error: function(jqXHR, textStatus, errorThrown) {
                SC.Logger.error('Load error: HTTP error status code: ' + jqXHR.status);
				cb.call(cb_target, "_error");
            },
            success: function(data, textStatus, jqXHR) {
				var newToken = data.token;
				var user = data.user;
				// Save
		        this.saveLogin(newToken, undefined, user);
				cb.call(cb_target, "_success");
            },
			async: YES
        });
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
		if(jqXHR.status === 401){
			error = new SC.Error('_unauthorized');
		}else if (jqXHR.status === 403 || jqXHR.status === 404 || jqXHR.status > 500) {
            error = new SC.Error('_serverError');
        } else {
            error = new SC.Error('_unexpectedError');
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
            // Get the token
            var token,user;
            if (!SC.none(data)) {
                token = data.token;
				user = data.user;
            }
            if (SC.none(token)) {
                throw new SC.Error('_nullTokenError');
            }
            KG.core_auth.saveLogin(token, this.rememberMe, user);
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

    saveLogin: function(token, rememberMe, user) {
        this.set('authenticationToken', token);
		this.set('activeUser', user);
		if(SC.none(token)){
			localStorage.setItem(KG.AUTHENTICATION_TOKEN_LOCAL_STORE_KEY, '');
			localStorage.setItem(KG.REMEMBER_ME_LOCAL_STORE_KEY, NO);
		}else{
        	localStorage.setItem(KG.AUTHENTICATION_TOKEN_LOCAL_STORE_KEY, token);
			if(rememberMe !== undefined){
				localStorage.setItem(KG.REMEMBER_ME_LOCAL_STORE_KEY, rememberMe);
			}
		}
    },

    /*
   * Remove authentication tokens
   */
    logout: function() {
		console.log('Logging out');
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
        this.set('authenticationToken', null);
		this.set('activeUser', null);
        return;
    },

	createAjaxRequestHeaders: function(){
		var headers = {};
		headers[KG.AUTHENTICATION_HEADER_NAME] = this.get('authenticationToken');
		return headers;
	}
});
