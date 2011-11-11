KG.Message = SC.Object.extend({
	
	author: null,
	type: null,
	content: null,
	
	toDatahash:function(){
		return {
			author: this.author,
			type : this.type,
			content: this.content
		};
	}
	
});