/* ===========================================================================
   BPM Combined Asset File
   MANIFEST: kloudgis ()
   This file is generated automatically by the bpm (http://www.bpmjs.org)
   =========================================================================*/

spade.register("kloudgis/addon/lib/handlebars/helpers", function(require, exports, __module, ARGV, ENV, __filename){
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

});spade.register("kloudgis/addon/lib/jquery/helpers", function(require, exports, __module, ARGV, ENV, __filename){

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

});