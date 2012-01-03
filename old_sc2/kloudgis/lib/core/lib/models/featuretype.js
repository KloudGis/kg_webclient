/**
* Similar to Space FeatureType
**/
KG.Featuretype = KG.Record.extend({
	
	label: SC.Record.attr(String),
	title_attribute: SC.Record.attr(String),
	
	attrtypes: SC.Record.toMany('KG.Attrtype', {inverse: 'featuretype', isMaster: NO})
});