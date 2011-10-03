//render an attribute in the inspector
KG.InspectorAttributeView = SC.View.extend({
	
	_renderer: null,
	
	destroy: function() {
		console.log('inspector attribute destroy!!');
		this._super();
		if(!SC.none(this._renderer)){
			this._renderer.destroy();
			this._renderer = null;
		}
	},
	
	didInsertElement: function(){
		var ren;
		if(!SC.none(this._renderer)){
			this._renderer.destroy();
		}
		var renderer = this.getPath('itemView.content.renderer');
		if(renderer && SC.TEMPLATES[renderer]){
			ren = SC.View.create({templateName: renderer, parentView: this});
		}else{
			ren = SC.View.create({templateName: 'read-only-renderer', parentView: this});
		}
		ren.appendTo(this.get('element'));
		this._renderer = ren;
	}
});