/* ===========================================================================
   BPM Combined Asset File
   MANIFEST: kloudgis ()
   This file is generated automatically by the bpm (http://www.bpmjs.org)
   =========================================================================*/

spade.register("kloudgis/signup/lib/core_signup", function(require, exports, __module, ARGV, ENV, __filename){
/**
* Core functions to signup 
**/

KG.core_signup = SC.Object.create({

    globalError: '',

    createAccount: function() {
        this.validateAllExceptUser();
        this.validateUser(this, this.createUserCallback());
    },

    createUserCallback: function() {
        var found = KG.fields.findProperty('isValid', NO);
        if (!found) {
            this.set('globalError', '');
			var postData = {
				user: KG.userFieldController.get('value'),
				pwd: SHA256(KG.pwdFieldController.get('value')),
				name: KG.nameFieldController.get('value'),
				company: KG.companyFieldController.get('value'),
				location: KG.locationFieldController.get('value'),
			};
			// Call server
            $.ajax({
                type: 'POST',
                url: KG.get('serverHost') + 'api_auth/public/register',
                data: JSON.stringify(postData),
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                context: this,
                error: function(){
					this.set('globalError', '_serverError'.loc());
				},
                success: function(data){
					console.log(data);
					if(data.content == "_success"){
						window.location.href = "index.html?user=" + KG.userFieldController.get('value');
					}else{
						this.set('globalError', data.content.loc());
					}
				},
                async: YES
            });
        } else {
            this.set('globalError', '_correctErrorFirst'.loc());
        }
    },

    validateUser: function(cb_target, cb) {
        KG.userFieldController.validate(cb_target, cb);
    },

    validateAllExceptUser: function() {
        for (i = 1; i < KG.fields.length; i++) {
            KG.fields[i].validate();
        }
    }

});

//Each fields
KG.FieldController = SC.Object.extend({
    value: undefined,
    hasError: NO,
    isBusy: NO,
    errorMessage: '',

    validate: function() {
		this.setError();
	},

    setError: function(error) {
        if (SC.none(error)) {
            this.set('hasError', NO);
            this.set('errorMessage', '');
        } else {
            this.set('hasError', YES);
            this.set('errorMessage', error);
        }
    },

    isValid: function() {
        return ! this.get('hasError') && !this.get('isBusy');
    }.property('hasError', 'isBusy')

});

KG.userFieldController = KG.FieldController.create({
    validate: function(cb_target, cb) {
        if (jQuery('#user-textfield')[0].validationMessage != '') {
			this.setError('_invalid'.loc());
            if (cb) {
                this.cb.call(this.cb_target);
            }
        } else {
            var fieldValue = this.get('value');
            this.set('isBusy', YES);
            var url = KG.get('serverHost') + 'api_auth/public/register/test_email';
            var context = {
                callbackTarget: cb_target,
                callbackFunction: cb,
                field: this,
                doCallback: function() {
                    this.field.set('isBusy', NO);
                    // Callback
                    if (!SC.none(this.callbackFunction)) {
                        this.callbackFunction.call(this.callbackTarget);
                    }
                }
            };
            // Call server
            $.ajax({
                type: 'POST',
                url: url,
                data: fieldValue,
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                context: context,
                error: this.ajaxError,
                success: this.ajaxSuccess,
                async: YES
            });
        }
    },

    ajaxError: function() {
        this.field.setError('_serverError'.loc());
        this.doCallback();
    },

    ajaxSuccess: function(data) {
        if (data.content === 'Accepted') {
            this.field.setError();
        } else {
            this.field.setError(data.content.loc());
        }
        this.doCallback();
    }
});
KG.pwdFieldController = KG.FieldController.create({
	validate: function() {
		var val = this.get('value');
		if(SC.none(val)){
			this.setError('_Empty'.loc());
		}else if(val.length < 6){
			this.setError('_pwdMinLength'.loc());
		}else{
			this.setError();
		}		
	},
});
KG.nameFieldController = KG.FieldController.create();
KG.companyFieldController = KG.FieldController.create();
KG.locationFieldController = KG.FieldController.create();

KG.fields = [KG.userFieldController, KG.pwdFieldController, KG.nameFieldController, KG.companyFieldController, KG.locationFieldController];

$(document).ready(function() {
    KG.statechart.initStatechart();
});

});spade.register("kloudgis/signup/lib/core_statechart", function(require, exports, __module, ARGV, ENV, __filename){
/**
* Statechart for the signup page
**/

SC.mixin(KG, {
    //global state chart
    statechart: SC.Statechart.create({
        //log trace
        trace: NO,

        rootState: SC.State.extend({

            initialSubstate: 'startupState',       

            startupState: SC.State.extend({

                enterState: function() {
                    console.log('enter signup');				
                },
            }),

			userFieldFocusState: SC.State.extend({
				
                enterState: function() {
                    console.log('enter user field');
                },

				focusOutEvent: function(){
					this._validate();
				},
				
				newLineEvent: function(){
					console.log('newline');
					this._validate();
				},
				
				_validate:function(){
					KG.core_signup.validateUser();
				}
				
            }),

			otherFieldFocusState: SC.State.extend({

                enterState: function() {
                    console.log('enter other field');
                },

				focusOutEvent: function(){
					KG.core_signup.validateAllExceptUser();
				},
				
				newLineEvent: function(){
					KG.core_signup.validateAllExceptUser();
				},
            }),

			createAccountAction: function(){
				KG.core_signup.createAccount();
			},
			
			focusInEvent: function(source, domEvent) {
                var id = source.get('elementId');
				console.log('focus in '  + id);
				
                if (id === 'user-field') {
                    this.gotoState('userFieldFocusState');
                } else {
                    this.gotoState('otherFieldFocusState');
                } 
            }

        })
    })
});

});spade.register("kloudgis/signup/lib/main", function(require, exports, __module, ARGV, ENV, __filename){
//framework dependencies
require("ember");
require("ember-statechart");
//create the namespace
KG = Ember.Application.create({lang:'fr',  serverHost: '/'});
require('kloudgis/view/lib/views/forward_text_field');
require('kloudgis/view/lib/views/loading_image');
require('kloudgis/view/lib/views/button')
require("./strings");
require("./core_statechart");
require("./core_signup");
require("./views/signup_field");




});spade.register("kloudgis/signup/lib/strings", function(require, exports, __module, ARGV, ENV, __filename){

var fr = { 
	"_signupTitle": "Kloudgis - Compte",
    "_Empty": "Le champ est obligatoire.",
	"_signupKloudgis": "Créer un compte Kloudgis",
	"_serverError": "Erreur du serveur",
	"_nullTokenError" : "Erreur lors de l'authentification.",
	"_pwdMinLength": "Doit contenir au minimum 6 caractères.",
	"_email" : "Courriel",
	"_pwd": "Mot de passe",
	"_name": "Nom complet",
	"_company": "Compagnie",
	"_location": "Emplacement",
	"_createAccount": "Créer",
	"_InUse": "Ce courriel est déjà utilisé.",
	"_invalid": "Le courriel est invalide.",
	"_correctErrorFirst": "Veuillez corriger les erreurs pour continuer."
};

var en = {
	"_signupTitle": "Kloudgis - Account",
	"_Empty": "This field is required.",
	"_signupKloudgis": "Signup to Kloudgis",
	"_serverError": "Server error.",
	"_nullTokenError" : "Authentification error.",
	"_pwdMinLength": "Must contained atleast 6 characters.",
	"_email" : "Email",
	"_pwd": "Password",
	"_name": "Full Name",
	"_company": "Company",
	"_location": "Location",
	"_createAccount": "Create",
	"_InUse": "This email is already taken.",
	"_invalid": "This email is not valid.",
	"_correctErrorFirst": "Please fix the error to continue."
};

if(KG.lang === 'fr'){
	SC.STRINGS = fr;
}else{
	SC.STRINGS = en;
}

//do the localize after the rendering
SC.run.schedule('render',null, function(){
	console.log('localize page');
	document.title = "_signupTitle".loc();
	$("#kloud-welcome").text("_signupKloudgis".loc());
	$("#email-label").text("_email".loc());
	$("#pwd-label").text("_pwd".loc());
	$("#name-label").text("_name".loc());
	$("#company-label").text("_company".loc());
	$("#location-label").text("_location".loc());
	$("#create-button").text("_createAccount".loc());	
});

});spade.register("kloudgis/signup/lib/views/signup_field", function(require, exports, __module, ARGV, ENV, __filename){
/**
* View for one of the signup field.  The actual textfield will forward the events to this parent view.
**/

KG.SignupField = SC.View.extend({
	
	classNames: 'signup-field'.w(),
	focus: NO,
	
	focusIn: function(e){
		this.set('focus', YES);
		KG.statechart.sendAction('focusInEvent', this, e);
		return YES;
	},
	
	focusOut: function(e){
		this.set('focus', NO);
		KG.statechart.sendAction('focusOutEvent', this, e);
		return NO;
	},
	
	keyDown: function(e){	
		return YES;
	},
	
	keyUp: function(e){		
		if(e.keyCode == 13){
			KG.statechart.sendAction('newLineEvent', this, e);
		}
		return NO;
	},
	
});

});