KG.core_home = SC.Object.create({

    loadData: function() {
        var rec = CoreKG.store.find(CoreKG.PROJECT_QUERY);
        KG.projectsController.set('content', rec);
        var feeds = CoreKG.store.find(CoreKG.FEED_QUERY);
        KG.feedsController.set('content', feeds);
    },

    cleanUp: function() {
        KG.projectsController.set('selection', null);
        if (KG.projectsController.get('content')) {
            KG.projectsController.get('content').destroy();
        }
        KG.projectsController.set('content', null);
        if (KG.feedsController.get('content')) {
            KG.feedsController.get('content').destroy();
        }
        KG.feedsController.set('content', null);
    },

    setActiveProject: function() {
        var project = KG.activeProjectController.get('content');
        KG.projectController.setProject(project);
    }
});
