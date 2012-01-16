/**
* List of sandbox
**/
KG.sandboxesController = Ember.ArrayController.create({
	content: [],
	recordsReady:  NO,
	title: '',
		
	recordsReadyChange: function(){
		var val;
		if (this.get('recordsReady')) {
	        var count = this.get('length');
	        if (count > 0) {
				if(count === 1){
					val = "_sandboxesListOne".loc();
				}else{
	            	val = "_sandboxesList".loc(count);
				}
	        } else {
	            val = "_sandboxesNothing".loc();
	        }
	    }else{
			val =  '';
		}
		this.set('title', val);
	}.observes('recordsReady', 'content.length')
	
});