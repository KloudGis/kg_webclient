/**
* List of feature attributes to render in the inspector.
**/
KG.inspectorController = SC.ArrayProxy.create({
	//attributes
	content: [],
	feature: null,
	
	title: function() {
        var f = this.get('feature');
		if(f){
			return f.get('ft') || f.get('title');
		}
    }.property('feature'),

	closeLabel: "_closeInspector".loc()
});