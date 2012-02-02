var deps = {

    Addons: {
		src: ['addons/handlebars/helpers.js',
              'addons/jquery/helpers.js'
		    ],
		desc: 'Low level addons.'
	},

	App: {
		src: ['app_demo/main.js',
              'app_demo/states/home.js',
              'app_demo/states/sandbox.js',
              'app_demo/statechart.js',
              'app_demo/core_init.js',
              'app_demo/controllers/page.js',
              'compiled_templates/login_page.js',
              'compiled_templates/home_page.js',
              'compiled_templates/sandbox_page.js'
		    ],
		desc: 'Kloudgis Application.'
	},
    
    UI: {
		src: ['ui/views/button.js',
              'ui/views/loading_image.js',
              'ui/views/numeric_text_field.js',
              'ui/views/select_input.js',
              'ui/views/select.js',
              'ui/views/switch.js',
              'ui/views/text_area.js',
              'ui/views/text_field.js',
              'compiled_templates/switch.js',
              'compiled_templates/select.js',
              'compiled_templates/select_input.js'
		    ],
		desc: 'Low level addons.'
	},
    
    Auth: {
		src: ['auth/core_auth.js'
		    ],
		desc: 'authentication Module.'
	},
    
    Login: {
		src: ['login/strings.js',
              'login/core_login.js'
		    ],
		desc: 'Login Module.'
	},
    
    Core: {
		src: ['core/core_date.js',
              'core/data_sources/store.js',
              'core/models/record.js',
              'core/models/attribute.js',
              'core/models/attrtype.js',
              'core/models/bookmark.js',
              'core/models/bounds.js',
              'core/models/comment.js',
              'core/models/feature_comment.js',
              'core/models/feature.js',
              'core/models/featuretype.js',
              'core/models/layer.js',
              'core/models/lon_lat.js',
              'core/models/note_comment.js',
              'core/models/note_marker.js',
              'core/models/note.js',
              'core/models/sandbox.js',
              'core/models/search_category.js',
              'core/main_ds.js'
		    ],
		desc: 'Core Module.'
	},
    
    Map: {
		src: ['map/map_leaflet.js',
              'map/core_leaflet.js',
              'map/core_highlight.js'
		    ],
		desc: 'Map Module.'
	},
    
    Home: {
		src: ['home/strings.js',
              'home/core_home.js',
              'home/controllers/sandboxes.js',
              'home/controllers/add_sandbox.js',
              'home/controllers/delete.js',
              'home/controllers/home_panel.js',
              'home/views/add_sandbox.js',
              'home/views/delete_checkbox.js',
              'home/views/sandbox_list.js',
              'home/views/sandbox.js',
              'home/views/title.js',
              'compiled_templates/sandbox_list.js',
              'compiled_templates/add_sandbox.js',
		    ],
		desc: 'Home Module.'
	},
    
    CoreSandbox: {
		src: ['sandbox/strings.js',
              'sandbox/core_sandbox.js',
              'sandbox/controllers/active_user.js',
              'sandbox/views/user_button.js',
              'compiled_templates/page_header.js',
              'compiled_templates/active_user_panel.js'
		    ],
		desc: 'Core Sandbox Module.'
	},

    
    Search: {
		src: ['sandbox/core_search.js',
              'sandbox/controllers/search.js',
              'sandbox/controllers/search_results.js',
              'sandbox/views/search_field.js',
              'sandbox/views/records_button.js',
              'sandbox/views/plugin_records_button.js',
              'sandbox/search_plugins/core_google.js',
              'sandbox/search_plugins/core_geonames.js',
              'sandbox/search_plugins/core_osm.js',
              'sandbox/search_plugins/core_yahoo.js',
              'compiled_templates/search_panel.js',
		    ],
		desc: 'Search Module.'
	},
    
    Inspector: {
		src: ['sandbox/core_inspector.js',
              'sandbox/controllers/inspector.js',
              'sandbox/controllers/comments.js',
              'sandbox/controllers/feature_comments.js',
              'sandbox/controllers/feature_new_comment.js',
              'sandbox/controllers/feature_delete_comment.js',
              'sandbox/views/inspector_attribute.js',
              'sandbox/views/delete_feature_comment.js',
              'sandbox/views/plugin_records_button.js',
              'compiled_templates/inspector.js',
              'compiled_templates/feature_comments.js',
              'compiled_templates/bool_renderer.js',
              'compiled_templates/catalog_renderer.js',
              'compiled_templates/catalog_text_renderer.js',
              'compiled_templates/img_renderer.js',
              'compiled_templates/label_renderer.js',
              'compiled_templates/num_range_renderer.js',
              'compiled_templates/num_renderer.js',
              'compiled_templates/text_renderer.js'
		    ],
		desc: 'Inspector Module.'
	},
    
    Palette: {
		src: ['sandbox/core_palette.js',
              'sandbox/controllers/palette.js',
              'compiled_templates/palette.js'
		    ],
		desc: 'Palette Module.'
	},
    
    FeatureInfo: {
		src: ['sandbox/controllers/info.js',
              'sandbox/core_info.js',              
              'sandbox/views/feature_info_popup_item.js',
              'sandbox/views/expand_button.js',
              'compiled_templates/info_item.js',
              'compiled_templates/info_popup.js'
		    ],
		desc: 'Feature Info Module.'
	},
    
    Note: {
		src: ['sandbox/core_note.js',
              'sandbox/controllers/note_markers.js',
              'sandbox/controllers/notes_popup.js',
              'sandbox/controllers/active_note.js',
              'sandbox/controllers/note_comments.js',
              'sandbox/controllers/note_new_comment.js',
              'sandbox/controllers/note_delete_comment.js',
              'sandbox/views/note_popup_item.js',
              'sandbox/views/comment_area.js',
              'sandbox/views/author.js',
              'sandbox/views/delete_note_comment.js',
              'compiled_templates/active_note_popup.js',
              'compiled_templates/note_comments.js',
              'compiled_templates/multiple_notes_popup.js'
		    ],
		desc: 'Note Module.'
	},
    
    Layer: {
		src: ['sandbox/core_layer.js',
              'sandbox/controllers/layers.js'
		    ],
		desc: 'Layer Module.'
	},

    Notification: {
		src: ['sandbox/core_notification.js',
              'sandbox/models/message.js',
              'sandbox/controllers/notifications.js',
              'sandbox/controllers/send_notification.js',
              'sandbox/views/notification.js',
              'sandbox/views/text_notification_area.js',
              'compiled_templates/notification_panel.js'
		    ],
		desc: 'Notifications Module.'
	},
    
    Bookmark: {
		src: ['sandbox/core_bookmark.js',
              'sandbox/controllers/bookmarks.js',
              'sandbox/controllers/add_bookmark.js',
              'sandbox/views/bookmark_button.js',
              'sandbox/views/edit_bookmark_button.js',
              'sandbox/views/bookmark_item.js',
              'sandbox/views/bookmark_delete_button.js',
              'compiled_templates/bookmark_panel.js',
              'compiled_templates/add_bookmark.js'
		    ],
		desc: 'Bookmark Module.'
	}
};

if (typeof exports !== 'undefined') {
	exports.deps = deps;
}
