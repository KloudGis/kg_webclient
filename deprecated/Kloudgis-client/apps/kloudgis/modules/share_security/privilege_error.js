//Display an popup when an error occur
KG.PrivilegeErrorState = SC.State.extend({

    alertController: null,

    message: '_privilegeMessage'.loc(),
    description: '_privilegeDescription'.loc(),
    caption: '_privilegeCaption'.loc(),

    enterState: function() {
        this.alertController = SC.Object.create({

            parentState: this,
            alertPaneDidDismiss: function(pane, status) {
                switch (status) {
                case SC.BUTTON1_STATUS:
                    this.parentState.get('statechart').sendEvent('okEvent');
                    break;
                }
            }
        });

        SC.AlertPane.warn({
            message:
            this.get('message'),
            description: this.get('description'),
            caption: this.get('caption'),
            delegate: this.alertController,
            buttons: [{
                title: '_Ok'.loc()
            }]
        });
    },

    exitState: function() {
        this.alertController = undefined;
    }
});
