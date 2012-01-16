/**
* Sandbox record class.
**/
KG.Sandbox = KG.Record.extend({

	name: SC.Record.attr(String),
	key: SC.Record.attr(String)	,	
	owner: SC.Record.attr(Number),
	ownerDescriptor: SC.Record.attr(String),
	
	lat: SC.Record.attr(Number),
	lon: SC.Record.attr(Number),
	zoom: SC.Record.attr(Number)
});