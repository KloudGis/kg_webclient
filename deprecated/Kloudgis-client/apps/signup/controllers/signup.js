// ==========================================================================
// Project:   Signup.signupController
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Signup */

/** @class

  Contains the user being created

  @extends SC.Object
*/
Signup.signupController = SC.ObjectController.create(
/** @scope Signup.signupController.prototype */ {
	
		isCheckEmail: NO,
    	isCreateAccount: NO,
		hasError: NO,
		didClickCreate: NO,
		
		testingCounter: 0,

		successMessage: function(){
			return 'Le compte %@ à été créer avec succès pour %@.'.fmt(this.get('user'), this.get('name'));
		}.property('email', 'name'),
		
		testCounterDidChange: function() {
	        if (this.get('testingCounter') === 0 && this.get('isCreateAccount')) {
				Signup.createAccount();
			}
	    }.observes('testingCounter'),

}) ;
