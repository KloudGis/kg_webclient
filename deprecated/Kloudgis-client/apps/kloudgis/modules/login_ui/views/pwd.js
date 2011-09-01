KG.PwdView = SC.TextField.extend({
	
	valueBinding: 'KG.loginController.pwd',
    insertNewline: function() {
        KG.statechart.sendEvent('loginAction', this);
    }
});
