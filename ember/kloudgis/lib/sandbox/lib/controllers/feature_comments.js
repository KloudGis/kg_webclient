/**
* List of Comments for the active feature.
**/
KG.featureCommentsController = KG.CommentsController.create({

	commentsBinding: Ember.Binding.oneWay('KG.inspectorController.feature.comments')
});