KG.ProjectGridView = SC.ContainerView.extend(SC.Control, {

    classNames: 'project-item'.w(),

    contentView: SC.View.design({

        classNames: 'project-content'.w(),

        layout: {
            top: 10,
            left: 10,
            bottom: 10,
            right: 10
        },

        childViews: 'titleView openButtonView browseButtonView'.w(),

        titleView: SC.LabelView.design({
            classNames: 'project-label'.w(),
            layout: {
                centerY: 0,
                left: 0,
                right: 0,
                height: 24
            },
            valueBinding: '.parentView.parentView.value',
        }),

        /*iconView: SC.ImageView.design({
            layout: {
                centerX: 0,
                width: 60,
                height: 60,
                centerY: 0
            },
            value: ''
        }),*/

        openButtonView: SC.ButtonView.design({
            layout: {
                centerX: 0,
                width: 120,
                height: 24,
                bottom: 45
            },
            isVisibleBinding: '.parentView.parentView.isSelected',
			title: '_OpenProject'.loc(),
			action: 'openProjectEvent'
        }),

		browseButtonView: SC.ButtonView.design({
            layout: {
                centerX: 0,
                width: 120,
                height: 24,
                bottom: 10
            },
            isVisibleBinding: '.parentView.parentView.isSelected',
			title: '_BrowseDataProject'.loc(),
			action: 'browseProjectDataEvent'
        })

    })
});
