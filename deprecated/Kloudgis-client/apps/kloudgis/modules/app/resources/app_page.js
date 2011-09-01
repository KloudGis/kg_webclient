// ==========================================================================
// Project:   KG - appPage
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals KG */
sc_require('views/map');
// This page describes the main user interface for your application.  
KG.appPage = SC.Page.design({

    mapview: SC.outlet('mainPane.mainZoneView.mapView'),
    mainZoneView: SC.outlet('mainPane.mainZoneView'),

    mainPane: SC.MainPane.design({
        defaultResponder: KG.statechart,

        childViews: 'mainZoneView toolbarView'.w(),

        mainZoneView: SC.View.design( {

            childViews: 'mapView'.w(),

            mapView: KG.MapView.design(SC.Animatable,{
				transitions: {
	                left: {
	                    duration: 0.5,
	                    timing: SC.Animatable.TRANSITION_CSS_EASE
	                },
					bottom: {
	                    duration: 0.5,
	                    timing: SC.Animatable.TRANSITION_CSS_EASE
	                },
	            },
                layout: {
                    top: 33,
                    left: 0,
                    right: 0,
                    bottom: 0
                }
            }),

			/*pieView: KG.RPieView.design({
				layout: {
                    width: 500,
                    height: 300,
                    bottom: 0,
					right:0
                }
			})*/	
        }),

        toolbarView: SC.ToolbarView.design({

            childViews: 'labelView buttonHome buttonLogout clearButton'.w(),

            labelView: SC.LabelView.design({
                layout: {
                    centerX: 0,
                    centerY: 0,
                    width: 200,
                    height: 18
                },
                textAlign: SC.ALIGN_CENTER,
                tagName: "h1",
                valueBinding: "KG.projectController*content.name"
            }),

            buttonHome: SC.ButtonView.design({
                layout: {
                    centerX: 200,
                    centerY: 0,
                    width: 100,
                    height: 24
                },
                title: 'Home',
                action: 'gotoHomeEvent'
            }),

            buttonLogout: SC.ButtonView.design({
                layout: {
                    centerX: -200,
                    centerY: 0,
                    width: 100,
                    height: 24
                },
                title: 'Logout',
                action: 'logoutEvent',

            }),

          /*  upload: KG.UploadFileView.design({
                layout: {
                    left: 3,
                    centerY: 0,
                    width: 120,
                    height: 24
                },

                postUrl: "%@/upload".fmt(CoreKG.context_server),

                isMultiple: YES,

                fileFieldViewUploadProgress: function(evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                        console.log(percentComplete.toString() + '%');
                        KG.appPage.mainPane.labelView.set('value', percentComplete.toString() + '%');
                    }
                },
            }),*/

			clearButton: SC.ButtonView.design({
                layout: {
                    right: 3,
                    centerY: 0,
                    width: 120,
                    height: 24
                },

                title: 'Clear Selection',
                action: function() {
					KG.selectionController.clearSelection();
                }
            })
        })
    })
});
