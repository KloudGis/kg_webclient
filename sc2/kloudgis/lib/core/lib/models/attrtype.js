require('./record');
/**
*  Similar to space AttrType
**/
KG.Attrtype = KG.Record.extend({
	
	label: SC.Record.attr(String),
	type: SC.Record.attr(String),
	attr_ref: SC.Record.attr(String),
	featuretype: SC.Record.toOne('KG.Featuretype', {inverse: 'attrtypes', isMaster: YES}),
});