//feature info result
KG.infoController = SC.ArrayProxy.create({
	content: [],
	
	featureCount: function(){
		return this.getPath('content.length');
	}.property('content.length'),
	
	popupMessage: function(){
		return this.getPath('content.firstObject.summary');
	}.property('content.firstObject.summary')
});