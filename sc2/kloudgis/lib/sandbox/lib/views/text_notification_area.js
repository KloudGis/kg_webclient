KG.TextNotificationAreaView = KG.TextArea.extend({

    insertNewline: function(event) {
        if (KG.sendNotificationController.get('sendOnEnterValue')) {
            KG.statechart.sendAction('sendNotificationAction');
        }
    },
});
