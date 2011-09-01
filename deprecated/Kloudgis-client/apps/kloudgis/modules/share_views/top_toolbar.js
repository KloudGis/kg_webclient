KG.topToolbarView = SC.ToolbarView.extend({
    layout: {
        top: 0,
        left: 0,
        right: 0,
        height: 32
    },
	
	childViews: 'loggedUserView'.w(),
	
	loggedUserView: SC.ButtonView.design({
		layout:{
			width: 140,
			height:24,
			centerY:0,
			right:3
		}
	})
});