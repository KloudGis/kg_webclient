KG.SandboxListView = Ember.View.extend({
	classNameBindings: ['hidden', 'pushed'],
	hiddenBinding: 'KG.homePanelController.listSandboxHidden',
	pushedBinding: 'KG.homePanelController.listSandboxPushed'
})