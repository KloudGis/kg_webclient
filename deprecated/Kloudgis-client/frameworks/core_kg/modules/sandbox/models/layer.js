CoreKG.Layer = SC.Record.extend(
/** @scope CoreKG.Layer.prototype */
{
	//options
	label: SC.Record.attr(String),
    renderOrder: SC.Record.attr(Number),
    isGroupedLayer: SC.Record.attr(Boolean),
    isGroupLayer: SC.Record.attr(Boolean),
    isSelectable: SC.Record.attr(Boolean),
	featuretype: SC.Record.toOne('CoreKG.Featuretype'),
	//wms param
    name: SC.Record.attr(String),
    url: SC.Record.attr(String),
    visibility: SC.Record.attr(Boolean),
    buffer: SC.Record.attr(Number),
    displayOutsideExtent: SC.Record.attr(Boolean)
});
