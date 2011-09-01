// ==========================================================================
// Project:   KG.quickSelectionController
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals KG */

/** @class

  List of selected features

  @extends SC.ArrayController
*/
KG.quickSelectionController = SC.ArrayController.create({

    allowsMultipleSelection: NO,

    //lon lat location
    location: null,

    lengthDidChange: function() {
        if (KG.statechart.statechartIsInitialized) {
            //selection size change
            //SC.Logger.debug('quick changed %@ for location %@'.fmt(this.get('length'), this.get('location')));
            if (this.get('length') > 0) {
                KG.statechart.sendEvent('qFeaturesFoundEvent', this, this.get('location'));
            } else {
                KG.statechart.sendEvent('qFeaturesFoundClearedEvent');
            }
        }
    }.observes('length')
});
