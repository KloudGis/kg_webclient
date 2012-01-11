KG.SelectView = SC.View.extend({
    value: null,

    valueChanged: function(){
        this.$('select').val( this.get('value') );
    }.observes('value'),

    didInsertElement: function(){
        var self = this;
		this.valueChanged();
        this.$('select').change(function(){
            var val = self.$('select option:selected').val();
            self.set('value', val);
        });		
    }
});