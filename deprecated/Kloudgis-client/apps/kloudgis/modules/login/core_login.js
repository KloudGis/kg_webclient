KG.core_login = SC.Object.create({

    isBusy: NO,
    errorMessage: '',

    _hashPassword: function(pwd) {
        return SHA256(pwd);
    },

    focusUserField: function() {
        SC.CoreQuery('#user-field').focus();
    },

    focusPwdField: function() {
        SC.CoreQuery('#pwd-field').focus();
    },

    /**
	   Start async login process
	*/
    signin: function() {
        try {
            // Get our data from the properties using the SC 'get' methods
            // Need to do this because these properties have been bound/observed.
            var username = KG.loginController.get('user');
            if (username == null || username == '') {
                this.focusUserField();
                throw SC.Error.desc('_UsernameRequired'.loc());
            }

            var password = KG.loginController.get('pwd');
            if (password == null || password == '') {
                this.focusPwdField();
                throw SC.Error.desc('_PasswordRequired'.loc());
            }

            this.set('isBusy', YES);

            // We know the username and password are not null at this point, so attempt to login
            var hashedPassword = this._hashPassword(password);
            var sendHash = {};

            sendHash.user = username;
            sendHash.pwd = hashedPassword;

            SC.Request.postUrl('%@/public/login'.fmt(CoreKG.context_server)).json().notify(this, this.endLogin).send(sendHash);

            // Clear the username and password          
            this.set('errorMessage', '')
            return YES;
        }
        catch(e) { // If there was an error, catch and handle it
            // Set Error
            this.set('errorMessage', e.message);
            // Finish login processing
            this.set('isBusy', NO);
            // Authentication was not sucessful!
            // Send the event authenticationFailed to the statechart 
            KG.statechart.sendEvent('authenticationFailed', this);
            return NO;
        }
    },

    /**
	   Callback from beginLogin() after we get a response from the server to process
	   the returned login info.

	   @param {SC.Response} response The HTTP response
	   @param {String}  if the call is using the auth token
	   */
    endLogin: function(response, tokenSignin) {
        try {
            // Check status
            SC.Logger.info('HTTP status code: ' + response.status);
            if (!SC.ok(response)) {
                // Error
                if (response.status == '404') {
                    throw SC.Error.desc('_serverDown'.loc());
                } else if (response.status == '401') {
                    throw SC.Error.desc('_passwordMismatch'.loc());
                } else if (response.status == '500') {
                    throw SC.Error.desc('_internalError'.loc());
                } else {
                    throw SC.Error.desc(response.getPath('rawRequest.responseText'));
                }
            }
            // Set cookie
            //  var rememberMe = this.get('rememberMe');
            //remove old cookie if any			
            var authCookie = SC.Cookie.find(CoreKG._authCookieName);
            if (authCookie === null) {
                //create a new cookie
                authCookie = SC.Cookie.create();
                authCookie.set('name', CoreKG._authCookieName);
            }
            var token = response.get('body').content;
            authCookie.set('value', token);

            CoreKG._authToken = {
                pwd: token
            };
            /* if (rememberMe == '3seconds') {
                // Cookie is saved for 3 seconds
                var d = SC.DateTime.create();
                authCookie.set('expires', d.advance({
                    second: 3
                }));
            } else if (rememberMe == 'closeBrowser') {
                // Cookie removed when browser closed
                authCookie.set('expires', null);
            } else {
                // Cookie is saved for 1 year
                var d = SC.DateTime.create();
                authCookie.set('expires', d.advance({
                    year: 1
                }));
            }*/
            //use close browser cookie life.
            authCookie.set('expires', null);
            // This writes the cookie to document.cookie
            authCookie.write();

            // Clear any previous error message
            this.set('errorMessage', '');

            // Authentication was sucessful!
            this.set('isBusy', NO);

            // Send the event authenticationSucceeded to our statechart
            KG.statechart.sendEvent('authenticationSucceeded', this);
        }
        catch(e) {
            // Authentication was not sucessful!
            if (tokenSignin) {
                this.set('errorMessage', '');
            } else {
                this.set('errorMessage', e.message);
            }
            SC.Logger.warn('Error in endLogin: ' + e.message);
            this.focusUserField();
            KG.statechart.sendEvent('authenticationFailed', this);
            this.set('isBusy', NO);
        }
    },

    trySigninWithCookie: function() {
        var authCookie = SC.Cookie.find(CoreKG._authCookieName);
        if (authCookie) {
            // Guess the user wanted to be remembered...
            // this.set('rememberMe', 'yes');
            // Send an async call to login passing the authentication token to the server
            var sendHash = {};
            sendHash.pwd = authCookie.value;
            SC.Request.postUrl('%@/public/login'.fmt(CoreKG.context_server)).json().notify(this, this.endLogin, YES).send(sendHash);
        } else {
            KG.statechart.sendEvent('authenticationFailed', this);
        }
    },

    signup: function() {
        window.location.href = "/signup";
    }
});
