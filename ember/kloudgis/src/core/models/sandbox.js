/**
* Sandbox record class.
**/
KG.Sandbox = KG.Record.extend({

	//id is the sandbox KEY
	name: SC.Record.attr(String),	
	owner: SC.Record.attr(Number),
	ownerDescriptor: SC.Record.attr(String),
	
	lat: SC.Record.attr(Number),
	lon: SC.Record.attr(Number),
	zoom: SC.Record.attr(Number),
	
	
	formattedDescription: function(){
		return "_sandboxDescription".loc(this.get('ownerDescriptor'), this.get('formattedDate'));
	}.property('formattedDate', 'ownerDescriptor')
});