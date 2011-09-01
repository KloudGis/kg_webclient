sc_require('models/featuretype')
sc_require('models/record')
CoreKG.QuickFeature = CoreKG.Record.extend({
	
	fid: SC.Record.attr(Number),
	ft_id: SC.Record.attr(Number),
	descr: SC.Record.attr(String),
	geo_type: SC.Record.attr(String),
	coordinates: SC.Record.attr(Array),
	
	feature: function(){
		var ft = CoreKG.store.find(CoreKG.Featuretype, this.get('ft_id'));
		if(ft){
			return ft.getFeature(this.get('fid'));
		}
	}.property('ft_id', 'fid')
});