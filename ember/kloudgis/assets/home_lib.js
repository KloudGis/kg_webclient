/* ===========================================================================
   BPM Combined Asset File
   MANIFEST: kloudgis ()
   This file is generated automatically by the bpm (http://www.bpmjs.org)
   =========================================================================*/

spade.register("kloudgis/home/lib/controllers/sandboxes", function(require, exports, __module, ARGV, ENV, __filename){
/**
* List of sandbox
**/

KG.sandboxesController = Ember.ArrayController.create({
	content: [],
	recordsReady:  NO
	
});

});spade.register("kloudgis/home/lib/core_home", function(require, exports, __module, ARGV, ENV, __filename){
/**
* Core functions for the home page
**/

KG.core_home = SC.Object.create({
	
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
    KG.statechart.initStatechart();
	 if ($.browser.isIphone) {
		setTimeout(function() { window.scrollTo(0, 1) }, 1000);
	 }
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
						KG.core_home.authenticate();}, 1);										
		        },
		
				authenticationSucceeded: function(){
					this.gotoState('loggedInState');
				},
				
				
				authenficationFailed: function(){
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
				
					enterState:function(){
						console.log('hi!');
						KG.core_home.loadSandboxList();				
						var mess = $.getQueryString('message');
						if(mess){
							var tag = $('#query-message');
							tag.text(mess.loc());
							tag.css('visibility', 'visible');
						}
					}
			})
			
        })
    })
});

});spade.register("kloudgis/home/lib/main", function(require, exports, __module, ARGV, ENV, __filename){
require("kloudgis/auth/lib/main");
require("kloudgis/core/lib/main_ds");
require("kloudgis/core/lib/core_date");
require("./strings");
require("./controllers/sandboxes");
require("./core_statechart");
require("./views/title");
require("./views/open_sandbox_link");
require("./views/sandbox");
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
	"_sbDateFormat": "%@/%@/%@"
};

var en = {
	"_homeTitle": "Kloudgis",
	"_sandboxesListOne": "Your projet:",
	"_sandboxesList": "Your %@ projets:",
	"_sandboxesNothing": "You don't have any project.",
	"_errorLoading": "Cannot load the projects.",
	"_welcomeUser": "Welcome %@",
	"_wrong-membership": "You are not a member of this project.",
	"_sbDateFormat": "%@/%@/%@"
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

});spade.register("kloudgis/home/lib/views/open_sandbox_link", function(require, exports, __module, ARGV, ENV, __filename){
/**
* View to open a sandbox: Go to the sandbox page (map). 
**/

KG.OpenSandboxLinkView = SC.View.extend({
	
	attributeBindings: ['href'],
	
	title: function(){
		return this.getPath('itemView.content.name');	
	}.property(),
	
	href: function(){
		return "sandbox.html?sandbox=" + this.getPath('itemView.content.key');
	}.property()
	
});

});spade.register("kloudgis/home/lib/views/sandbox", function(require, exports, __module, ARGV, ENV, __filename){
//super view to show the sandbox properties
KG.SandboxView = SC.View.extend({
		
});

});spade.register("kloudgis/home/lib/views/title", function(require, exports, __module, ARGV, ENV, __filename){
/**
* View to render the sandbox list title.
**/

KG.TitleView = SC.View.extend({

    recordsReadyBinding: 'KG.sandboxesController.recordsReady',

    titleString: function() {

        if (this.get('recordsReady')) {
            var count = KG.sandboxesController.get('length');
            if (count > 0) {
				if(count === 1){
					return "_sandboxesListOne".loc();
				}else{
                	return "_sandboxesList".loc(count);
				}
            } else {
                return "_sandboxesNothing".loc();
            }
        }else{
			return '';
		}
    }.property('recordsReady')

});

});