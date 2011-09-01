SC.mixin(KG, {

    routes : SC.Object.create({
		
		activeRoute: null,
        gotoRoute: function(routeParams) {
			SC.Logger.debug('Routing to: ' + routeParams.pageName);
			var route = routeParams.pageName;
			this.set('activeRoute', route);
            KG.statechart.sendEvent('routeChangedEvent', this, route);
        },

		gotoActiveRoute: function(){
			KG.statechart.sendEvent('routeChangedEvent', this, this.get('activeRoute'));
		}
    })
});
