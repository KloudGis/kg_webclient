// ==========================================================================
// Project:   Signup.User
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Signup */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
Signup.User = SC.Record.extend(
/** @scope Signup.User.prototype */ {

  	user: SC.Record.attr(String),
  	name: SC.Record.attr(String),
  	compagny: SC.Record.attr(String),
  	location: SC.Record.attr(String),
  	pwd: SC.Record.attr(String)

}) ;
