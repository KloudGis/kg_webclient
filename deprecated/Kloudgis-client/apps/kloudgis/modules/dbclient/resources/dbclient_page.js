// ==========================================================================
// Project:   Dbclient - mainPage
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Dbclient */

// This page describes the main user interface for your application.  
KG.dbclientPage = SC.Page.design({
 defaultResponder: KG.dbclient,

  mainPane: SC.MainPane.design({
    	childViews: 'topView splitView'.w(), /* bottomView */

      topView: SC.ToolbarView.design({
          childViews: 'addAtButton'.w(),
          layout: {
              top: 0,
              left: 0,
              right: 0,
              height: 36
          },
          anchorLocation: SC.ANCHOR_TOP,

          addAtButton: SC.ButtonView.design({
             
			layout: {
                  centerY: 0,
                  height: 24,
                  left: 122,
                  width: 100
              },
              title: "Create feature",
			  target: "KG",
              action: "createFeature"

              //isEnabledBinding: 'KG.buttonAddAttrTypeEnabled'
          })

      }),

      splitView: SC.SplitView.design({

          layout: {
              top: 36,
              bottom: 0,
              left: 0,
              right: 0

          },

          layoutDirection: SC.LAYOUT_HORIZONTAL,
          autorisizeBehavior: SC.REZISE_TOP_LEFT,
          defaultThickness: 0.1,

          topLeftView: SC.View.design({
              childViews: 'scroll tb'.w(),

              scroll: SC.ScrollView.design({
                  hasHorizontalScroll: NO,
                  layout: {
                      top: 0,
                      bottom: 32,
                      left: 0,
                      right: 0
                  },
                  contentView: SC.SourceListView.design({
                      
                      contentBinding: 'KG.featuretypesController.arrangedObjects',
                      selectionBinding: 'KG.featuretypesController.selection',
                      contentValueKey: "name",
                      canEditContent: YES,
                      canDeleteContent: YES
                  })

					
			        }),
					tb: SC.ToolbarView.design({
			           
						childViews: 'addFtButton'.w(),
			            layout: {
			                bottom: 0,
			                left: 0,
			                right: 0,
			                height: 32
			            },
						anchorLocation: SC.ANCHOR_BOTTOM,
						
			            addFtButton: SC.ButtonView.design({
			                layout: {
			                    centerY: 0,
			                    height: 24,
			                    left: 12,
			                    width: 100
			                }
			                //title: "Add Ft",
			                //target: "Modeladmin",
			                //action: "addFeatureType"
			            })
						
						
              })
          }),

          bottomRightView: SC.SplitView.design({
              layoutDirection: SC.LAYOUT_HORIZONTAL,
              autorisizeBehavior: SC.REZISE_TOP_LEFT,
              defaultThickness: 0.2,

              topLeftView: SC.ScrollView.design({
                  hasHorizontalScroll: NO,
                  layout: {
                      top: 36,
                      bottom: 0,
                      left: 0,
                      right: 0
                  },
                  contentView: SC.ListView.design({
                      contentBinding: 'KG.featuresController.arrangedObjects',
                      selectionBinding: 'KG.featuresController.selection',
					
                      canDeleteContent: YES,
                      contentValueKey: "name"

                  })

              }),

              bottomRightView: SC.ScrollView.design({
                  hasHorizontalScroll: NO,
                  layout: {
                      top: 36,
                      bottom: 0,
                      left: 0,
                      right: 0
                  },

                  contentView: KG.FeatureView.design({})
              }),

              topLeftMinThickness: 150,
              topLeftMaxThickness: 350,
              //dividerThickness: 1,
              dividerView: SC.SplitDividerView.design({

                  layout: {}
              })

          }),

          topLeftMinThickness: 150,
          topLeftMaxThickness: 450,
          //dividerThickness: 1,
          dividerView: SC.SplitDividerView.design({

              layout: {}
          })

      })
    
    
  })

});
