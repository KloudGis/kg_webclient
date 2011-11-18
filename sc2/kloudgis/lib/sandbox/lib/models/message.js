KG.Message = SC.Object.extend({
	
	author: null,
	type: null,
	content: null,
	dateMillis: null,
	
	toDatahash:function(){
		return {
			author: this.author,
			type : this.type,
			content: this.content,
			dateMillis: this.dateMillis
		};
	},
	
	formattedDate: function(){
		  var date = this.get('dateMillis');
	        if (date) {
	            return KG.core_date.formatDate(date);
	        }
	        return '';
	}.property('dateMillis')
	
});