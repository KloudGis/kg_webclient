// ==========================================================================
// Project:   KG - loginPage
// Copyright: ©2010 Kloudgis.org
// ==========================================================================
/*globals Login */

KG.loginPage = SC.Page.design({

    mainPane: SC.MainPane.design({
        defaultResponder: KG.statechart,
        childViews: 'loginTemplate'.w(),

        loginTemplate: SC.TemplateView.design({
            layerId: 'login-pane',
            templateName: 'login'
        })
    })
});
