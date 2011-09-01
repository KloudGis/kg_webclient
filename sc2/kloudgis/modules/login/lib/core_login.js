KG.core_login = SC.Object.create({
    isBusy: NO,
    errorMessage: '',
	rememberMe: NO,

    loginAction: function() {
        console.log('login action triggered');
        KG.statechart.sendAction('loginAction');
    },

    signupAction: function() {
        console.log('signup action triggered');
        KG.statechart.sendAction('signupAction');
    },

    signup: function() {
        window.location.href = "signup.html";
    },

    _hashPassword: function(pwd) {
        return SHA256(pwd);
    },

    focusUserField: function() {
        $('#user-field').focus();
    },

    focusPwdField: function() {
        $('#pwd-field').focus();
    },

    /**
	   Start async login process
	*/
    login: function() {
        try {
            console.log('Login attempt');
            // Get our data from the properties using the SC 'get' methods
            // Need to do this because these properties have been bound/observed.
            var username = KG.loginController.get('user');
            if (username == null || username == '') {
                this.focusUserField();
                throw new Error('_UsernameRequired'.loc());
            }

            var password = KG.loginController.get('pwd');
            if (password == null || password == '') {
                this.focusPwdField();
                throw new Error('_PasswordRequired'.loc());
            }

            this.set('isBusy', YES);

            // We know the username and password are not null at this point, so attempt to login
            var hashedPassword = this._hashPassword(password);
            KG.core_auth.login(username, hashedPassword, this.get('rememberMe'), this, this.endLogin, {});
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
            KG.statechart.sendAction('authenticationFailed', this);
            return NO;
        }
    },

    /**
	   Callback from beginLogin() after we get a response from the server to process
	   the returned login info.

	   @param {SC.Response} response The HTTP response
	   @param {String}  if the call is using the auth token
	   */
    endLogin: function(params, error) {
        try {
            // Check status
            if (!SC.none(error)) {
                throw error;
            }
            // Clear any previous error message
            this.set('errorMessage', '');
            // Authentication was sucessful!
            this.set('isBusy', NO);
            // Send the event authenticationSucceeded to our statechart
            KG.statechart.sendAction('authenticationSucceeded', this);
        }
        catch(e) {
            // Authentication was not sucessful!
            this.set('errorMessage', e.message);
            this.focusUserField();
            KG.statechart.sendAction('authenticationFailed', this);
            this.set('isBusy', NO);
        }
    },

    tryLoginAuto: function() {
        if (KG.core_auth.load()) {
            KG.statechart.sendAction('authenticationSucceeded', this);
            return YES;
        } else {
            KG.statechart.sendAction('authenticationFailed', this);
            return NO;
        }
    }
});

KG.Credential = SC.Object.extend({
	user: undefined,
	pwd: undefined
});

//login controller
KG.loginController = SC.Object.create({
});

$(document).ready(function() {
    KG.statechart.initStatechart();
});
