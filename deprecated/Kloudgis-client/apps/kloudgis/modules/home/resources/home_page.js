// ==========================================================================
// Project:   KG - mainPage
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals KG */

// This page describes the main user interface for your application.  
sc_require('views/feed_list_item')
sc_require('views/project_grid')
sc_require('views/user_summary')
KG.homePage = SC.Page.design({

    // The main pane is made visible on screen as soon as your app is loaded.
    // Add childViews to this pane for views to display immediately on page 
    // load.
    mainPane: SC.MainPane.design({
        defaultResponder: KG.statechart,

        childViews: 'tbView splitView'.w(),

        tbView: SC.ToolbarView.design({

            childViews: 'buttonLogout'.w(),

            buttonLogout: SC.ButtonView.design({
                layout: {
                    right: 3,
                    centerY: 0,
                    width: 100,
                    height: 24
                },
                title: 'Logout',
                action: 'logoutEvent'
            })
        }),

        splitView: SC.SplitView.design({
			layout: {
                top: 33,
            },
		//	dividerThickness: 3,
			bottomRightMinThickness: 150,
			defaultThickness: 0.7,
			layoutDirection: SC.LAYOUT_HORIZONTAL,
	        autorisizeBehavior: SC.REZISE_TOP_LEFT,
            topLeftView: SC.ScrollView.design({  
                contentView: SC.GridView.design({
                    rowHeight: 200,
                    columnWidth: 200,
                    contentValueKey: "name",
                    contentBinding: 'KG.projectsController.content',
                    selectionBinding: 'KG.projectsController.selection',
                    exampleView: KG.ProjectGridView,

                    mouseMoved: function(ev) {
                        sc_super();
                        var view = this.itemViewForEvent(ev);
                        if (view) {
                            //select on mouse move
                            this.select(this.contentIndexForLayerId(view.get('layerId')), NO);
                        }
                        return YES;
                    },

                })
            }),

            bottomRightView: SC.View.design({
                layerId: 'side_panel',
                childViews: 'userSummaryView feedListView feedLabelView'.w(),

                userSummaryView: KG.UserSummaryView.design({
                    layout: {
                        top: 33,
                        right: 0,
                        left: 30,
                        height: 60
                    },
                    userBinding: 'KG.loggedUserController.content',
                }),

                feedLabelView: SC.LabelView.design({
                    layout: {
                        top: 95,
                        height: 30
                    },
                    classNames: 'feed-label'.w(),
                    value: '_Feeds'.loc()
                }),

                feedListView: SC.ContainerView.design({
                    classNames: 'feed-list-container'.w(),
                    layout: {
                        top: 120,
                        left: 10,
                        right: 10,
                        bottom: 10
                    },
                    contentView: SC.ScrollView.design({
                        layout: {
                            top: 5,
                            bottom: 5
                        },
                        contentView: SC.ListView.design({
                            rowHeight: 60,
                            contentBinding: 'KG.feedsController.content',
                            selectionBinding: 'KG.feedsController.selection',
                            exampleView: KG.FeedListItemView,
                        })
                    })
                })
            })
        })
    })
});
