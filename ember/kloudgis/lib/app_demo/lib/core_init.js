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
            require('kloudgis/view/lib/views/text_field');
            require('kloudgis/view/lib/views/loading_image');
            require('kloudgis/view/lib/views/button');
            //login-page
            Ember.TEMPLATES['login-page'] = spade.require('kloudgis/app_demo/templates/login_page');
            this._loginView = SC.View.create({
                templateName: "login-page"
            });
            this._loginView.appendTo('#super-pages');
        }
    },

    loadHomePage: function() {
        if (!this._homeView) {
            require('kloudgis/home/lib/main');
            //login-page
            Ember.TEMPLATES['home-page'] = spade.require('kloudgis/app_demo/templates/home_page');
            this._homeView = SC.View.create({
                templateName: "home-page"
            });
            this._homeView.appendTo('#super-pages');
        }
    },

    loadSandboxPage: function() {
        if (!this._sandboxView) {
            require('kloudgis/sandbox/lib/main');
            //sandbox-page
            Ember.TEMPLATES['sandbox-page'] = spade.require('kloudgis/app_demo/templates/sandbox_page');
            this._sandboxView = SC.View.create({
                templateName: "sandbox-page"
            });
            this._sandboxView.appendTo('#super-pages');
        }
    }
});
