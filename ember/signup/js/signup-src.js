/*
 Copyright (c) 2010-2011, XYZ Civitas
 Kloudgis.
 http://kloudgis.com
*/
//create the namespace
KG = Ember.Application.create({lang:'fr',  serverHost: '/'});

//loc helper
Handlebars.registerHelper('loc',
function(property, options) {
    var value = property.loc();
    if (options.hash.id) {
        var tag = options.hash.tagName || 'span';
        return new Handlebars.SafeString('<' + tag + ' id="' + options.hash.id + '">' + value + '</' + tag + '>');
    } else if (options.hash.class) {
        var tag = options.hash.tagName || 'span';
        return new Handlebars.SafeString('<' + tag + ' class="' + options.hash.class + '">' + value + '</' + tag + '>');
    } else if (options.hash.tagName) {
        var tag = options.hash.tagName;
        return new Handlebars.SafeString('<' + tag + '>' + value + '</' + tag + '>');
    }
    return value;
});


var fr = { 
	"_signupTitle": "Kloudgis - Compte",
    "_Empty": "Le champ est obligatoire.",
	"_signupKloudgis": "Créer un compte Kloudgis",
	"_serverError": "Erreur du serveur",
	"_nullTokenError" : "Erreur lors de l'authentification.",
	"_pwdMinLength": "Doit contenir au minimum 6 caractères.",
	"_email" : "Courriel",
	"_pwd": "Mot de passe",
	"_name": "Nom complet",
	"_company": "Compagnie",
	"_location": "Emplacement",
	"_createAccount": "Créer",
	"_InUse": "Ce courriel est déjà utilisé.",
	"_invalid": "Le courriel est invalide.",
	"_correctErrorFirst": "Veuillez corriger les erreurs pour continuer."
};

var en = {
	"_signupTitle": "Kloudgis - Account",
	"_Empty": "This field is required.",
	"_signupKloudgis": "Signup to Kloudgis",
	"_serverError": "Server error.",
	"_nullTokenError" : "Authentification error.",
	"_pwdMinLength": "Must contained atleast 6 characters.",
	"_email" : "Email",
	"_pwd": "Password",
	"_name": "Full Name",
	"_company": "Company",
	"_location": "Location",
	"_createAccount": "Create",
	"_InUse": "This email is already taken.",
	"_invalid": "This email is not valid.",
	"_correctErrorFirst": "Please fix the error to continue."
};

if(KG.lang === 'fr'){
	SC.STRINGS = fr;
}else{
	SC.STRINGS = en;
}

//do the localize after the rendering
SC.run.schedule('render',null, function(){
	console.log('localize page');
	document.title = "_signupTitle".loc();
	$("#kloud-welcome").text("_signupKloudgis".loc());
	$("#email-label").text("_email".loc());
	$("#pwd-label").text("_pwd".loc());
	$("#name-label").text("_name".loc());
	$("#company-label").text("_company".loc());
	$("#location-label").text("_location".loc());
	$("#create-button").text("_createAccount".loc());	
});

/**
* Extend the SC.Button to add more attributes and send Statechart action
**/
var get = SC.get;
KG.Button = SC.Button.extend({

    attributeBindings: ['type', 'disabled', 'title'],

    triggerAction: function() {
        this._super();
        var action = get(this, 'sc_action');
        if (action && KG.statechart) {
            KG.statechart.sendAction(action, this.get('content') || this.getPath('itemView.content'));
            if (this.postAction) {
                this.postAction();
            }
        }
    },

	//manual mouseDown Event Handling
	manualMouseDown: NO,

	_mouseDownListener: null,
	_element: null,

    didInsertElement: function() {
        if (this.get('manualMouseDown')) {
            this._element = this.get('element');
            var self = this;
			this._mouseDownListener = function(e) {
                return self.mouseDown(e);
            };
			this._clickListener = function(e) {
                return self.click(e);
            };
            this._element.addEventListener('mousedown', this._mouseDownListener, false);
			this._element.addEventListener('click', this._clickListener, false);
        }
    },

	destroy:function(){
		if (get(this, 'isDestroyed')) { return; }
		if (this.get('manualMouseDown') && this._element) {
			this._element.removeEventListener('mousedown', this._mouseDownListener, false);
			this._element.removeEventListener('click', this._clickListener, false);
			this._element = null;
		}  
		this._super();
	}
});


/**
* textfield to forward the event to the parent view
**/
KG.ForwardTextField = SC.TextField.extend({
  
  attributeBindings: ['type', 'placeholder', 'value', 'autocapitalize', 'autocorrect'],

  focusOut: function(event) {
	this._super(event);
    return true;
  },

  change: function(event) {
	this._super(event);
    return true;
  },

  keyUp: function(event) {
    this._super(event);
    return true;
  },
});

/**
* View to show a spinner image 
**/
KG.LoadingImageView = SC.View.extend({
	classNames:'loading-image'.w(),
	loadingImage: 'resources/images/loading.gif'
});

/**
* View for one of the signup field.  The actual textfield will forward the events to this parent view.
**/
KG.SignupField = SC.View.extend({
	
	classNames: 'signup-field'.w(),
	focus: NO,
	
	focusIn: function(e){
		this.set('focus', YES);
		KG.statechart.sendAction('focusInEvent', this, e);
		return YES;
	},
	
	focusOut: function(e){
		this.set('focus', NO);
		KG.statechart.sendAction('focusOutEvent', this, e);
		return NO;
	},
	
	keyDown: function(e){	
		return YES;
	},
	
	keyUp: function(e){		
		if(e.keyCode == 13){
			KG.statechart.sendAction('newLineEvent', this, e);
		}
		return NO;
	},
	
});


Ember.TEMPLATES["signup-page"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, stack2, stack3, stack4, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n							<label id=\"email-label\" for=\"user-textfield\">");
  stack1 = depth0;
  stack2 = "_email";
  stack3 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, tmp1); }
  else if(stack3=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack3; }
  data.buffer.push(escapeExpression(stack1) + "</label>\n							");
  stack1 = depth0;
  stack2 = "KG.ForwardTextField";
  stack3 = {};
  stack4 = "user-textfield";
  stack3['id'] = stack4;
  stack4 = "KG.userFieldController.value";
  stack3['valueBinding'] = stack4;
  stack4 = "email";
  stack3['type'] = stack4;
  stack4 = "_UserHint";
  stack3['placeholder_not_loc'] = stack4;
  stack4 = "false";
  stack3['spellcheck'] = stack4;
  stack4 = "off";
  stack3['autocorrect'] = stack4;
  stack4 = "off";
  stack3['autocapitalize'] = stack4;
  stack4 = "true";
  stack3['autofocus'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(2, program2, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n							<span>");
  stack1 = depth0;
  stack2 = "KG.userFieldController.errorMessage";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "</span>						\n							");
  stack1 = depth0;
  stack2 = "KG.LoadingImageView";
  stack3 = {};
  stack4 = "KG.userFieldController.isBusy";
  stack3['isVisibleBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(4, program4, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n						");
  return buffer;}
function program2(depth0,data) {
  
  
  data.buffer.push("\n							");}

function program4(depth0,data) {
  
  var buffer = '', stack1, stack2;
  data.buffer.push("\n								<img ");
  stack1 = {};
  stack2 = "loadingImage";
  stack1['src'] = stack2;
  stack2 = helpers.bindAttr || depth0.bindAttr;
  tmp1 = {};
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else if(stack2=== undef) { stack1 = helperMissing.call(depth0, "bindAttr", tmp1); }
  else { stack1 = stack2; }
  data.buffer.push(escapeExpression(stack1) + " alt=\"Loading\"/>\n							");
  return buffer;}

function program6(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n							<label id=\"pwd-label\" for=\"pwd-textfield\">");
  stack1 = depth0;
  stack2 = "_pwd";
  stack3 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, tmp1); }
  else if(stack3=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack3; }
  data.buffer.push(escapeExpression(stack1) + "</label>\n							");
  stack1 = depth0;
  stack2 = "KG.ForwardTextField";
  stack3 = {};
  stack4 = "pwd-textfield";
  stack3['id'] = stack4;
  stack4 = "KG.pwdFieldController.value";
  stack3['valueBinding'] = stack4;
  stack4 = "password";
  stack3['type'] = stack4;
  stack4 = "_PwdHint";
  stack3['placeholder_not_loc'] = stack4;
  stack4 = "false";
  stack3['spellcheck'] = stack4;
  stack4 = "off";
  stack3['autocorrect'] = stack4;
  stack4 = "off";
  stack3['autocapitalize'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(7, program7, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n							<span>");
  stack1 = depth0;
  stack2 = "KG.pwdFieldController.errorMessage";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "</span>						\n						");
  return buffer;}
function program7(depth0,data) {
  
  
  data.buffer.push("\n							");}

function program9(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n							<label id=\"name-label\" for=\"name-textfield\">");
  stack1 = depth0;
  stack2 = "_name";
  stack3 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, tmp1); }
  else if(stack3=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack3; }
  data.buffer.push(escapeExpression(stack1) + "</label>\n							");
  stack1 = depth0;
  stack2 = "KG.ForwardTextField";
  stack3 = {};
  stack4 = "name-textfield";
  stack3['id'] = stack4;
  stack4 = "KG.nameFieldController.value";
  stack3['valueBinding'] = stack4;
  stack4 = "text";
  stack3['type'] = stack4;
  stack4 = "_NameHint";
  stack3['placeholder_not_loc'] = stack4;
  stack4 = "false";
  stack3['spellcheck'] = stack4;
  stack4 = "off";
  stack3['autocorrect'] = stack4;
  stack4 = "off";
  stack3['autocapitalize'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(10, program10, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n							<span>");
  stack1 = depth0;
  stack2 = "KG.nameFieldController.errorMessage";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "</span>					\n						");
  return buffer;}
function program10(depth0,data) {
  
  
  data.buffer.push("\n							");}

function program12(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n							<label id=\"company-label\" for=\"company-textfield\">");
  stack1 = depth0;
  stack2 = "_company";
  stack3 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, tmp1); }
  else if(stack3=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack3; }
  data.buffer.push(escapeExpression(stack1) + "</label>\n							");
  stack1 = depth0;
  stack2 = "KG.ForwardTextField";
  stack3 = {};
  stack4 = "company-textfield";
  stack3['id'] = stack4;
  stack4 = "KG.companyFieldController.value";
  stack3['valueBinding'] = stack4;
  stack4 = "text";
  stack3['type'] = stack4;
  stack4 = "_CompanyHint";
  stack3['placeholder_not_loc'] = stack4;
  stack4 = "false";
  stack3['spellcheck'] = stack4;
  stack4 = "off";
  stack3['autocorrect'] = stack4;
  stack4 = "off";
  stack3['autocapitalize'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(13, program13, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n							<span>");
  stack1 = depth0;
  stack2 = "KG.companyFieldController.errorMessage";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "</span>				\n						");
  return buffer;}
function program13(depth0,data) {
  
  
  data.buffer.push("\n							");}

function program15(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n							<label id=\"location-label\" for=\"location-textfield\">");
  stack1 = depth0;
  stack2 = "_location";
  stack3 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, tmp1); }
  else if(stack3=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack3; }
  data.buffer.push(escapeExpression(stack1) + "</label>\n							");
  stack1 = depth0;
  stack2 = "KG.ForwardTextField";
  stack3 = {};
  stack4 = "location-textfield";
  stack3['id'] = stack4;
  stack4 = "KG.locationFieldController.value";
  stack3['valueBinding'] = stack4;
  stack4 = "text";
  stack3['type'] = stack4;
  stack4 = "_LocationHint";
  stack3['placeholder_not_loc'] = stack4;
  stack4 = "false";
  stack3['spellcheck'] = stack4;
  stack4 = "off";
  stack3['autocorrect'] = stack4;
  stack4 = "off";
  stack3['autocapitalize'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(16, program16, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n							<span>");
  stack1 = depth0;
  stack2 = "KG.locationFieldController.errorMessage";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "</span>						\n						");
  return buffer;}
function program16(depth0,data) {
  
  
  data.buffer.push("\n							");}

function program18(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3;
  data.buffer.push("\n                            ");
  stack1 = depth0;
  stack2 = "_createAccount";
  stack3 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, tmp1); }
  else if(stack3=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack3; }
  data.buffer.push(escapeExpression(stack1) + "						\n						");
  return buffer;}

function program20(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n							<span>");
  stack1 = depth0;
  stack2 = "message";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "</span>\n						");
  return buffer;}

  data.buffer.push("<a  id=\"kloud-logo\" href=\"/kloudgis\">\n			<img src=\"css/images/kloudgis_black_128.png\" alt=\"Kloudgis\"/>\n		</a>\n		<span id=\"kloud-welcome\">");
  stack1 = depth0;
  stack2 = "_signupTitle";
  stack3 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, tmp1); }
  else if(stack3=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack3; }
  data.buffer.push(escapeExpression(stack1) + "	</span>\n		<div class=\"signup-pane\">\n			<table>\n			<tr class=\"section\">\n					<td>\n						");
  stack1 = depth0;
  stack2 = "KG.SignupField";
  stack3 = {};
  stack4 = "user-field";
  stack3['id'] = stack4;
  stack4 = "focus hasError";
  stack3['classBinding'] = stack4;
  stack4 = "KG.userFieldController.hasError";
  stack3['hasErrorBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("	\n					</td>\n			</tr>\n			<tr class=\"section\">\n					<td>\n						");
  stack1 = depth0;
  stack2 = "KG.SignupField";
  stack3 = {};
  stack4 = "pwd-field";
  stack3['id'] = stack4;
  stack4 = "focus hasError";
  stack3['classBinding'] = stack4;
  stack4 = "KG.pwdFieldController.hasError";
  stack3['hasErrorBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(6, program6, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("	\n					</td>\n			</tr>\n			<tr class=\"section\">\n					<td>\n						");
  stack1 = depth0;
  stack2 = "KG.SignupField";
  stack3 = {};
  stack4 = "name-field";
  stack3['id'] = stack4;
  stack4 = "focus hasError";
  stack3['classBinding'] = stack4;
  stack4 = "KG.nameFieldController.hasError";
  stack3['hasErrorBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(9, program9, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("	\n					</td>\n			</tr>\n			<tr class=\"section\">\n					<td>\n						");
  stack1 = depth0;
  stack2 = "KG.SignupField";
  stack3 = {};
  stack4 = "company-field";
  stack3['id'] = stack4;
  stack4 = "focus hasError";
  stack3['classBinding'] = stack4;
  stack4 = "KG.companyFieldController.hasError";
  stack3['hasErrorBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(12, program12, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("	\n					</td>\n			</tr>\n			<tr class=\"section\">\n					<td>\n						");
  stack1 = depth0;
  stack2 = "KG.SignupField";
  stack3 = {};
  stack4 = "location-field";
  stack3['id'] = stack4;
  stack4 = "focus hasError";
  stack3['classBinding'] = stack4;
  stack4 = "KG.locationFieldController.hasError";
  stack3['hasErrorBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(15, program15, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("	\n					</td>\n			</tr>	\n			<tr class=\"section\">\n					<td>\n						");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "createAccountAction";
  stack3['sc_action'] = stack4;
  stack4 = "create-button";
  stack3['id'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(18, program18, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n					</td>\n			</tr>\n			<tr class=\"section\">\n					<td>\n						");
  stack1 = {};
  stack2 = "KG.core_signup.globalError";
  stack1['messageBinding'] = stack2;
  stack2 = "global-error";
  stack1['id'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(20, program20, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n					</td>\n			</tr>\n			</table>\n		</div>");
  return buffer;
})

/**
* Core functions to signup 
**/
KG.core_signup = SC.Object.create({

    globalError: '',

    createAccount: function() {
        this.validateAllExceptUser();
        this.validateUser(this, this.createUserCallback());
    },

    createUserCallback: function() {
        var found = KG.fields.findProperty('isValid', NO);
        if (!found) {
            this.set('globalError', '');
			var postData = {
				user: KG.userFieldController.get('value'),
				pwd: SHA256(KG.pwdFieldController.get('value')),
				name: KG.nameFieldController.get('value'),
				company: KG.companyFieldController.get('value'),
				location: KG.locationFieldController.get('value'),
			};
			// Call server
            $.ajax({
                type: 'POST',
                url: KG.get('serverHost') + 'api_auth/public/register',
                data: JSON.stringify(postData),
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                context: this,
                error: function(){
					this.set('globalError', '_serverError'.loc());
				},
                success: function(data){
					console.log(data);
					if(data.content == "_success"){
						window.location.href = "/kloudgis?user=" + KG.userFieldController.get('value');
					}else{
						this.set('globalError', data.content.loc());
					}
				},
                async: YES
            });
        } else {
            this.set('globalError', '_correctErrorFirst'.loc());
        }
    },

    validateUser: function(cb_target, cb) {
        KG.userFieldController.validate(cb_target, cb);
    },

    validateAllExceptUser: function() {
        for (i = 1; i < KG.fields.length; i++) {
            KG.fields[i].validate();
        }
    }

});

//Each fields
KG.FieldController = SC.Object.extend({
    value: undefined,
    hasError: NO,
    isBusy: NO,
    errorMessage: '',

    validate: function() {
		this.setError();
	},

    setError: function(error) {
        if (SC.none(error)) {
            this.set('hasError', NO);
            this.set('errorMessage', '');
        } else {
            this.set('hasError', YES);
            this.set('errorMessage', error);
        }
    },

    isValid: function() {
        return ! this.get('hasError') && !this.get('isBusy');
    }.property('hasError', 'isBusy')

});

KG.userFieldController = KG.FieldController.create({
    validate: function(cb_target, cb) {
        if (jQuery('#user-textfield')[0].validationMessage != '') {
			this.setError('_invalid'.loc());
            if (cb) {
                this.cb.call(this.cb_target);
            }
        } else {
            var fieldValue = this.get('value');
            this.set('isBusy', YES);
            var url = KG.get('serverHost') + 'api_auth/public/register/test_email';
            var context = {
                callbackTarget: cb_target,
                callbackFunction: cb,
                field: this,
                doCallback: function() {
                    this.field.set('isBusy', NO);
                    // Callback
                    if (!SC.none(this.callbackFunction)) {
                        this.callbackFunction.call(this.callbackTarget);
                    }
                }
            };
            // Call server
            $.ajax({
                type: 'POST',
                url: url,
                data: fieldValue,
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                context: context,
                error: this.ajaxError,
                success: this.ajaxSuccess,
                async: YES
            });
        }
    },

    ajaxError: function() {
        this.field.setError('_serverError'.loc());
        this.doCallback();
    },

    ajaxSuccess: function(data) {
        if (data.content === 'Accepted') {
            this.field.setError();
        } else {
            this.field.setError(data.content.loc());
        }
        this.doCallback();
    }
});
KG.pwdFieldController = KG.FieldController.create({
	validate: function() {
		var val = this.get('value');
		if(SC.none(val)){
			this.setError('_Empty'.loc());
		}else if(val.length < 6){
			this.setError('_pwdMinLength'.loc());
		}else{
			this.setError();
		}		
	},
});
KG.nameFieldController = KG.FieldController.create();
KG.companyFieldController = KG.FieldController.create();
KG.locationFieldController = KG.FieldController.create();

KG.fields = [KG.userFieldController, KG.pwdFieldController, KG.nameFieldController, KG.companyFieldController, KG.locationFieldController];

$(document).ready(function() {
    KG.statechart.initStatechart();
});


/**
* Statechart for the signup page
**/
SC.mixin(KG, {
    //global state chart
    statechart: SC.Statechart.create({
        //log trace
        trace: NO,

        rootState: SC.State.extend({

            initialSubstate: 'startupState',       

            startupState: SC.State.extend({

                enterState: function() {
                    console.log('enter signup');				
                },
            }),

			userFieldFocusState: SC.State.extend({
				
                enterState: function() {
                    console.log('enter user field');
                },

				focusOutEvent: function(){
					this._validate();
				},
				
				newLineEvent: function(){
					console.log('newline');
					this._validate();
				},
				
				_validate:function(){
					KG.core_signup.validateUser();
				}
				
            }),

			otherFieldFocusState: SC.State.extend({

                enterState: function() {
                    console.log('enter other field');
                },

				focusOutEvent: function(){
					KG.core_signup.validateAllExceptUser();
				},
				
				newLineEvent: function(){
					KG.core_signup.validateAllExceptUser();
				},
            }),

			createAccountAction: function(){
				KG.core_signup.createAccount();
			},
			
			focusInEvent: function(source, domEvent) {
                var id = source.get('elementId');
				console.log('focus in '  + id);
				
                if (id === 'user-field') {
                    this.gotoState('userFieldFocusState');
                } else {
                    this.gotoState('otherFieldFocusState');
                } 
            }

        })
    })
});


