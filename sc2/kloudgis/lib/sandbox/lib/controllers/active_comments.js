//notes for the active note marker
KG.activeCommentsController = SC.ArrayProxy.create({
	content: null,
	
	showComments: NO,
	
	showing: NO,
	
	sortByDate: function(array){
		//sort by date
		if(SC.none(array)){
			return [];
		}
		return array.sort(function(a,b){
			var d1 = a.get('date');
			var d2 = b.get('date');
			return d1-d2;
		});
	},
	
	showButtonVisible: function(){
		if(!this.get('showComments')){
			return NO;
		}
		return this.get('showing');
	}.property('showing', 'showComments'),
	
	hideButtonVisible: function(){
		if(!this.get('showComments')){
			return NO;
		}
		return !this.get('showing');
	}.property('showing', 'showComments'),
	
	isCommentsReady: function(){
		return this.getPath('content.status') & SC.Record.READY;
	}.property('content.status'),
});