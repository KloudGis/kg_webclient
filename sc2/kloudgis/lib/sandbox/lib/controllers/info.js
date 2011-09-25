//feature info result
KG.infoController = SC.ArrayProxy.create({
	content: [],
	
	hasSelection: function(){
		return this.getPath('content.length') > 0;
	}.property('content.length')
});