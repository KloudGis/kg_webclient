/*
	Wrapper on a feature with a specific attrtype.
*/
KG.Attribute = SC.Object.extend({
	
	feature: null,
	attrtype: null,
	
	label: function(){
		return this.getPath('attrtype.label'); 
	}.property().cacheable(),
	
	renderer: function(){
		var type = this.getPath('attrtype.type'); 
		if(!type || type === 'text'){
			return 'text-renderer';
		}
		return 'read-only-renderer';
	}.property(), 
		
	value: function(key, value){
		var ref = this.getPath('attrtype.attr_ref');
		var feature = this.get('feature');
		if(value){
			feature.set(ref, value);
		}
		return feature.get(ref);
	}.property()

	
});