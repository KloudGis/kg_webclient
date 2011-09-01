// ==========================================================================
// Project:   Signup - successPage
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Signup */

// This page describes the main user interface for your application.  
Signup.successPage = SC.Page.design({

    // The main pane is made visible on screen as soon as your app is loaded.
    // Add childViews to this pane for views to display immediately on page 
    // load.
    mainPane: SC.MainPane.design({
		defaultResponder: Signup.statechart,
        childViews: 'mainView'.w(),

        mainView: SC.WellView.design({
            layout: {
                width: 600,
                height: 400,
                centerX: 0,
                centerY: 0
            },

            contentView: SC.View.design({
                childViews: 'logoView labelView loginView'.w(),

				logoView: SC.ImageView.design({
					layout: {
		                width: 256,
		                height: 256,
		                centerX: 0,
		                centerY: -90
		            },
					value: sc_static('images/kloudgis_black_256.png')
				}),

                labelView: SC.LabelView.design({
                    classNames: 'success-label'.w(),
                    layout: {
                        centerY: 50,
                        left: 0,
                        height: 48,
                        right: 0
                    },
                    textAlign: SC.ALIGN_CENTER,
                    valueBinding: 'Signup.signupController.successMessage'
                }),

                loginView: SC.ButtonView.design({
                    layout: {
                        centerX: 0,
                        centerY: 98,
                        height: 24,
                        width: 120
                    },

                    title: 'Se connecter',
					action: 'gotoLogin',
					isDefault: YES
                })
            })
        })
    })
});
