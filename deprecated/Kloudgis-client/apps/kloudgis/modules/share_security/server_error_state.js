//Display an popup when an error occur
KG.ServerErrorState = SC.State.extend({

    alertController: null,

    message: '_serverErrorMessage'.loc(),
    description: '_serverErrorDescription'.loc(),
    caption: '_serverErrorCaption'.loc(),

    enterState: function() {
        this.alertController = SC.Object.create({

            parentState: this,

            alertPaneDidDismiss: function(pane, status) {
                switch (status) {
                case SC.BUTTON1_STATUS:
                    this.parentState.get('statechart').sendEvent('serverErrorTryAgainEvent');
                    break;

                case SC.BUTTON2_STATUS:
                    this.parentState.get('statechart').sendEvent('serverErrorQuitEvent');
                    break;
                }
            }
        });

		SC.AlertPane.warn({
		  message: this.get('message'),
		  description: this.get('description'),
		  caption: this.get('caption'),
		  delegate: this.alertController,
		  buttons: [
		    { title: '_serverErrorTryAgain'.loc() },
		    { title: '_serverErrorQuit'.loc() }		    
		  ]
		});
    },

    exitState: function() {
        this.alertController = undefined;
    }
});
