KG.SwitchView = KG.Button.extend({
	
	classNames: ['switch'],
	tagName: 'div',
	
	on: function(key, value){
		if(value !== undefined){
			this.setPath('itemView.content.value', value);
		}
		return this.getPath('itemView.content.value');
	}.property('itemView.content.value'),
	
	mouseUp: function(e) {
		this._super(e);
		this.set('on', !this.get('on'));
	}
});