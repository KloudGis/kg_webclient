KG.SwitchView = SC.View.extend({
	
	class: 'switch',
	
	on: function(){
		return this.getPath('itemView.content.value');
	}.property('itemView.content.value'),
});