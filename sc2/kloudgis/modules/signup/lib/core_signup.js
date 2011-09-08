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
                url: '/kg_auth/public/register',
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
            var url = '/kg_auth/public/register/test_email';
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
