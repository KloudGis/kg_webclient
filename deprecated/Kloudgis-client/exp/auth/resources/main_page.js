// ==========================================================================
// Project:   Auth - mainPage
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Auth */

// This page describes the main user interface for your application.  
Auth.mainPage = SC.Page.design({

    // The main pane is made visible on screen as soon as your app is loaded.
    // Add childViews to this pane for views to display immediately on page 
    // load.
    mainPane: SC.MainPane.design({
        childViews: 'scrollView'.w(),

        scrollView: SC.ScrollView.design({
            layout: {
                centerX: 0,
                centerY: 0,
                width: 200,
                height: 200
            },
            contentView: SC.ListView.design({
                contentValueKey: "email",
                contentBinding: 'Auth.testController.arrangedObjects'
            })
        })
    })
});
