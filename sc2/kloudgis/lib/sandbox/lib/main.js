require("kloudgis/app/lib/main");
require("kloudgis/app/lib/views/button");
require("kloudgis/app/lib/views/text_field");
require("kloudgis/app/lib/views/text_area");
require("kloudgis/auth/lib/main");
require("kloudgis/core/lib/main_ds");
require("kloudgis/core/lib/models/record");
require("kloudgis/core/lib/models/feature");
require("kloudgis/core/lib/lon_lat");
require("kloudgis/core/lib/bounds");
require("./strings");
require("./core_statechart");
require("./core_sandbox");
require("./core_leaflet");

//info
require("./controllers/info");
require("./core_info");


//notes
require("./controllers/note_markers");
require("./controllers/notes_popup");
require("./controllers/active_note");
require("./core_note");
require("./models/note_marker");
require("./views/note_popup_item");
//layers
require("./controllers/layers");
require("./models/layer");
require("./core_layer");