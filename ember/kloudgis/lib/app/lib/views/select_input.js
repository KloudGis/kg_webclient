KG.otherKey = '|?|';
KG.SelectInputView = Ember.View.extend({
	
	value: null,
	
	keyName: 'key',
	
	didInsertElement: function(){
        var self = this;
		this.valueChanged();	
    },

    valueChanged: function(){
		var content = this.get('content');
		var value = this.get('value');
		var found = NO;
		if(content){
			found = content.findProperty(this.get('keyName'), value);
		}
		if(!found){
			this.set('valueSelect', KG.otherKey);
			this.set('valueInput', value);
		}else{
			this.set('valueSelect', found.key);
		}
    }.observes('value'),

	valueSelect: null,
	
	valueSelectChanged: function(){
		var sv = this.get('valueSelect');
		console.log('select view value:' + sv);
		if(sv === KG.otherKey){
			this.set('inputClass', 'visible-element');
		}else{
			var v = this.get('value');
			if(sv !== v){
				this.set('value', sv);
			}
			this.set('inputClass', 'not-visible-element');
		}
    }.observes('valueSelect'),

	valueInput: '',

    valueInputChanged: function(){
		var iv = this.get('valueInput');
        console.log('Input view value:' + iv);
		var v = this.get('value');
		if(iv !== v){
			this.set('value', iv);
		}
    }.observes('valueInput'),

	inputClass: 'not-visible-element'
});