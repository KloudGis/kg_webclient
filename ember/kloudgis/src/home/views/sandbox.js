//super view to show the sandbox properties
KG.SandboxView = KG.Button.extend({

    triggerAction: function() {
		console.log('open!!');
        KG.statechart.sendAction('openSandboxAction', this.getPath('itemView.content.guid'));
    }
});
