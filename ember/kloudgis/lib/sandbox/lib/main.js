require("kloudgis/view/lib/views/button");
require("kloudgis/view/lib/views/text_field");
require("kloudgis/view/lib/views/numeric_text_field");
require("kloudgis/view/lib/views/text_area");
require("kloudgis/view/lib/views/loading_image");
require("kloudgis/auth/lib/main");
require("kloudgis/core/lib/main_ds");
require("kloudgis/core/lib/models/feature");
require("kloudgis/core/lib/models/bounds");
require("kloudgis/core/lib/core_date");
require("./strings");
require("./core_sandbox");
require("./controllers/comments");

//active user
require('./controllers/active_user');
require('./views/user_button');
//templates
require("./templates");

//map
require("kloudgis/map/lib/core_leaflet");
require("kloudgis/map/lib/core_highlight");

//search
require("kloudgis/core/lib/models/search_category");
require("./core_search");
require("./controllers/search");
require("./controllers/search_results");
require("./views/search_field");
require("./views/records_button");
//search plugins
require("./views/plugin_records_button");
require("./search_plugins/core_google");
require("./search_plugins/core_geonames");
require("./search_plugins/core_osm");
require("./search_plugins/core_yahoo");

//inspector
require("./core_inspector");
require("./controllers/inspector");
require("./views/inspector_attribute");
require("kloudgis/view/lib/views/switch");
require("kloudgis/view/lib/views/select");
require("kloudgis/view/lib/views/select_input");
require("./views/delete_feature_comment");
require("./controllers/feature_comments");
require("./controllers/feature_new_comment");
require("./controllers/feature_delete_comment");

//palette
require("./core_palette");
require("./controllers/palette");

//info
require("./controllers/info");
require("./core_info");
require("./views/feature_info_popup_item");
require("./views/expand_button");

//notes
require("./controllers/note_markers");
require("./controllers/notes_popup");
require("./controllers/active_note");
require("./controllers/note_comments");
require("./controllers/note_new_comment");
require("./controllers/note_delete_comment");
require("./core_note");
require("./views/note_popup_item");
require("./views/comment_area");
require("./views/author");
require("./views/delete_note_comment");


//layers
require("./controllers/layers");
require("./core_layer");

//notification
require("./models/message");
require("./core_notification");
require("./controllers/notifications");
require("./controllers/send_notification");
require("./views/notification");
require("./views/text_notification_area");

//bookmark
require("./core_bookmark");
require("./controllers/bookmarks");
require("./controllers/add_bookmark");
require("./views/bookmark_button");
require("./views/edit_bookmark_button");
require("./views/bookmark_item");
require("./views/bookmark_delete_button");
