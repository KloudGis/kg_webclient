/**
* Layer class definition.
**/
KG.Layer = KG.Record.extend(
/** @scope CoreKG.Layer.prototype */
{
	//options
	label: SC.Record.attr(String),
    renderOrder: SC.Record.attr(Number),
    isSelectable: SC.Record.attr(Boolean),
    canRender: SC.Record.attr(Boolean),
	ft_it: SC.Record.attr(Number),
	//wms param
    name: SC.Record.attr(String),
    url: SC.Record.attr(String),
    visibility: SC.Record.attr(Boolean),
    buffer: SC.Record.attr(Number)
});
