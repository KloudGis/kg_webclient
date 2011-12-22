//framework dependencies
require("sproutcore");
require("sproutcore-statechart");

//create the namespace
KG = SC.Application.create({
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
