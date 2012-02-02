KG.FeatureComment = KG.Comment.extend({
	
	feature: SC.Record.toOne('KG.Feature', {inverse: 'comments', isMaster: YES})
});