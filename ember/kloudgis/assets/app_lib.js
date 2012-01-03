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
    //store: SC.Store.create().from(SC.Record.fixtures),
    lang: 'fr',
    activeSandboxKey: null,
	serverHost: '/'
});

//loc helper
Handlebars.registerHelper('loc', function(property, options) {
  	var value = property.loc();
	if(options.hash.id){
		var tag = options.hash.tagName || 'span';
		return new Handlebars.SafeString('<'+tag+' id="'+options.hash.id+'">'+value+'</'+tag+'>'); 
	}
	return value;
});
//highlight helper
Handlebars.registerHelper('highlight', function(property) {
  var value = SC.getPath(this, property);
  return new Handlebars.SafeString('<span class="highlight">'+value+'</span>');
});

//temp fix on jQuery1.6.2 (to remove with 1.7)
(function(){
    // remove layerX and layerY
    var all = $.event.props,
        len = all.length,
        res = [];
    while (len--) {
      var el = all[len];
      if (el != 'layerX' && el != 'layerY') res.push(el);
    }
    $.event.props = res;
}());
//end temp fix

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

});spade.register("kloudgis/app/lib/views/bubble_touch", function(require, exports, __module, ARGV, ENV, __filename){
KG.BubbleTouchView = SC.View.extend({
    touchStart: function(touch) {
        this._super(touch);
        return YES; //bubble
    },

    touchEnd: function(touch) {
        this._super(touch);
        return YES; //bubble
    }
});

});spade.register("kloudgis/app/lib/views/button", function(require, exports, __module, ARGV, ENV, __filename){
/**
* Extend the SC.Button to add more attributes and send Statechart action
**/

var get = SC.get;
KG.Button = SC.Button.extend({

    attributeBindings: ['type', 'disabled', 'title'],

    disableTouch: NO,

    label_loc: function() {
        return this.get('label').loc();
    }.property('label'),

    mouseUp: function(e) {
        this._super(e);
        var action = get(this, 'sc_action')
        if (action && KG.statechart) {
            KG.statechart.sendAction(action, this.get('content') || this.getPath('itemView.content'));
			if(this.postAction){
				this.postAction();
			}
        }
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        return NO;
    },

    keyUp: function(e) {
        if (e.keyCode == 13) {
            var action = get(this, 'sc_action')
            if (action && KG.statechart) {
                KG.statechart.sendAction(action, this.get('content') || this.getPath('itemView.content'));
				if(this.postAction){
					this.postAction();
				}
            }
        }
        return NO;
    },

    touchStart: function(touch) {
        this._super(touch);
		return NO;//no bubble
    },

    touchEnd: function(touch) {
        this._super(touch);
		return NO;//no bubble
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
* Extend the SC.TextArea to add more attributes and localize the placeholder
**/

KG.NumericTextField = KG.TextField.extend({

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
            var val = $('select option:selected').val();
            self.set('value', val);
        });		
    }
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
	
	mouseUp: function(e) {
		this._super(e);
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