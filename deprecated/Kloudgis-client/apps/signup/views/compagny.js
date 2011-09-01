sc_require('views/input')
Signup.CompagnyView = Signup.InputView.extend({

    layerId: 'cieViewId',
    //trace: YES,
    init: function() {
        sc_super();
        this.get('textfield').bind('value', SC.Binding.from('Signup.signupController.compagny'));
    },

    //starting state
    startState: SC.State.design({

        enterState: function() {
            var view = this.get('statechart');
            view.labelView.set('value', 'Compagnie:'),
            view.helpView.labelHelp.set('value', "La companie pour laquelle vous travaillez.");
            view.displayDidChange();
        },

        focusInEvent: function(sender) {
            this.gotoState('focusFirstTimeState');
        },

        testEvent: function(sender) {
            this.gotoState('transientNoFocusTestValid');
        }
    }),

    //focused states
    focusIn: SC.State.design({

        initialSubstate: 'focusFirstTimeState',

        focusOutEvent: function(sender) {
            this.gotoState('transientNoFocusTestValid');
        },

        testEvent: function(sender) {
            this.gotoState('transientFocusTestValid');
        },

        keyUpEvent: function(sender, keyCode) {
            if (keyCode !== 9) {
                if (this._timer) {
                    this._timer.invalidate();
                }
                this._timer = SC.Timer.schedule({
                    target: this,
                    action: 'timerFired',
                    interval: 100,
                    repeats: NO
                });
            }
        },

        timerFired: function() {
			this.get('statechart').sendEvent('testEvent', this);
        },

        focusFirstTimeState: SC.State.design({

            enterState: function() {
                var view = this.get('statechart');
                view.displayDidChange();
            },

            renderView: function(context, firsttime) {
                context.setClass('focus', YES);
                context.setClass('error', NO);
                context.setClass('valid', NO);
            }
        }),

        focusOkState: SC.State.design({
			
			valid: YES,

            enterState: function() {
                var view = this.get('statechart');
                view.helpView.labelHelp.set('value', "Votre compangie est valide.");
                view.displayDidChange();
            },

            renderView: function(context, firsttime) {
                context.setClass('focus', YES);
                context.setClass('error', NO);
                context.setClass('valid', YES);
            }
        })
    }),

    //NOT focused states
    focusOut: SC.State.design({

        initialSubstate: 'noFocusOkState',

        focusInEvent: function(sender) {
            this.gotoState('transientFocusTestValid');
        },

        testEvent: function(sender) {
            this.gotoState('transientNoFocusTestValid');
        },

        noFocusOkState: SC.State.design({
	
			valid: YES,

            enterState: function() {
                var view = this.get('statechart');
                view.helpView.labelHelp.set('value', "Votre compangie est valide.");
                view.displayDidChange();
            },

            renderView: function(context, firsttime) {
                context.setClass('focus', NO);
                context.setClass('error', NO);
                context.setClass('valid', YES);
            }
        })
    }),

    //transient state to perform validation test
    transientFocusTestValid: SC.State.design({

        enterState: function() {
            Signup.testCompagny(this.get('statechart'));
        },

        okEvent: function() {
            this.gotoState('focusOkState');
        },

		focusOutEvent: function(sender){
			this.gotoState('transientNoFocusTestValid');
		}
    }),

    transientNoFocusTestValid: SC.State.design({

        enterState: function() {
            Signup.testCompagny(this.get('statechart'));
        },

        okEvent: function() {
            this.gotoState('noFocusOkState');
        },

		focusInEvent: function(sender){
			this.gotoState('transientFocusTestValid');
		}
    })

});
