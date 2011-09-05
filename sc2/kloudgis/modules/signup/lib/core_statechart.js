SC.mixin(KG, {
    //global state chart
    statechart: SC.Statechart.create({
        //log trace
        trace: NO,

        rootState: SC.State.extend({

            initialSubstate: 'startupState',       

            startupState: SC.State.extend({

                enterState: function() {
                    console.log('enter signup');
                },
            }),

			userFieldFocusState: SC.State.extend({
				
                enterState: function() {
                    console.log('enter user field');
                },

				focusOutEvent: function(){
					this.validate();
				},
				
				newLineEvent: function(){
					console.log('newline');
					this.validate();
				},
				
				validate:function(){
					KG.core_signup.validateUser();
				}
				
            }),

			otherFieldFocusState: SC.State.extend({

                enterState: function() {
                    console.log('enter other field');
                },

				focusOutEvent: function(){
					KG.core_signup.validateAllExceptUser();
				},
				
				newLineEvent: function(){
					KG.core_signup.validateAllExceptUser();
				},
            }),

			createAccountAction: function(){
				KG.core_signup.createAccount();
			},
			
			focusInEvent: function(source, domEvent) {
                var id = source.get('elementId');
				console.log('focus in '  + id);
				
                if (id === 'user-field') {
                    this.gotoState('userFieldFocusState');
                } else {
                    this.gotoState('otherFieldFocusState');
                } 
            }

        })
    })
});
