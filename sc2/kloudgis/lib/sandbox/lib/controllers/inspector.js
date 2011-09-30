//selected feature in the inspector view
//with all the attributes
KG.inspectorController = SC.ArrayProxy.create({
	//attributes
	content: [],
	feature: null,
	
	title: function() {
        var f = this.get('feature');
		if(f){
			return f.get('featuretype') || f.get('title');
		}
    }.property('feature'),

	closeLabel: "_closeInspector".loc()
});