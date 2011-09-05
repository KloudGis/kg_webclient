KG.core_signup = SC.Object.create({

    globalError: '',

    createAccount: function() {
        this.validateAllExceptUser();
        this.validateUser(this, this.validateUserCallback());
    },

    validateUserCallback: function() {
        var found = KG.fields.filterProperty('isValid', true);
        if (!found) {
            this.set('globalError', '');
        } else {
            this.set('globalError', '_correctErrorFirst');
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

    validate: function() {},

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
    }

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
KG.pwdFieldController = KG.FieldController.create();
KG.nameController = KG.FieldController.create();
KG.companyController = KG.FieldController.create();
KG.locationController = KG.FieldController.create();

KG.fields = [KG.userFieldController, KG.pwdFieldController, KG.nameController, KG.companyController, KG.locationController];

$(document).ready(function() {
    KG.statechart.initStatechart();
});
