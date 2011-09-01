// ==========================================================================
// Project:   Dbclient.Poi
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Dbclient */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
sc_require('models/place')
CoreKG.Poi = CoreKG.Place.extend(
/** @scope CoreKG.Poi.prototype */ {

    featuretype: 'poi',
	tags: SC.Record.toMany('CoreKG.PoiTag',{
			inverse: "poi",
			isMaster: NO

		})
	

}) ;
