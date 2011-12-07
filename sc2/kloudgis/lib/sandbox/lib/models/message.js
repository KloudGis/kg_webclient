KG.Message = SC.Object.extend({
	
	author: null,
	type: null,
	content: null,
	dateMillis: null,
	
	formattedContent: function(){
		var content = this.getPath('content.text');
		if(content){
			//replace \n with <br> to enforce line break
			return content.replace(/\n/g, '<br>');
		}
		return content;
	}.property('content'),
	
	toDataHash:function(){
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
	}.property('dateMillis'),
	
	/* to be used by SC.isEqual*/
	isEqual: function(b){
		if(b.toDataHash){
			var aH = this.toDataHash();
			var bH = b.toDataHash();
			return JSON.stringify(aH) === JSON.stringify(bH);
		}
		return NO;
	}
	
});