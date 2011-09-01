sc_require('views/input')
Signup.EmailView = Signup.InputView.extend({

    //trace: YES,

    layerId: 'emailViewId',

    childViews: 'labelView textView helpView progressView'.w(),

    //anim gif while checking if the email is available
    progressView: SC.ImageView.design({

        layout: {
            left: 378,
            width: 16,
            height: 16,
            centerY: -4
        },
        value: sc_static('images/loading.gif'),
		useCanvas: NO,
        isVisibleBinding: 'Signup.signupController.isCheckEmail'
    }),

    //bind the textfield to the email field in the controller
    init: function() {
        sc_super();
        this.get('textfield').bind('value', SC.Binding.from('Signup.signupController.user'));
    },

    //starting state
    startState: SC.State.design({

        enterState: function() {
            var view = this.get('statechart');
            view.labelView.set('value', 'Courriel:'),
            view.helpView.labelHelp.set('value', "Sert d'identifiant pour ce connecter.");
            view.displayDidChange();
            //grab focus
            view.getPath('textView.fieldView').becomeFirstResponder();
        },

        focusInEvent: function(sender) {
            this.gotoState('focusFirstTimeState');
        },

        testEvent: function(sender) {
            this.gotoState('transientNoFocusTestValid');
        }
    }),

    //focused state
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
                    interval: 500,
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
                view.helpView.labelHelp.set('value', "Un courriel est requis.");
                view.displayDidChange();
            },

            renderView: function(context, firsttime) {
                context.setClass('focus', YES);
                context.setClass('error', YES);
                context.setClass('valid', NO);
            }
        }),

        focusTakenState: SC.State.design({

            enterState: function() {
                var view = this.get('statechart');
                view.helpView.labelHelp.set('value', "Ce courriel n'est pas disponible.");
                view.displayDidChange();
            },

            renderView: function(context, firsttime) {
                context.setClass('focus', YES);
                context.setClass('error', YES);
                context.setClass('valid', NO);
            }
        }),

        focusInvalidState: SC.State.design({

            enterState: function() {
                var view = this.get('statechart');
                view.helpView.labelHelp.set('value', "Ce courriel n'est pas valide.");
                view.displayDidChange();
            },

            renderView: function(context, firsttime) {
                context.setClass('focus', YES);
                context.setClass('error', YES);
                context.setClass('valid', NO);
            }
        }),

        focusServerErrorState: SC.State.design({

            enterState: function() {
                var view = this.get('statechart');
                view.helpView.labelHelp.set('value', "Erreur du serveur.");
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
                view.helpView.labelHelp.set('value', "Le courriel est valide.");
                view.displayDidChange();
            },

            renderView: function(context, firsttime) {
                context.setClass('focus', YES);
                context.setClass('error', NO);
                context.setClass('valid', YES);
            }

        }),

    }),

    //NOT focused state
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
                view.helpView.labelHelp.set('value', "Un courriel est requis.");
                view.displayDidChange();
            },

            renderView: function(context, firsttime) {
                context.setClass('focus', NO);
                context.setClass('error', YES);
                context.setClass('valid', NO);
            }
        }),

        noFocusTakenState: SC.State.design({

            enterState: function() {
                var view = this.get('statechart');
                view.helpView.labelHelp.set('value', "Ce courriel n'est pas disponible.");
                view.displayDidChange();
            },

            renderView: function(context, firsttime) {
                context.setClass('focus', NO);
                context.setClass('error', YES);
                context.setClass('valid', NO);
            }
        }),

        noFocusInvalidState: SC.State.design({

            enterState: function() {
                var view = this.get('statechart');
                view.helpView.labelHelp.set('value', "Ce courriel n'est pas valide.");
                view.displayDidChange();
            },

            renderView: function(context, firsttime) {
                context.setClass('focus', NO);
                context.setClass('error', YES);
                context.setClass('valid', NO);
            }
        }),

        noFocusServerErrorState: SC.State.design({

            enterState: function() {
                var view = this.get('statechart');
                view.helpView.labelHelp.set('value', "Erreur du serveur.");
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
                view.helpView.labelHelp.set('value', "Le courriel est valide.");
                view.displayDidChange();
            },

            renderView: function(context, firsttime) {
                context.setClass('focus', NO);
                context.setClass('error', NO);
                context.setClass('valid', YES);
            }
        }),

    }),

    //transient state to perform validation test
    transientFocusTestValid: SC.State.design({

        enterState: function() {
            Signup.testEmail(this.get('statechart'));
        },

        missingEvent: function(sender) {
            this.gotoState('focusMissingState');
        },

        takenEvent: function(sender) {
            this.gotoState('focusTakenState');
        },

        serverErrorEvent: function(sender) {
            this.gotoState('focusServerErrorState');
        },

        invalidEvent: function(sender) {
            this.gotoState('focusInvalidState');
        },

        okEvent: function(sender) {
            this.gotoState('focusOkState');
        },

		focusOutEvent: function(sender){
			this.gotoState('transientNoFocusTestValid');
		}
    }),

    transientNoFocusTestValid: SC.State.design({

        enterState: function() {
            Signup.testEmail(this.get('statechart'));
        },

        missingEvent: function(sender) {
            this.gotoState('noFocusMissingState');
        },

        takenEvent: function(sender) {
            this.gotoState('noFocusTakenState');
        },

        serverErrorEvent: function(sender) {
            this.gotoState('noFocusServerErrorState');
        },

        invalidEvent: function(sender) {
            this.gotoState('noFocusInvalidState');
        },

        okEvent: function(sender) {
            this.gotoState('noFocusOkState');
        },

		focusInEvent: function(sender){
			this.gotoState('transientFocusTestValid');
		}
    })
});
