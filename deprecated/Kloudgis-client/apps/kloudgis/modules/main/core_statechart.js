sc_require('states/app');
sc_require('states/home');
sc_require('states/login');
SC.mixin(KG, {
    //global state chart
    statechart: SC.Statechart.create({
        //log trace
        //trace: YES,

        initialState: 'loginState',

        loginState: SC.State.plugin('KG.LoginState'),

        //check logged user
        runningState: SC.State.design({

            initialSubstate: 'activeRouteTransientState',

            activeRouteTransientState: SC.State.design({

                enterState: function() {
                    KG.routes.gotoActiveRoute();
                }
            }),

            homeState: SC.State.plugin('KG.HomeState'),

            projectState: SC.State.plugin('KG.AppState'),

            mobileProjectState: SC.State.plugin('KG.MobileAppState'),

            //dbclientState: SC.State.plugin('KG.DbclientState'),

            gotoHomeEvent: function() {
                this.gotoState('homeState');
            },

            logoutEvent: function() {
                KG.logoutAction();
            },

            gotoLoginEvent: function() {
                this.gotoState('loginState');
            },

            routeChangedEvent: function(sender, route) {
                if (SC.none(route)) {
                    this.gotoState('homeState');
                } else if (route === 'logout') {
                    this.logoutAction();
                } else {
                    this.gotoState('homeState');
                }
            }
        })
    })
});
