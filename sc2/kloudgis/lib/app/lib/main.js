//framework dependencies
require("sproutcore");
require("sproutcore-statechart");

//create the namespace
KG = SC.Application.create({
    //store: SC.Store.create().from(SC.Record.fixtures),
    lang: 'fr',
    activeSandboxKey: null
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
    },

    //get/set a cookie
    cookie: function(key, value, options) {

        // key and at least value given, set cookie...
        if (arguments.length > 1 && String(value) !== "[object Object]") {
            options = jQuery.extend({},
            options);

            if (value === null || value === undefined) {
                options.expires = -1;
            }

            if (typeof options.expires === 'number') {
                var days = options.expires,
                t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = String(value);

            return (document.cookie = [
            encodeURIComponent(key), '=', options.raw ? value: encodeURIComponent(value), options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path: '', options.domain ? '; domain=' + options.domain: '', options.secure ? '; secure': ''].join(''));
        }

        // key and possibly options given, get cookie...
        options = value || {};
        var result, decode = options.raw ?
        function(s) {
            return s;
        }: decodeURIComponent;
        return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
    }

});

//detect safari mobile
jQuery.extend(jQuery.browser, {
    isIphone: navigator.userAgent.toLowerCase().indexOf('iphone') > 0
});
