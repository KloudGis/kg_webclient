/* ===========================================================================
   BPM Combined Asset File
   MANIFEST: kloudgis ()
   This file is generated automatically by the bpm (http://www.bpmjs.org)
   =========================================================================*/

spade.register("kloudgis/home/lib/controllers/add_sandbox", function(require, exports, __module, ARGV, ENV, __filename){
KG.addSandboxController = Ember.Object.create({
	name: '',
	
	cancelCreateTooltip: '_cancelTooltip'.loc(),
	
	commitCreateTooltip: '_commitTooltip'.loc(),
});

});spade.register("kloudgis/home/lib/controllers/delete", function(require, exports, __module, ARGV, ENV, __filename){
KG.deleteController = Ember.ArrayController.create({
	
	content: []
});

});spade.register("kloudgis/home/lib/controllers/home_panel", function(require, exports, __module, ARGV, ENV, __filename){
KG.homePanelController = Ember.Object.create({

    listSandboxHidden: NO,
    listSandboxPushed: NO,

    addSandboxHidden: YES,
    addSandboxPushed: YES,

    deleteMode: NO,

    addTitle: '_createSandboxTitle'.loc(),

    errorMessage: '',

    listTitle: function() {
        return KG.sandboxesController.get('title');
    }.property('KG.sandboxesController.title'),

    setListSandboxActive: function() {
        clearTimeout(this._timeout);
        var self = this;
        this.set('listSandboxHidden', NO);
        this.set('listSandboxPushed', NO);
        this.set('addSandboxPushed', YES);
        this._timeout = setTimeout(function() {
            self.set('addSandboxHidden', YES);
        },
        700);
    },

    setAddSandboxActive: function() {
        clearTimeout(this._timeout);
        var self = this;
        this.set('addSandboxHidden', NO);
        this.set('addSandboxPushed', NO);
        this.set('listSandboxPushed', YES);
        this._timeout = setTimeout(function() {
            self.set('listSandboxHidden', YES);
			KG.core_home.map.setCenter(KG.LonLat.create({lon: -72, lat:46}), 6);
            KG.core_home.map.mapSizeDidChange();			
        },
        700);
    }

});

});spade.register("kloudgis/home/lib/controllers/sandboxes", function(require, exports, __module, ARGV, ENV, __filename){
/**
* List of sandbox
**/

KG.sandboxesController = Ember.ArrayController.create({
	content: null,
	recordsReady:  NO,
	title: '',
		
	recordsReadyChange: function(){
		var val;
		if (this.get('recordsReady')) {
	        var count = this.get('length');
	        if (count > 0) {
				if(count === 1){
					val = "_sandboxesListOne".loc();
				}else{
	            	val = "_sandboxesList".loc(count);
				}
	        } else {
	            val = "_sandboxesNothing".loc();
	        }
	    }else{
			val =  '';
		}
		this.set('title', val);
	}.observes('recordsReady', 'content.length')
	
});

});spade.register("kloudgis/home/lib/core_home", function(require, exports, __module, ARGV, ENV, __filename){
/**
* Core functions for the home page
**/

KG.core_home = SC.Object.create({

    createSandboxTitle: "_createSandboxTitle".loc(),

    //map for Home usage
    map: KG.MapLeaflet.create({ baseLayer: 'OSM'}),

    connectedUserLabel: function() {
        var user = KG.core_auth.get('activeUser');
        if (user) {
            return "_welcomeUser".loc(user.name);
        } else {
            return '';
        }
    }.property('KG.core_auth.activeUser'),

    loadSandboxList: function() {
		if(KG.sandboxesController.get('content')){
			KG.sandboxesController.get('content').destroy();
		}
		KG.store.unloadRecords(KG.Sandbox);
		KG.sandboxesController.set('recordsReady', NO);
        var records;
        records = KG.store.find(KG.SANDBOX_QUERY);
        KG.sandboxesController.set('content', records);
        records.onReady(this, this._onListReady);
        records.onError(this, this._onListError);
    },

    _onListReady: function(records) {
        KG.sandboxesController.set('recordsReady', YES);
        records.offError();
    },

    _onListError: function(records) {
        KG.homePanelController.set(errorMessage, '_errorLoading'.loc());
    }
});

});spade.register("kloudgis/home/lib/main", function(require, exports, __module, ARGV, ENV, __filename){
require("kloudgis/auth/lib/main");
require("kloudgis/core/lib/main_ds");
require("kloudgis/core/lib/core_date");
require("kloudgis/view/lib/views/button");
require("kloudgis/view/lib/views/text_field");
require("kloudgis/map/lib/main");
require("./strings");
require("./templates");
require("./controllers/sandboxes");
require("./controllers/home_panel");
require("./controllers/add_sandbox");
require("./controllers/delete");
require("./views/title");
require("./views/sandbox");
require("./views/sandbox_list");
require("./views/add_sandbox");
require("./views/delete_checkbox");
require("./core_home");

});spade.register("kloudgis/home/lib/strings", function(require, exports, __module, ARGV, ENV, __filename){
/**
* Localize the page
**/

var fr = { 
	"_logout": "Déconnection",
	"_sandboxesListOne": "Votre projet:",
	"_sandboxesList": "Vos %@ projets:",
	"_sandboxesNothing": "Vous n'avez pas de projet.",
	"_errorLoading": "Erreur lors du chargement des projets.",
	"_welcomeUser": "Bienvenue %@",
	"_wrong-membership": "Vous n'être pas membre de ce projet.",
	"_sbDateFormat": "%@/%@/%@",
	"_by" : "Par",
	"_createSandboxTitle": "Créer un nouveau projet",
	"_add" : "Ajouter",
	"_cancelTooltip": "Annuler",
	"_commitTooltip": "Sauvegarder",
	"_sandboxName": "Le nom du projet",
	"_nameAlreadyTaken" : "Vous avez déjà un projet de ce nom.",
	"_position" : "Emplacement de départ",
	"_requestError": "Erreur, le nom du projet semble invalide.",
	"_serverError": "Erreur du serveur, veuillez réessayer plus tard.",
	"_delete": "Supprimer",
	"_sandboxDescription": "Par %@ à %@",
	"_leave": "Quitter",
	"_cancel": "Annuler"
};

var en = {
	"_logout": "Logout",
	"_sandboxesListOne": "Your projet:",
	"_sandboxesList": "Your %@ projets:",
	"_sandboxesNothing": "You don't have any project.",
	"_errorLoading": "Cannot load the projects.",
	"_welcomeUser": "Welcome %@",
	"_wrong-membership": "You are not a member of this project.",
	"_sbDateFormat": "%@/%@/%@",
	"_by" : "By",
	"_createSandboxTitle": "Create a new sandbox",
	"_add" : "Add",
	"_cancelTooltip": "Cancel",
	"_commitTooltip": "Save",
	"_sandboxName": "The Sandbox Name",
	"_nameAlreadyTaken" : "You already have a sandbox with that name",
	"_position" : "Start Position",
	"_requestError": "Error, the sandbox's name might be invalid.",
	"_serverError": "Server error, please try again later.",
	"_delete": "Delete",
	"_sandboxDescription": "By %@ at %@",
	"_leave": "Leave",
	"_cancel": "Cancel"
};

if(KG.lang === 'fr'){
	jQuery.extend(Ember.STRINGS, fr);
}else{
	jQuery.extend(Ember.STRINGS, en);
}

});spade.register("kloudgis/home/lib/templates", function(require, exports, __module, ARGV, ENV, __filename){
Ember.TEMPLATES['sandbox-list'] = spade.require('kloudgis/home/templates/sandbox_list');
Ember.TEMPLATES['add-sandbox'] = spade.require('kloudgis/home/templates/add_sandbox');

});spade.register("kloudgis/home/lib/views/add_sandbox", function(require, exports, __module, ARGV, ENV, __filename){
KG.AddSandboxView = Ember.View.extend({
	classNameBindings: ['hidden', 'pushed'],
	hiddenBinding: 'KG.homePanelController.addSandboxHidden',
	pushedBinding: 'KG.homePanelController.addSandboxPushed',
})

});spade.register("kloudgis/home/lib/views/delete_checkbox", function(require, exports, __module, ARGV, ENV, __filename){
KG.DeleteCheckboxView = KG.Button.extend({
	
	isChecked: NO,
	
	isOwner: function(){
		var content = this.getPath('itemView.content');
		if(content && content.get('owner') === KG.core_auth.get('activeUser').id){
			return YES;
		}
		return NO;
	}.property('itemView.content'),
	
	deleteListDidChange: function(){
		var content = this.getPath('itemView.content');
		if(KG.deleteController.indexOf(content) > -1){
			this.set('isChecked', YES);
		}else{
			this.set('isChecked', NO);
		}		
	}.observes('itemView.content', 'KG.deleteController.length')
});

});spade.register("kloudgis/home/lib/views/sandbox", function(require, exports, __module, ARGV, ENV, __filename){
//super view to show the sandbox properties
KG.SandboxView = KG.Button.extend({

    triggerAction: function() {
		console.log('open!!');
        KG.statechart.sendAction('openSandboxAction', this.getPath('itemView.content.guid'));
    }
});

});spade.register("kloudgis/home/lib/views/sandbox_list", function(require, exports, __module, ARGV, ENV, __filename){
KG.SandboxListView = Ember.View.extend({
	classNameBindings: ['hidden', 'pushed'],
	hiddenBinding: 'KG.homePanelController.listSandboxHidden',
	pushedBinding: 'KG.homePanelController.listSandboxPushed'
})

});spade.register("kloudgis/home/lib/views/title", function(require, exports, __module, ARGV, ENV, __filename){
/**
* View to render the sandbox list title.
**/

KG.TitleView = SC.View.extend({

    titleStringBinding: 'KG.homePanelController.listTitle'

});

});spade.register("kloudgis/home/templates/add_sandbox", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("{{#view id=\"add-sandbox-title\" class=\"page-title\"}}\n\t{{KG.homePanelController.addTitle}}\n{{/view}}\n{{#view id=\"inner-add-sandbox-panel\"}}\n\t<div>\n\t\t{{view KG.TextField placeholder_not_loc=\"_sandboxName\" valueBinding=\"KG.addSandboxController.name\"}}\t\n\t</div>\n\t{{loc _position class=\"field-label\"}}\n\t<div id=\"add-sandbox-map\"></div>\n\t{{#view KG.Button class=\"white-button\" sc_action=\"cancelCreateAction\" titleBinding=\"KG.addSandboxController.cancelCreateTooltip\"}}\n\t\t<img src=\"resources/images/cancel_30.png\">\n\t{{/view}}\n\t{{#view KG.Button class=\"white-button\" sc_action=\"commitCreateAction\" titleBinding=\"KG.addSandboxController.commitCreateTooltip\"}}\n\t\t<img src=\"resources/images/checkmark_30.png\">\n\t{{/view}}\n{{/view}}\n");
});spade.register("kloudgis/home/templates/sandbox_list", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("{{#view KG.TitleView id=\"sandboxes-title\" class=\"page-title\"}}\n\t{{titleString}}\n{{/view}}\n{{#view}}\n{{#collection contentBinding=\"KG.sandboxesController\" class=\"sandbox-list\"}}\n\t\t{{#view KG.SandboxView tagName=\"div\" class=\"sandbox-list-item common-list-button\"}}\n\t\t\t{{#view KG.DeleteCheckboxView  class=\"delete-button\" sc_action=\"checkSandboxAction\" classBinding=\"KG.homePanelController.deleteMode isChecked isOwner\"}}\n\t\t\t\t<span>✓</span> {{loc _leave tagName=\"span\"}}\n\t\t\t{{/view}}\n\t\t\t{{#view tagName=\"span\" class=\"sandbox-name\"}}\n\t\t\t\t{{itemView.content.name}}\n\t\t\t{{/view}}\n\t\t\t<div class=\"info-line\">\n\t\t\t\t{{itemView.content.formattedDescription}}\n\t\t\t</div>\n\t\t{{/view}}\n{{/collection}}\n\t\n{{#view KG.Button  id=\"create-sandbox-button\" class=\"white-button\" sc_action=\"createSandboxAction\" titleBinding=\"KG.core_home.createSandboxTitle\" isVisibleBinding=\"KG.sandboxesController.recordsReady\"}}\n\t<img src=\"resources/images/add_30.png\">\n{{/view}}\n{{#view KG.Button  id=\"delete-mode-button\" class=\"white-button\" sc_action=\"toggleDeleteSandboxModeAction\" titleBinding=\"KG.core_home.deleteSandboxTitle\" isVisibleBinding=\"KG.sandboxesController.recordsReady\" classBinding=\"KG.homePanelController.deleteMode\"}}\n\t<div></div>\n\t{{loc _cancel tagName=\"span\"}}\n{{/view}}\t\n{{#view KG.Button id=\"delete-sandbox-button\" class=\"red-button\" sc_action=\"deleteSandboxAction\" classBinding=\"KG.homePanelController.deleteMode\"}}\n\t{{loc _delete}}\n{{/view}}\n{{/view}}\t\t\n");
});