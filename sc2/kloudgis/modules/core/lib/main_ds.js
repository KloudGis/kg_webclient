require("sproutcore-datastore"); 
require("Kloudgis/~modules/core/lib/data_sources/store");
require("Kloudgis/~modules/core/lib/models/record");
require("Kloudgis/~modules/core/lib/models/note");

KG.store = SC.Store.create({ 
  commitRecordsAutomatically: NO
}).from('KG.Store');