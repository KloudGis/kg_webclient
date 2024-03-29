/**
* View to open a sandbox: Go to the sandbox page (map). 
**/
KG.OpenSandboxLinkView = SC.View.extend({
	
	attributeBindings: ['href'],
	
	title: function(){
		return this.getPath('itemView.content.name');	
	}.property(),
	
	href: function(){
		return "sandbox.html?sandbox=" + this.getPath('itemView.content.key');
	}.property()
	
});