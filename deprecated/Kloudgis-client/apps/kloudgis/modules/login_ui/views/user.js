KG.UserView = SC.TextField.extend({

    valueBinding: 'KG.loginController.user',

    insertNewline: function() {
        KG.statechart.sendEvent('loginAction', this);
    }
});
