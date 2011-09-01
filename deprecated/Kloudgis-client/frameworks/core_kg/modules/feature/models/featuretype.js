sc_require('models/record')
CoreKG.Featuretype = CoreKG.Record.extend(
/** @scope CoreKG.Featuretype.prototype */
{
    name: SC.Record.attr(String),
    label: SC.Record.attr(String),
    description: SC.Record.attr(String),
	class_name: SC.Record.attr(String),
	
	recordType: function() {
        var cName = this.get('class_name');
        if (cName && cName.length > 0) {
            return SC.objectForPropertyPath(cName);
        }
        return NO;
    }.property('class_name').cacheable(),

	createInstance: function(){
		var rec = this.get('recordType');
		var feature = CoreKG.store.createRecord(rec,{
			name: 'new feature',
		});	
		return feature;
	},
	
	getFeature: function(fid){
		var rec = this.get('recordType');
		var feature = CoreKG.store.find(rec, fid);
		return feature;
	}
	
});
