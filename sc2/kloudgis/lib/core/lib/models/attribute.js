KG.Attribute = SC.Object.extend({
	
	name: null,
	value: null,
	renderer: null,// 'text-renderer',
	isDirty: NO,
	
	charCount: function(){
		var v = this.get('value');
		if(v && v.length){
			return v.length; 
		}
		return 0;
	}.property('value'),
	
	valueDidChange: function(){
		this.set('isDirty', YES);
	}.observes('value')
});