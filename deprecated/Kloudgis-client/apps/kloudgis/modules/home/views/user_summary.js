KG.UserSummaryView = SC.View.extend({
	
	user: null,
	
	childViews: 'imageView nameView locView'.w(),
	
	imageView: SC.ImageView.design({
		useCanvas: NO,
		layout: {
			centerY: 0,
			left:0,
			height: 24,
			width:24,
		},
		valueBinding: '.parentView*user.image'
	}),
	
	nameView : SC.LabelView.design({
		classNames: 'username-label'.w(),
		layout:{
			centerY:-10,left:40, right:5, height: 20
		},
		valueBinding: '.parentView*user.label'
	}),
	
	locView : SC.LabelView.design({
		classNames: 'location-label'.w(),
		layout:{
			centerY:12,left:40, right:5, height: 20
		},
		valueBinding: '.parentView*user.location'
	})
});