//framework dependencies
require("ember");
require("ember-statechart");
//create the namespace
KG = Ember.Application.create({lang:'fr',  serverHost: '/'});
require('kloudgis/view/lib/views/forward_text_field');
require('kloudgis/view/lib/views/loading_image');
require('kloudgis/view/lib/views/button')
require("./strings");
require("./core_statechart");
require("./core_signup");
require("./views/signup_field");



