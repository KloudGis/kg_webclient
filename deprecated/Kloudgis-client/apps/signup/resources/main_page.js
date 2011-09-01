// ==========================================================================
// Project:   Signup - mainPage
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Signup */

// This page describes the main user interface for your application.  
sc_require('views/email')
sc_require('views/name')
sc_require('views/compagny')
sc_require('views/location')
sc_require('views/password')
sc_require('views/confirm_password')
Signup.mainPage = SC.Page.design({

    //shortcuts
    emailView: SC.outlet('mainPane.scrollView.contentView.contentView.bodyView.emailView'),
    nameView: SC.outlet('mainPane.scrollView.contentView.contentView.bodyView.nameView'),
    cieView: SC.outlet('mainPane.scrollView.contentView.contentView.bodyView.cieView'),
    locView: SC.outlet('mainPane.scrollView.contentView.contentView.bodyView.locView'),
    pwdView: SC.outlet('mainPane.scrollView.contentView.contentView.bodyView.passwordView'),
    confirmView: SC.outlet('mainPane.scrollView.contentView.contentView.bodyView.confirmPasswordView'),

    mainPane: SC.MainPane.design({
	
		defaultResponder: Signup.statechart,
        childViews: 'scrollView'.w(),

        scrollView: SC.ScrollView.design({
            layerId: 'main-scroll',
            contentView: SC.ContainerView.design({
				 layout: {
                        top: 0,
                        width: 770,
                        height: 680,
                        centerX: 0,
                    },
                contentView: SC.View.design({
                    layout: {
                        top: 40,
						left:10,
						right:10,
						bottom:10					
                    },
                    layerId: 'signupView',
                    childViews: 'headerView bodyView'.w(),

                    headerView: SC.View.design({
                        layout: {
                            top: 30,
                            left: 20,
                            right: 20,
                            height: 100,
                        },

                        childViews: 'labelLogo labelSignup'.w(),

                        //better be an image
                        labelLogo: SC.LabelView.design({
                            classNames: 'logo-label'.w(),
                            layout: {
                                height: 30
                            },
                            value: 'Kloudgis',
                            fontWeight: null,
                        }),

                        labelSignup: SC.LabelView.design({
                            classNames: 'signup-label'.w(),
                            layout: {
                                top: 33,
                                height: 24
                            },
                            value: 'Créer votre compte gratuit.',
                            fontWeight: null
                        })

                    }),
                    bodyView: SC.View.design({
						layerId: 'bodyViewId',
                        layout: {
                            top: 100,
                            left: 40,
                            right: 20,
                            bottom: 30
                        },
                        childViews: 'emailView nameView cieView locView passwordView confirmPasswordView createButton createAnim'.w(),

                        emailView: Signup.EmailView.design({
                            layout: {
                                top: 30,
                                height: 50,
                                left: 0,
                                right: 0
                            }
                        }),
                        nameView: Signup.NameView.design({
                            layout: {
                                top: 100,
                                height: 50,
                                left: 0,
                                right: 0
                            }
                        }),

                        cieView: Signup.CompagnyView.design({
                            layout: {
                                top: 170,
                                height: 50,
                                left: 0,
                                right: 0
                            }
                        }),

                        locView: Signup.LocationView.design({
                            layout: {
                                top: 240,
                                height: 50,
                                left: 0,
                                right: 0
                            }
                        }),

                        passwordView: Signup.PasswordView.design({
                            layout: {
                                top: 310,
                                height: 50,
                                left: 0,
                                right: 0
                            }
                        }),

                        confirmPasswordView: Signup.ConfirmPasswordView.design({
                            layout: {
                                top: 380,
                                height: 50,
                                left: 0,
                                right: 0
                            },

                            //test the confirm password if the password change
                            passwordDidChange: function(user, property) {
                                this.sendEvent('passwordChangedEvent');
                            }.observes('Signup.signupController.pwd')
                        }),

                        createButton: SC.ButtonView.design({
                            layerId: 'create-button',
                            layout: {
                                top: 450,
                                centerX: 0,
                                height: 18,
                                width: 140
                            },
                            acceptsFirstResponder: NO,
                            action: 'createAccount',
							isDefault: YES,

                            //custom simple button with no image.
                            render: function(context, firstTime) {
                                if (firstTime) {
                                    context.push('<a><span>Créer un compte</span></a>');
                                }
                            }
                        }),

                        createAnim: SC.ImageView.design({

                            layout: {
                                top: 470,
                                centerX: 82,
                                height: 16,
                                width: 16
                            },
                            value: sc_static('images/loading.gif'),
                            useCanvas: NO,
                            isVisibleBinding: 'Signup.signupController.isCreateAccount'
                        })
                    })
                })
            })
        })
    })
});
