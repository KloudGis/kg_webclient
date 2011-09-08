KG.OpenSandboxLinkView = SC.View.extend({
	
	attributeBindings: ['href'],
	
	title: function(){
		return this.getPath('itemView.content.name');	
	}.property(),
	
	href: function(){
		return "sandbox.html?id=" + this.getPath('itemView.content.id');
	}.property()
	
});