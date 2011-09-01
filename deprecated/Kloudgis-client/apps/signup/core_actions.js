SC.mixin(Signup, {

    testEmail: function(statechart) {
        Signup.signupController.incrementProperty('testingCounter');
        var value = statechart.get('textfield').get('value');
        // SC.Logger.warn('Test email value:' + value);
        if (SC.none(value) || value === '') {
            statechart.sendEvent('missingEvent', this);
            Signup.signupController.decrementProperty('testingCounter');
        } else {
            if (value.indexOf('@') === -1) {
                statechart.sendEvent('invalidEvent', this);
                Signup.signupController.decrementProperty('testingCounter');
            } else {
                Signup.signupController.set('isCheckEmail', YES);
                SC.Request.getUrl("%@/public/register/test_email/%@".fmt(Signup.context,value)).json().notify(this, this.didTestEmail, statechart).send();
            }
        }
    },

    didTestEmail: function(response, statechart) {
        if (SC.ok(response)) {
            var body = response.get('encodedBody');
            if (body === 'Accepted') {
                statechart.sendEvent('okEvent', this);
            } else {
                statechart.sendEvent('takenEvent', this);
            }
        } else {
            statechart.sendEvent('serverErrorEvent', this);
        }
        Signup.signupController.set('isCheckEmail', NO);
        Signup.signupController.decrementProperty('testingCounter');
    },

    testName: function(statechart) {
        Signup.signupController.incrementProperty('testingCounter');
        var value = statechart.get('textfield').get('value');
        // SC.Logger.warn('Test name value:' + value);
        if (SC.none(value) || value === '') {
            statechart.sendEvent('missingEvent', this);
        } else {
            statechart.sendEvent('okEvent', this);
        }
        Signup.signupController.decrementProperty('testingCounter');
    },

    testCompagny: function(statechart) {
        Signup.signupController.incrementProperty('testingCounter');
        statechart.sendEvent('okEvent', this);
        Signup.signupController.decrementProperty('testingCounter');
    },

    testLocation: function(statechart) {
        Signup.signupController.incrementProperty('testingCounter');
        var value = statechart.get('textfield').get('value');
        // SC.Logger.warn('Test name value:' + value);
        if (SC.none(value) || value === '') {
            statechart.sendEvent('missingEvent', this);
        } else {
            statechart.sendEvent('okEvent', this);
        }
        Signup.signupController.decrementProperty('testingCounter');
    },

    testPwd: function(statechart) {
        Signup.signupController.incrementProperty('testingCounter');
        var value = statechart.get('textfield').get('value');
        // SC.Logger.warn('Test password value:' + value);
        if (SC.none(value) || value.length < 6) {
            statechart.sendEvent('invalidEvent', this);
        } else {
            statechart.sendEvent('okEvent', this);
        }
        Signup.signupController.decrementProperty('testingCounter');
    },

    testConfirmPwd: function(statechart) {
        Signup.signupController.incrementProperty('testingCounter');
        var value = statechart.get('textfield').get('value');
        //  SC.Logger.warn('Test confirm password value:' + value);
        if (value !== Signup.signupController.get('pwd')) {
            statechart.sendEvent('mismatchEvent', this);
        } else {
            statechart.sendEvent('okEvent', this);
        }
        Signup.signupController.decrementProperty('testingCounter');
    },

    testAndCreate: function() {
        //retest all the statecharts
        //the observer will create once the tests are completed 
        Signup.mainPage.get('emailView').sendEvent('testEvent', this);
        Signup.mainPage.get('nameView').sendEvent('testEvent', this);
        Signup.mainPage.get('pwdView').sendEvent('testEvent', this);
        Signup.mainPage.get('confirmView').sendEvent('testEvent', this);
        Signup.mainPage.get('cieView').sendEvent('testEvent', this);
        Signup.mainPage.get('locView').sendEvent('testEvent', this);
    },

    isValid: function() {
        var email = Signup.mainPage.get('emailView').get('currentStates')[0].get('valid');
        var name = Signup.mainPage.get('nameView').get('currentStates')[0].get('valid');
        var pwd = Signup.mainPage.get('pwdView').get('currentStates')[0].get('valid');
        var confirm = Signup.mainPage.get('confirmView').get('currentStates')[0].get('valid');
        return (email && name && pwd && confirm);
    },

	gotoLoginPage: function() {
        if (SC.buildMode === 'debug') {
            window.location.href = 'http://localhost:4020/kloudgis';
        } else {
            window.location.href = "/";
        }
    },

	pingServer: function(){
		 SC.Request.getUrl("%@/public/ping".fmt(Signup.context)).json().notify(this, this.didPing).send();
	},
	
	didPing: function(response){
		if (SC.ok(response)) {
			Signup.statechart.sendEvent('pingSucessEvent', this);
		}else{
			Signup.statechart.sendEvent('serverErrorEvent', this);
		}
	},

    createAccount: function() {
        var newUser = Signup.signupController.get('content');
        if (SC.none(newUser) || !Signup.isValid()) {
            Signup.signupController.set('isCreateAccount', NO);
            SC.Logger.warn('Create action ignored. New user is not valid.');
        } else {
            var store = Signup.store;
            var storeKey = newUser.get('storeKey');
			var hash = SC.clone(store.readDataHash(storeKey))
			hash.pwd = SHA256(hash.pwd);
            SC.Request.postUrl("%@/public/register?locale=%@".fmt(Signup.context, SC.Locale.currentLocale.get('language'))).json().notify(this, this.didPostUser).send(hash);
        }
    },

    didPostUser: function(response) {
        if (SC.ok(response)) {
            var body = response.get('body');
            if (body && body.message === 'sucess') {
                Signup.statechart.sendEvent('createSuccessEvent');
            } else {
                Signup.statechart.sendEvent('createErrorEvent', this, body.message_loc);
            }
        } else {
            SC.Logger.warn('error logging out:' + response);
            Signup.statechart.sendEvent('serverErrorEvent');
        }
        Signup.signupController.set('isCreateAccount', NO);
    },

    logout: function() {
        SC.Request.getUrl("%@/public/logout".fmt(Signup.context)).json().notify(this, this.didLogout).send();
    },

    didLogout: function(response, ignoreApp) {
        if (SC.ok(response)) {
            Signup.statechart.sendEvent('didLogout');
        } else {
            SC.Logger.warn('error logging out:' + response);
            Signup.statechart.sendEvent('serverErrorEvent');
        }
    }

});
