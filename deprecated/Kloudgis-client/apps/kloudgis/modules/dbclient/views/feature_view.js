KG.FeatureView = SC.View.extend(
{

    childViews: "lblName txtName lblClass txtClass lblType txtType".w(),

    lblName: SC.LabelView.design({
        layout: {
            "width": 90,
            "left": 50,
            "top": 30,
            "height": 20
        },
        classNames: 'labels'.w(),
        textAlign: SC.ALIGN_LEFT,
        value: "Name"

    }),

    txtName: SC.TextFieldView.design({
        layout: {
            "width": 250,
            "left": 50,
            "top": 50,
            "height": 30
        },
        hint: "Attribute Name",
        //isEnabledBinding: 'KG.attrtypeFieldsEnabled',
        valueBinding: 'KG.activefeatureController.name'

    }),

    lblClass: SC.LabelView.design({
        layout: {
            "width": 90,
            "left": 50,
            "top": 80,
            "height": 20
        },
        classNames: 'labels'.w(),
        textAlign: SC.ALIGN_LEFT,
        value: "Class"

    }),

    txtClass: SC.TextFieldView.design({
        layout: {
            "width": 250,
            "left": 50,
            "top": 100,
            "height": 30
        },
        hint: "Attribute Feature Class",
        //isEnabledBinding: 'KG.attrtypeFieldsEnabled',
		valueBinding: 'KG.activefeatureController.featureClass' 
		
    }),

    lblType: SC.LabelView.design({
        layout: {
            "width": 90,
            "left": 50,
            "top": 130,
            "height": 20
        },
        classNames: 'labels'.w(),
        textAlign: SC.ALIGN_LEFT,
        value: "Type"

    }),

    txtType: SC.TextFieldView.design({
        layout: {
            "width": 250,
            "left": 50,
            "top": 150,
            "height": 30
        },
        
        valueBinding: 'KG.activefeatureController.type'

    })

    

});
