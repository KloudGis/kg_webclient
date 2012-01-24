/**
* Core functions for the login page.
**/
KG.core_login = SC.Object.create({
    isBusy: NO,
    errorMessage: '',
	rememberMe: NO,
	rememberMeLabel: '_rememberMe'.loc(),

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
            var username = KG.credential.get('user');
            if (username == null || username == '') {
                this.focusUserField();
                throw new Error('_UsernameRequired'.loc());
            }

            var password = KG.credential.get('pwd');
            if (password == null || password == '') {
                this.focusPwdField();
                throw new Error('_PasswordRequired'.loc());
            }

            this.set('isBusy', YES);

            // We know the username and password are not null at this point, so attempt to login
            var hashedPassword = SHA256(password);
            KG.core_auth.login(username, hashedPassword, this.get('rememberMe'), this, this.endLogin, {});   
			return YES;       
        }
        catch(e) { // If there was an error, catch and handle it
            // Set Error
            this.set('errorMessage', e.message.loc());
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
            // Authentication was sucessful!
            this.set('isBusy', NO);
            // Send the event authenticationSucceeded to our statechart
            KG.statechart.sendAction('authenticationSucceeded', this);
        }
        catch(e) {
            // Authentication was not sucessful!
			var mess = e.message || '?';
            this.set('errorMessage', mess.loc());
            this.focusUserField();
            KG.statechart.sendAction('authenticationFailed', this);
            this.set('isBusy', NO);
			return YES;
        }
        this.set('errorMessage', '');
		return YES;
    },

    tryLoginAuto: function() {
        KG.core_auth.load(this, this.tryLoginAutoCallback, YES);		
    },

	tryLoginAutoCallback: function(message){
		console.log('auto cb with: ' + message);
		if(message === "_success"){
			KG.statechart.sendAction('authenticationSucceeded', this);
		}else{
			KG.statechart.sendAction('authenticationFailed', this);
		}
	}
});

KG.credential = SC.Object.create({
	user: undefined,
	pwd: undefined
});


$(document).ready(function() {
    KG.statechart.initStatechart();
});
