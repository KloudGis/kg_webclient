/* ===========================================================================
   BPM Combined Asset File
   MANIFEST: kloudgis ()
   This file is generated automatically by the bpm (http://www.bpmjs.org)
   =========================================================================*/

spade.register("kloudgis/home/lib/controllers/add_sandbox", function(require, exports, __module, ARGV, ENV, __filename){
KG.addSandboxController = Ember.Object.create({
	name: '',
});

});spade.register("kloudgis/home/lib/controllers/page", function(require, exports, __module, ARGV, ENV, __filename){
KG.pageController = Ember.Object.create({

	listSandboxHidden: NO,
	
	addSandboxHidden: YES,
	
	addTitle: '_createSandboxTitle'.loc(),
	
	errorMessage: '',
	
	listTitle: function(){
		return KG.sandboxesController.get('title');
	}.property( 'KG.sandboxesController.title')
	
	
});

});spade.register("kloudgis/home/lib/controllers/sandboxes", function(require, exports, __module, ARGV, ENV, __filename){
/**
* List of sandbox
**/

KG.sandboxesController = Ember.ArrayController.create({
	content: [],
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
	
	connectedUserLabel: function(){
		var user = KG.core_auth.get('activeUser');
		if(user){
			return "_welcomeUser".loc(user.name);
		}
	}.property('KG.core_auth.activeUser'),
	
	authenticate: function(){		
		KG.core_auth.load(this, this.authenticateCallback);
	},
	
	authenticateCallback: function(message){
		if(message === "_success"){
			KG.statechart.sendAction('authenticationSucceeded', this);
		}else{
			KG.statechart.sendAction('authenficationFailed', this);
		}
	},
	
	logout: function(){
		KG.core_auth.logout();
		window.location.href="index.html";
	},
	
	loadSandboxList: function(){
		var records = KG.store.find(KG.SANDBOX_QUERY);
		KG.sandboxesController.set('content', records);
		records.onReady(this, this._onListReady);
		records.onError(this, this._onListError);
	},
	
	_onListReady: function(records){
		$('#if-spinner').fadeOut();					
		KG.sandboxesController.set('recordsReady', YES);
		records.offError();
	},
	
	_onListError: function(records){
		$('#if-spinner').fadeOut();					
		console.log('records error!');
		var label = $('#sandboxes-title');
		label.text('_errorLoading'.loc());
		label.css('color', 'red');
	}
});

$(document).ready(function() {
	var v = KG.SandboxListView.create({elementId:"sandbox-list-panel", templateName: 'sandbox-list'});
	v.appendTo('#super-panel');
	v2 = KG.AddSandboxView.create({elementId:"add-sandbox-panel", templateName: 'add-sandbox'});
	v2.appendTo('#super-panel');
    KG.statechart.initStatechart();
});



});spade.register("kloudgis/home/lib/core_statechart", function(require, exports, __module, ARGV, ENV, __filename){
/**
* Statechart for the home page
**/

SC.mixin(KG, {
    //global state chart
    statechart: SC.Statechart.create({
        //log trace
        trace: NO,

        rootState: SC.State.extend({

            initialSubstate: 'tryAuthenticate',

            tryAuthenticate: SC.State.extend({
                enterState: function() {
                    console.log('try');
                    setTimeout(function() {
                        KG.core_home.authenticate();
                    },
                    1);
                },

                authenticationSucceeded: function() {
                    this.gotoState('loggedInState');
                },

                authenficationFailed: function() {
                    this.gotoState('loggedOutState');
                }
            }),

            loggedOutState: SC.State.extend({

                enterState: function() {
                    console.log('I dont know you!!');
                    console.log(KG.core_auth.get('authenticationToken'));
                    window.location.href = "index.html";
                }
            }),

            loggedInState: SC.State.extend({

                initialSubstate: 'selectSandboxState',

                enterState: function() {
                    console.log('hi!');
                    KG.core_home.loadSandboxList();
                    var mess = $.getQueryString('message');
					if(mess){
                    	KG.pageController.set('errorMessage', mess.loc());
					}			
                },

                selectSandboxState: SC.State.extend({

                    enterState: function() {
                        KG.pageController.set('listSandboxHidden', NO);
                    },

                    exitState: function() {
                        KG.pageController.set('listSandboxHidden', YES);
                    },

                    createSandboxAction: function() {
                        this.gotoState('createSandboxState');
                    },

                    openSandboxAction: function(sbKey) {
                        window.location.href = "sandbox.html?sandbox=" + sbKey
                    }

                }),

                createSandboxState: SC.State.extend({

                    _timeout: null,

                    enterState: function() {
                        console.log('Enter create sandbox state!');
						KG.pageController.set('errorMessage', '');
                        KG.pageController.set('addSandboxHidden', NO);
                    },

                    exitState: function() {
                        console.log('Exit create sandbox state!');
						//to close mobile keyboard
						$('#add-sandbox-panel input').blur(); 
                        KG.pageController.set('addSandboxHidden', YES);
                        KG.addSandboxController.set('name', '');
                    },

                    commitCreateAction: function() {
                        var name = KG.getPath('addSandboxController.name');
                        if (!Ember.none(name)) {
                            var qUnique = SC.Query.local(KG.Sandbox, {
                                conditions: "name='%@'".fmt(name)
                            });
                            var res = KG.store.find(qUnique);
                            if (res.get('length') > 0) {
                                console.log('sb name already in use');
								KG.pageController.set('errorMessage', '_nameAlreadyTaken'.loc());
                            } else {
                                var rec = KG.store.createRecord(KG.Sandbox, {
                                    name: name
                                });
                                KG.store.commitRecords();
                                rec.onReady(null,
                                function() {
                                    KG.statechart.sendAction('sandboxCreateSuccess');
                                });
                                rec.onError(null,
                                function() {
									rec.destroy();
                                    KG.statechart.sendAction('sandboxCreateError');
                                });
                            }
                        } else {
                            console.log('empty sb name');
                        }
                    },

					sandboxCreateSuccess: function(){
						this.gotoState('selectSandboxState');
					},
					
					sandboxCreateError: function(){
						console.log('error while commit');
					},

                    cancelCreateAction: function() {
                        var rec = KG.addSandboxController.get('content');
                        if (rec) {
                            rec.destroy();
                        }
                        this.gotoState('selectSandboxState');
                    }
                })

            })
        })
    })
});

});spade.register("kloudgis/home/lib/main", function(require, exports, __module, ARGV, ENV, __filename){
require("kloudgis/auth/lib/main");
require("kloudgis/core/lib/main_ds");
require("kloudgis/core/lib/core_date");
require("kloudgis/app/lib/views/button");
require("kloudgis/app/lib/views/text_field");
require("./strings");
require("./templates");
require("./controllers/sandboxes");
require("./controllers/page");
require("./controllers/add_sandbox");
require("./core_statechart");
require("./views/title");
require("./views/sandbox");
require("./views/sandbox_list");
require("./views/add_sandbox");
require("./core_home");

});spade.register("kloudgis/home/lib/strings", function(require, exports, __module, ARGV, ENV, __filename){
/**
* Localize the page
**/

var fr = { 
	"_homeTitle": "Kloudgis",
	"_sandboxesListOne": "Votre projet:",
	"_sandboxesList": "Vos %@ projets:",
	"_sandboxesNothing": "Vous n'avez pas de projet.",
	"_errorLoading": "Erreur lors du chargement des projets.",
	"_welcomeUser": "Bienvenue %@",
	"_wrong-membership": "Vous n'être pas membre de ce projet.",
	"_sbDateFormat": "%@/%@/%@",
	"_by" : "Par",
	"_createSandboxTitle": "Créer un nouveau sandbox",
	"_add" : "Ajouter",
	"_cancel": "Annuler",
	"_create": "Créer",
	"_sandboxName": "Le nom du projet",
	"_nameAlreadyTaken" : "Vous avez déjà un projet de ce nom."
	
};

var en = {
	"_homeTitle": "Kloudgis",
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
	"_cancel": "Cancel",
	"_create": "Create",
	"_sandboxName": "The Sandbox Name",
	"_nameAlreadyTaken" : "You already have a sandbox with that name"
};

if(KG.lang === 'fr'){
	SC.STRINGS = fr;
}else{
	SC.STRINGS = en;
}

//do the localize after the rendering
SC.run.schedule('render',null, function(){
	console.log('localize page');
	document.title = "_homeTitle".loc();
});

});spade.register("kloudgis/home/lib/templates", function(require, exports, __module, ARGV, ENV, __filename){
Ember.TEMPLATES['sandbox-list'] = spade.require('kloudgis/home/templates/sandbox_list');
Ember.TEMPLATES['add-sandbox'] = spade.require('kloudgis/home/templates/add_sandbox');

});spade.register("kloudgis/home/lib/views/add_sandbox", function(require, exports, __module, ARGV, ENV, __filename){
KG.AddSandboxView = Ember.View.extend({
	classNameBindings: ['hidden'],
	hiddenBinding: 'KG.pageController.addSandboxHidden'
})

});spade.register("kloudgis/home/lib/views/sandbox", function(require, exports, __module, ARGV, ENV, __filename){
//super view to show the sandbox properties
KG.SandboxView = KG.Button.extend({

    triggerAction: function() {
		console.log('open!!');
        KG.statechart.sendAction('openSandboxAction', this.getPath('itemView.content.key'));
    }
});

});spade.register("kloudgis/home/lib/views/sandbox_list", function(require, exports, __module, ARGV, ENV, __filename){
KG.SandboxListView = Ember.View.extend({
	classNameBindings: ['hidden'],
	hiddenBinding: 'KG.pageController.listSandboxHidden'
})

});spade.register("kloudgis/home/lib/views/title", function(require, exports, __module, ARGV, ENV, __filename){
/**
* View to render the sandbox list title.
**/

KG.TitleView = SC.View.extend({

    titleStringBinding: 'KG.pageController.listTitle'

});

});spade.register("kloudgis/home/templates/add_sandbox", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("{{#view id=\"add-sandbox-title\" class=\"page-title\"}}\n\t{{KG.pageController.addTitle}}\n{{/view}}\n{{#view}}\n\t<div>\n\t\t{{view KG.TextField placeholder_not_loc=\"_sandboxName\" valueBinding=\"KG.addSandboxController.name\"}}\t\n\t</div>\n\t{{#view KG.Button class=\"white-button\" sc_action=\"cancelCreateAction\"}}\n\t\t<img src=\"resources/images/cancel_30.png\">\n\t{{/view}}\n\t{{#view KG.Button class=\"white-button\" sc_action=\"commitCreateAction\"}}\n\t\t<img src=\"resources/images/checkmark_30.png\">\n\t{{/view}}\n{{/view}}\n");
});spade.register("kloudgis/home/templates/sandbox_list", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("{{#view KG.TitleView id=\"sandboxes-title\" class=\"page-title\"}}\n\t{{titleString}}\n{{/view}}\n{{#view}}\n{{#collection contentBinding=\"KG.sandboxesController\" class=\"sandbox-list\"}}\n\t\t{{#view KG.SandboxView tagName=\"div\" class=\"sandbox-list-item common-list-button\"}}\n\t\t\t{{#view tagName=\"span\" class=\"sandbox-name\"}}\n\t\t\t\t{{itemView.content.name}}\n\t\t\t{{/view}}\n\t\t\t<span class=\"sandbox-owner-label\">{{loc _by}} {{itemView.content.ownerDescriptor}}</span>\n\t\t\t<span>{{itemView.content.formattedDate}}</span>\n\t\t{{/view}}\n{{/collection}}\n\t\n{{#view KG.Button  id=\"create-sandbox-button\" class=\"white-button\" sc_action=\"createSandboxAction\" titleBinding=\"KG.core_home.createSandboxTitle\" isVisibleBinding=\"KG.sandboxesController.recordsReady\"}}\n\t<img src=\"resources/images/add_30.png\">\n{{/view}}\t\n{{/view}}\t\t\n");
});