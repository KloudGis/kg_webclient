KG.SwitchView = KG.Button.extend({
	
	classNames: ['switch'],
	tagName: 'div',
	
	value: null, 
	
	on: function(key, value){
		if(value !== undefined){
			this.setPath('value', value);
		}
		return this.getPath('value');
	}.property('value'),
	
	mouseUp: function(e) {
		this._super(e);
		this.set('on', !this.get('on'));
	}
});