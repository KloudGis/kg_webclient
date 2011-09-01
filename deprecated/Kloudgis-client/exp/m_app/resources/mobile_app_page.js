sc_require('views/mobile_ol_map');
// This page describes the main user interface for your application.  
KG.mobileAppPage = SC.Page.design({

    mapview: SC.outlet('mainPane.mapView'),

    mainPane: SC.MainPane.design({
        defaultResponder: KG.statechart,

        childViews: 'mapView'.w(),

        mapView: KG.MobileOLMapView.design({}),
    })
});
