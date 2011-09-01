// ==========================================================================
// Project:   Signup.InputView
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Signup */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
Signup.InputView = SC.View.extend(SC.StatechartManager,
/** @scope Signup.InputView.prototype */
{
	initialState: 'startState',
	
	classNames: 'input-view'.w(),
	
    childViews: 'labelView textView helpView'.w(),

    textfield: SC.outlet('textView.fieldView'),

	render: function(context, firstTime) {
        this.invokeStateMethod('renderView', context, firstTime);
        sc_super();
    },

    labelView: SC.LabelView.design({
        classNames: 'input-label'.w(),
        layout: {
            width: 145,
            height: 20,
            centerY: -3
        },
        fontWeight: null,
        textAlign: null,
        value: ''
    }),

    textView: SC.View.design({
        classNames: 'input-text'.w(),
        layout: {
            left: 155,
            height: 40,
            width: 240,
        },

        childViews: 'fieldView'.w(),
        fieldView: SC.TextFieldView.design({
            classNames: 'input-field'.w(),
            layout: {
                left: 10,
                right: 16,
                height: 24,
                centerY: 0
            },
			
			spellCheckEnabled: NO,
			
            isFocusDidChange: function() {
				if (this.get('focused')) {
		            this.parentView.parentView.sendEvent('focusInEvent', this);
		        } else {
		            this.parentView.parentView.sendEvent('focusOutEvent', this);
		        }
            }.observes('focused'),

			keyUp: function(evt){				
				var ret = sc_super();
				this.parentView.parentView.sendEvent('keyUpEvent', this, evt.keyCode);
				return ret;
			}
        })
    }),

    helpView: SC.View.design({
        classNames: 'input-help'.w(),
        layout: {
            left: 397,
            height: 40,
            width: 280,
        },

        childViews: 'labelHelp'.w(),

        labelHelp: SC.LabelView.design({
            classNames: 'label-help'.w(),
            layout: {
                left: 10,
                height: 16,
                centerY: 0,
            },
            value: ''
        })
    })

});
