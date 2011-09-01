sc_require('views/input')
Signup.ConfirmPasswordView = Signup.InputView.extend({

	layerId: 'confirmPwdViewId',
    //trace: YES,
    init: function() {
        sc_super();
        this.get('textfield').set('isPassword', YES);
    },


  //starting state
    startState: SC.State.design({

        enterState: function() {
            var view = this.get('statechart');
            view.labelView.set('value', 'Confirmation:'),
			view.helpView.labelHelp.set('value', "Confirmez votre mot de passe secret.");
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

		passwordChangedEvent: function(sender) {
            this.gotoState('transientNoFocusTestValid');
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

        focusMismatchState: SC.State.design({

            enterState: function() {
                var view = this.get('statechart');
                view.helpView.labelHelp.set('value', "Les mots de passe ne correspondent pas.");
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
                view.helpView.labelHelp.set('value', "Les mots de passe concordent.");
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

        initialSubstate: 'noFocusMismatchState',

        focusInEvent: function(sender) {
            this.gotoState('transientFocusTestValid');
        },

        testEvent: function(sender) {
            this.gotoState('transientNoFocusTestValid');
        },

		passwordChangedEvent: function(sender) {
            this.gotoState('transientNoFocusTestValid');
        },

		noFocusMismatchState: SC.State.design({

            enterState: function() {
                var view = this.get('statechart');
                view.helpView.labelHelp.set('value', "Les mots de passe ne correspondent pas.");
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
                view.helpView.labelHelp.set('value', "Les mots de passe concordent.");
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
            Signup.testConfirmPwd(this.get('statechart'));
        },

        mismatchEvent: function() {
            this.gotoState('focusMismatchState');
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
            Signup.testConfirmPwd(this.get('statechart'));
        },

        mismatchEvent: function() {
            this.gotoState('noFocusMismatchState');
        },

        okEvent: function() {
            this.gotoState('noFocusOkState');
        },

		focusInEvent: function(sender){
			this.gotoState('transientFocusTestValid');
		}
    })

});
