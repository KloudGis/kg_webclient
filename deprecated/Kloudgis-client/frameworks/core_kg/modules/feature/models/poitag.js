sc_require('models/poi');
sc_require('models/record')
CoreKG.PoiTag = CoreKG.Record.extend(
/** @scope CoreKG.PoiTag.prototype */
{
    key: SC.Record.attr(String),
    value: SC.Record.attr(String),
    poi: SC.Record.toOne('CoreKG.Poi',{
		inverse: "tags",
		isMaster: YES
		
	})


});
