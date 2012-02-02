KG.core_init = Ember.Object.create({

    _loginView: null,
    _homeView: null,
	_sandboxView: null,

    loadLoginCore: function() {
	    require('kloudgis/login/lib/strings');
        require('kloudgis/login/lib/core_login');
    },

    loadLoginPage: function() {
        if (!this._loginView) {
            this._loginView = SC.View.create({
                templateName: "login-page"
            });
            this._loginView.appendTo('#super-pages');
        }
    },

    loadHomePage: function() {
        if (!this._homeView) {
            //login-page
            this._homeView = SC.View.create({
                templateName: "home-page"
            });
            this._homeView.appendTo('#super-pages');
        }
    },

    loadSandboxPage: function() {
        if (!this._sandboxView) {
            this._sandboxView = SC.View.create({
                templateName: "sandbox-page"
            });
            this._sandboxView.appendTo('#super-pages');
        }
    }
});
