/**
* Multiples notes list for the popup.
**/
KG.notesPopupController = Ember.ArrayController.create({
	content: [],
	marker: null,
	popupTitle: function(){
		var m = this.get('marker');
		if(m){
			return m.get('title');
		}
		return '';
	}.property('marker')
});