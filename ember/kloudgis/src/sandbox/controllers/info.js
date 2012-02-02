/**
* List of features found while doing a FeatureInfo.
**/
KG.infoController = Ember.ArrayController.create({
	content: [],
	
	//show/hide the other possible features 
	listVisible: NO,
	
	featureCount: function(){
		return this.getPath('content.length');
	}.property('content.length'),
	
	multipleFeatures:function(){
		return this.get('featureCount') > 1;
	}.property('featureCount'),
	
	firstFeature: function(){
		return this.getPath('content.firstObject');
	}.property('content', 'content.length'),
	
	allButFirst: function(){
		var content = this.get('content');
		if(content && content.get('length') > 0){
			var array = content.toArray();
			array.splice(0,1);
			return array;
		}else{
			return [];
		}
	}.property('content', 'content.length').cacheable()
});