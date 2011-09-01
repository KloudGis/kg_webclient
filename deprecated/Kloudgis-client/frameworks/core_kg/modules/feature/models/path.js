// ==========================================================================
// Project:   Dbclient.Path
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Dbclient */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
sc_require('models/place')
CoreKG.Path = CoreKG.Place.extend(
/** @scope CoreKG.Path.prototype */ {

  featuretype: 'path'

}) ;
