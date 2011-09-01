// ==========================================================================
// Project:   KG.selectionController
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals KG */

/** @class

  List of selected features

  @extends SC.ArrayController
*/
KG.selectionController = SC.ArrayController.create({
		
		allowsMultipleSelection: NO,
		
		selectFeature: function(feature, makeActive){
			//console.log('Selection controller: SELECT FEATURE: sk= %@'.fmt(feature.get('storeKey')));
			this.pushObject(feature);
			if(makeActive || this.getPath('selection.length') === 0){
				//console.log('Selection controller: ACTIVE SELECT FEATURE: sk= %@'.fmt(feature.get('storeKey')));
				this.selectObject(feature);
			}
			//give some time to let the binding update
			this.invokeLater(function(){
				KG.statechart.sendEvent('featuresSelectedEvent');
			},1);
		},
		
		clearSelection:function(){
			this.set('content', []);
			KG.statechart.sendEvent('featureSelectionClearedEvent');
		},
		
		selectionDidChange: function(){	
			//console.log('Selection controller: selection did change');
			//console.log(this.get('selection').get('firstObject'));
			//give some time to let the binding update
			this.invokeLater(function(){
				KG.statechart.sendEvent('activeSelectionChangedEvent', this);
			},1);		
		}.observes('selection')
});