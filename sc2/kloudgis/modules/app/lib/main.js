//framework dependencies
require("sproutcore"); 
//require("sproutcore-datastore"); 
require("sproutcore-statechart");

//create the namespace
KG = SC.Application.create({ 
    //store: SC.Store.create().from(SC.Record.fixtures),
	lang: 'fr'
});

//jQuery extension
$.extend({      
        getQueryString: function (name) {           
            function parseParams() {
                var params = {},
                    e,
                    a = /\+/g,  // Regex for replacing addition symbol with a space
                    r = /([^&=]+)=?([^&]*)/g,
                    d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
                    q = window.location.search.substring(1);

                while (e = r.exec(q))
                    params[d(e[1])] = d(e[2]);

                return params;
            }

            if (!this.queryStringParams)
                this.queryStringParams = parseParams(); 

            return this.queryStringParams[name];
        }
    });