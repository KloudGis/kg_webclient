// ==========================================================================
// Project:   KG.featuresController
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Dbclient */

/** @class

  (Document Your Controller Here)

  @extends SC.ArrayController
*/
KG.featuresController = SC.ArrayController.create(
	SC.CollectionViewDelegate,
/** @scope KG.featuresController.prototype */ {

  	collectionViewDeleteContent: function(view, content, indexes) {
        var records = indexes.map(function(idx) {
            return this.objectAt(idx);
        },
        this);
		//confirm delete
        //records.invoke('destroy');
		
        var selIndex = indexes.get('min') - 1;
        
		//Modeladmin.statechart.sendEvent('deleteFeaturetype', this, records, selIndex);

    },

    selectionDidChanged: function() {
        console.log("selection changed!");
        var _ft = this.getSelectedFeaturetype();
        if(_ft){
			//Dbclient.statechart.sendEvent('featuretypeSelected', this , _ft);
		}
		

    }.observes('selection'),

    
    getSelectedFeaturetype: function() {
        var _sel = this.get('selection');
        if (_sel) {
            var _ft = _sel.get('firstObject');
            return _ft;
        }
        return NO;
    }

}) ;
