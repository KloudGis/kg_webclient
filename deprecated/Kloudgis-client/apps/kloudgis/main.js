// ==========================================================================
// Project:   KG
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals KG */

// This is the function that will start your app running.  The default
// implementation will load any fixtures you have created then instantiate
// your controllers and awake the elements on your page.
//
// As you develop your application you will probably want to override this.
// See comments for some pointers on what to do next.
//
KG.main = function main() {
	//start the main statechart
	KG.statechart.initStatechart();
	SC.routes.add(':pageName', KG.routes, 'gotoRoute');
    SC.routes.add(':', KG.routes, 'gotoRoute');
} ;

function main() { KG.main(); }
