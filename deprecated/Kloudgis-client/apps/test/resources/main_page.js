// ==========================================================================
// Project:   Test - mainPage
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Test */

// This page describes the main user interface for your application.  
sc_require('views/upload_file')
Test.mainPage = SC.Page.design({
    mainPane: SC.MainPane.design({
        childViews: 'scrollView'.w(),

        scrollView: SC.ScrollView.design({
            //canScale: YES,
            //horizontalAlign: SC.ALIGN_CENTER,
            //verticalAlign: SC.ALIGN_MIDDLE,
            //  alwaysBounceHorizontal: YES,
            contentView: SC.View.design({

                layout: {
                    width: 800,
                    height: 600,
					centerX:0,
					centerY:0
                },
                childViews: 'label button'.w(),
                backgroundColor: 'red',

                label: SC.LabelView.design({
                    layout: {
                        width: 200,
                        height: 18
                    },

                    textAlign: SC.ALIGN_CENTER,
                    tagName: "h1",
                    value: "Welcome to SproutCore!"
                }),

                button: SC.ButtonView.design({
                    layout: {
                        width: 120,
                        height: 24,
                        bottom: 0,
                        centerX: 0
                    },
                    title: 'Button'
                })
            })
        })
    })
});
