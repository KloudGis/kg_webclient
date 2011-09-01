sc_require('views/input')
Signup.NameView = Signup.InputView.extend({

    layerId: 'nameViewId',
    //trace: YES,
    init: function() {
        sc_super();
        this.get('textfield').bind('value', SC.Binding.from('Signup.signupController.name'));
    },

    //starting state
    startState: SC.State.design({

        enterState: function() {
            var view = this.get('statechart');
            view.labelView.set('value', 'Nom Complet:'),
            view.helpView.labelHelp.set('value', "Votre nom complet.");
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

        focusMissingState: SC.State.design({

            enterState: function() {
                var view = this.get('statechart');
                view.helpView.labelHelp.set('value', "Votre nom est requis.");
                view.displayDidChange();
            },

            renderView: function(context, firsttime) {
                context.setClass('focus', YES);
                context.setClass('error', YES);
                context.setClass('valid', NO);
            }
        }),

        focusOkState: SC.State.design({
	
			valid: YES,

            enterState: function() {
                var view = this.get('statechart');
                view.helpView.labelHelp.set('value', "Votre nom est valide.");
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

        initialSubstate: 'noFocusMissingState',

        focusInEvent: function(sender) {
            this.gotoState('transientFocusTestValid');
        },

        testEvent: function(sender) {
            this.gotoState('transientNoFocusTestValid');
        },

		noFocusMissingState: SC.State.design({

            enterState: function() {
                var view = this.get('statechart');
                view.helpView.labelHelp.set('value', "Votre nom est requis.");
                view.displayDidChange();
            },

            renderView: function(context, firsttime) {
                context.setClass('focus', NO);
                context.setClass('error', YES);
                context.setClass('valid', NO);
            }
        }),

        noFocusOkState: SC.State.design({
	
			valid: YES,

            enterState: function() {
                var view = this.get('statechart');
                view.helpView.labelHelp.set('value', "Votre nom est valide.");
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
            Signup.testName(this.get('statechart'));
        },

        missingEvent: function() {
            this.gotoState('focusMissingState');
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
            Signup.testName(this.get('statechart'));
        },

        missingEvent: function() {
            this.gotoState('noFocusMissingState');
        },

        okEvent: function() {
            this.gotoState('noFocusOkState');
        },

		focusInEvent: function(sender){
			this.gotoState('transientFocusTestValid');
		}
    })

});
