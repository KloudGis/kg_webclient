//notes for the active note marker
KG.activeCommentsController = SC.ArrayProxy.create({
	content: null,
	
	showing: NO,
	
	hidden: function(){
		return !this.get('showing');
	}.property('showing'),
	
	isCommentsReady: function(){
		return this.getPath('content.status') & SC.Record.READY;
	}.property('content.status'),
});