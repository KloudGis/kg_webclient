KG.FeedListItemView = SC.View.extend({
	
	isSelected : NO,
	
	displayProperties: 'isSelected'.w(),
	
	classNames: 'feed-list-item'.w(),
	
	childViews: 'projectView titleView descrView'.w(),
	
	projectView: SC.LabelView.design({
		classNames: 'feed-title-project'.w(),
		layout:{
			left:0, top:3, height:20,right:0
		},
		valueBinding: '.parentView.content*sandbox.name'
				
	}),
	
	titleView: SC.LabelView.design({
		classNames: 'feed-title-label'.w(),
		layout:{
			left:10, top:20, height:20,right:0
		},
		valueBinding: '.parentView.content.title'
	}),
	
	descrView: SC.LabelView.design({
		classNames: 'feed-descr-label'.w(),
		layout:{
			left:12, top:40, height:18,right:0
		},
		valueBinding: '.parentView.content.descr'
	}),
	
	render: function(context, firstTime){
		sc_super();
		var even = this.get('contentIndex')%2 === 0;
		context.setClass('even', even);
		context.setClass('odd', !even);
		context.setClass('feed-selected', this.get('isSelected'));
	}
	
});