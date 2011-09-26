//feature info result
KG.infoController = SC.ArrayProxy.create({
	content: [],
	
	featureCount: function(){
		return this.getPath('content.length');
	}.property('content.length')
});