KG.AddSandboxView = Ember.View.extend({
	classNameBindings: ['hidden', 'pushed'],
	hiddenBinding: 'KG.homePanelController.addSandboxHidden',
	pushedBinding: 'KG.homePanelController.addSandboxPushed',
})