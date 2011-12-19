require("kloudgis/app/lib/main");
require("kloudgis/app/lib/views/button");
require("kloudgis/app/lib/views/text_field");
require("kloudgis/app/lib/views/numeric_text_field");
require("kloudgis/app/lib/views/text_area");
require("kloudgis/app/lib/views/loading_image");
require("kloudgis/auth/lib/main");
require("kloudgis/core/lib/main_ds");
require("kloudgis/core/lib/models/feature");
require("kloudgis/core/lib/models/bounds");
require("kloudgis/core/lib/core_date");
require("./strings");
require("./core_statechart");
require("./core_sandbox");
require("./core_leaflet");

require("./core_highlight");

//search
require("kloudgis/core/lib/models/search_category");
require("./core_search");
require("./controllers/search");
require("./controllers/search_results");
require("./views/search_field");
require("./views/search_result_label");
//search plugins
require("./search_plugins/core_google");
require("./search_plugins/core_geonames");
require("./search_plugins/core_osm");
require("./search_plugins/core_yahoo");

//inspector
require("./core_inspector");
require("./controllers/inspector");
require("./views/inspector_attribute");

//info
require("./controllers/info");
require("./core_info");
require("./views/feature_info_popup_item");
require("./views/expand_button");

//notes
require("./controllers/note_markers");
require("./controllers/notes_popup");
require("./controllers/active_note");
require("./controllers/active_comments");
require("./controllers/new_comment");
require("./controllers/delete_comment");
require("./core_note");
require("./views/note_popup_item");
require("./views/comment_area");
require("./views/author");
require("./views/delete_comment");

//layers
require("./controllers/layers");
require("./core_layer");

//notification
require("./models/message");
require("./core_notification");
require("./controllers/notifications");
require("./controllers/send_notification");
require("./views/notification");
require("./views/notification_button");
require("./views/text_notification_area");

//bookmark
require("./core_bookmark");
require("./controllers/bookmarks");
require("./controllers/add_bookmark");
require("kloudgis/app/lib/views/bubble_touch");
require("./views/bookmark_button");
require("./views/edit_bookmark_button");
require("./views/bookmark_item");
require("./views/bookmark_delete_button");
