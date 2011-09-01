// ==========================================================================
// Project:   Auth
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Auth */

// This is the function that will start your app running.  The default
// implementation will load any fixtures you have created then instantiate
// your controllers and awake the elements on your page.
//
// As you develop your application you will probably want to override this.
// See comments for some pointers on what to do next.
//
Auth.main = function main() {

  // Step 1: Instantiate Your Views
  // The default code here will make the mainPane for your application visible
  // on screen.  If you app gets any level of complexity, you will probably 
  // create multiple pages and panes.  
  Auth.getPath('mainPage.mainPane').append() ;

  // Step 2. Set the content property on your primary controller.
  // This will make your app come alive!

  // TODO: Set the content property on your primary controller
  // ex: Auth.contactsController.set('content',Auth.contacts);
	//Auth.testAuth();
	var rec = Auth.store.find(Auth.QUERY);
	Auth.testController.set('content', rec);
} ;

function main() { Auth.main(); }
