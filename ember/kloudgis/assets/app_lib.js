/* ===========================================================================
   BPM Combined Asset File
   MANIFEST: kloudgis ()
   This file is generated automatically by the bpm (http://www.bpmjs.org)
   =========================================================================*/

spade.register("kloudgis/app/lib/main", function(require, exports, __module, ARGV, ENV, __filename){
//framework dependencies
require("ember");
require("ember-statechart");

//create the namespace
KG = Ember.Application.create({
    lang: 'fr',
    activeSandboxKey: null,
    serverHost: '/',

    //set to NO for PRODUCTION
    debugMode: YES,

    enableLogger: function() {
        if (!this._oldLogger) {
            return;
        }
        window.console.log = this._oldLogger;
    },

    _oldLogger: null,

    disableLogger: function() {
        this._oldLogger = window.console.log;
        window.console.log = function() {};
    }
});

//default: Disable log is not Debug 
if (!KG.get('debugMode')) {
    KG.disableLogger();
}

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
//highlight helper
Handlebars.registerHelper('highlight',
function(property) {
    var value = SC.getPath(this, property);
    return new Handlebars.SafeString('<span class="highlight">' + value + '</span>');
});

//jQuery extension
$.extend({
    //extract from the URL a query value
    getQueryString: function(name) {
        function parseParams() {
            var params = {},
            e, a = /\+/g,
            // Regex for replacing addition symbol with a space
            r = /([^&=]+)=?([^&]*)/g,
            d = function(s) {
                return decodeURIComponent(s.replace(a, " "));
            },
            q = window.location.search.substring(1);

            while (e = r.exec(q))
            params[d(e[1])] = d(e[2]);

            return params;
        }

        if (!this.queryStringParams) this.queryStringParams = parseParams();

        return this.queryStringParams[name];
    }

});

//detect safari mobile
jQuery.extend(jQuery.browser, {
    isIphone: navigator.userAgent.toLowerCase().indexOf('iphone') > 0
});

});spade.register("kloudgis/app/lib/views/button", function(require, exports, __module, ARGV, ENV, __filename){
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

});spade.register("kloudgis/app/lib/views/forward_text_field", function(require, exports, __module, ARGV, ENV, __filename){
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

});spade.register("kloudgis/app/lib/views/loading_image", function(require, exports, __module, ARGV, ENV, __filename){
/**
* View to show a spinner image 
**/

KG.LoadingImageView = SC.View.extend({
	classNames:'loading-image'.w(),
	loadingImage: 'resources/images/loading.gif'
});

});spade.register("kloudgis/app/lib/views/numeric_text_field", function(require, exports, __module, ARGV, ENV, __filename){
/**
* Extend the Ember.TextField to add more attributes and localize the placeholder
**/

KG.NumericTextField = Ember.TextField.extend({

    attributeBindings: ['type', 'placeholder', 'value', 'autofocus', 'min', 'max', 'step']
});

});spade.register("kloudgis/app/lib/views/select", function(require, exports, __module, ARGV, ENV, __filename){
KG.SelectView = SC.View.extend({
    value: null,

    valueChanged: function(){
        this.$('select').val( this.get('value') );
    }.observes('value'),

    didInsertElement: function(){
        var self = this;
		this.valueChanged();
        this.$('select').change(function(){
            var val = self.$('select option:selected').val();
            self.set('value', val);
        });		
    }
});

});spade.register("kloudgis/app/lib/views/select_input", function(require, exports, __module, ARGV, ENV, __filename){
KG.otherKey = '|?|';
KG.SelectInputView = Ember.View.extend({
	
	value: null,
	
	keyName: 'key',
	
	didInsertElement: function(){
        var self = this;
		this.valueChanged();	
    },

    valueChanged: function(){
		var content = this.get('content');
		var value = this.get('value');
		var found = NO;
		if(content){
			found = content.findProperty(this.get('keyName'), value);
		}
		if(!found){
			this.set('valueSelect', KG.otherKey);
			this.set('valueInput', value);
		}else{
			this.set('valueSelect', found.key);
		}
    }.observes('value'),

	valueSelect: null,
	
	valueSelectChanged: function(){
		var sv = this.get('valueSelect');
		//console.log('select view value:' + sv);
		if(sv === KG.otherKey){
			this.set('inputClass', 'visible-element');
		}else{
			var v = this.get('value');
			if(sv !== v){
				this.set('value', sv);
			}
			this.set('inputClass', 'not-visible-element');
		}
    }.observes('valueSelect'),

	valueInput: '',

    valueInputChanged: function(){
		var iv = this.get('valueInput');
        //console.log('Input view value:' + iv);
		var v = this.get('value');
		if(iv !== v){
			this.set('value', iv);
		}
    }.observes('valueInput'),

	inputClass: 'not-visible-element'
});

});spade.register("kloudgis/app/lib/views/switch", function(require, exports, __module, ARGV, ENV, __filename){
KG.SwitchView = KG.Button.extend({
	
	classNames: ['switch'],
	tagName: 'div',
	
	value: null, 
	
	on: function(key, value){
		if(value !== undefined){
			this.setPath('value', value);
		}
		return this.getPath('value');
	}.property('value'),
	
	triggerAction: function() {
		this.set('on', !this.get('on'));
	}
});

});spade.register("kloudgis/app/lib/views/text_area", function(require, exports, __module, ARGV, ENV, __filename){
/**
* Extend the SC.TextArea to add more attributes and localize the placeholder
**/

KG.TextArea = SC.TextArea.extend({
    attributeBindings: ['placeholder', 'disabled'],

	placeholder: function(){
		if(SC.none(this.get('placeholder_not_loc'))){
			return null;
		}
		return this.get("placeholder_not_loc").loc();
	}.property('placeholder_not_loc')
	
});

});spade.register("kloudgis/app/lib/views/text_field", function(require, exports, __module, ARGV, ENV, __filename){
/**
* Extend the SC.TextArea to add more attributes and localize the placeholder
**/

KG.TextField = SC.TextField.extend({

    //add more attributes (from autofocus)
    attributeBindings: ['type', 'placeholder', 'value', 'autofocus', 'spellcheck', 'autocorrect', 'autocapitalize', "autocomplete", 'disabled', "size", "results"],

    nl_sc_action: null,
    placeholder_not_loc: null,

    placeholder: function() {
        if (SC.none(this.get('placeholder_not_loc'))) {
            return null;
        }
        return this.get("placeholder_not_loc").loc();
    }.property('placeholder_not_loc'),

    insertNewline: function() {
        if (!SC.none(this.get('nl_sc_action'))) {
            KG.statechart.sendAction(this.get('nl_sc_action'), this);
        }
    },

    didInsertElement: function() {
        //To remove once Firefox support HTML5 autofocus attribute
        if (!SC.none(this.get('autofocus')) && $.browser.mozilla) {
            var self = this;
            setTimeout(function() {
                console.log('fallback focus');
                self.$().focus();
            },
            1);
        }
    }
});

});