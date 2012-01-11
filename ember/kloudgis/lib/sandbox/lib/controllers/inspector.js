/**
* List of feature attributes to render in the inspector.
**/
KG.inspectorController = Ember.ArrayController.create({
	//attributes
	content: [],
	feature: null,
	active: NO,
	
	//inspector title (top)
	title: function() {
        var f = this.get('feature');
		if(f){
			return f.get('title');
		}
    }.property('feature.title'),
	
	isDirty: function(){
		var dirty = this.getPath('feature.status') & SC.Record.DIRTY;
		return dirty > 0;
	}.property('feature.status'),
	
	cancelTitle: "_cancelInspector".loc(),
	
	saveTitle: function(){
		if(this.get('isDirty')){
			return "_saveInspectorTitle".loc();
		}else{
			"_closeInspectorTitle".loc();
		}
	}.property('isDirty'),
	
	saveLabel: function(){
		if(this.get('isDirty')){
			return "_saveInspectorLabel".loc();
		}else{
			return "_close".loc();
		}
	}.property('isDirty'),
	
	isReadOnly: function(){
		return !KG.core_sandbox.get('hasWriteAccess');
	}.property('KG.core_sandbox.hasWriteAccess')
});