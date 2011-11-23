/**
* Core functions for the Sandbox page
**/
KG.core_sandbox = SC.Object.create({

    sandboxMeta: {},
    membership: null,
    isSandboxOwner: NO,

    mousePosition: null,

    setCenter: function(lonLat, zoom) {
        window.location.hash = 'lon:%@;lat:%@;zoom:%@'.fmt(lonLat.get('lon').toFixed(4), lonLat.get('lat').toFixed(4), zoom);
    },

    authenticate: function() {
        var success = KG.core_auth.load(this, this.authenticateCallback);
        return success;
    },

    authenticateCallback: function(message) {
        if (message === "_success") {
            //attempt to login to map service first to make the map rendering ready quickly
            $.ajax({
                type: 'POST',
                url: '/api_map/public/login?sandbox=%@'.fmt(KG.get('activeSandboxKey')),
                dataType: 'json',
                headers: KG.core_auth.createAjaxRequestHeaders(),
                contentType: 'application/json; charset=utf-8',
                context: this,
                error: function(jqXHR, textStatus, errorThrown) {
                    SC.Logger.error('Map login error: HTTP error status code: ' + jqXHR.status);
                },
                success: function(data, textStatus, jqXHR) {
                    console.log('Map login success.');
                    KG.statechart.sendAction('mapLoginSucceeded', this);
                },
                async: YES
            });
            //write a cookie for wms service.  Expires in 1 days
            $.cookie('C-Kloudgis-Authentication', KG.core_auth.get('authenticationToken'), {
                expires: 1,
                path: '/'
            });
            //clear cookie on page leave
            window.onbeforeunload = function() {
                $.cookie('C-Kloudgis-Authentication', null, {
                    expires: 1,
                    path: '/'
                });
            };
            KG.statechart.sendAction('authenticationSucceeded', this);
        } else {
            KG.statechart.sendAction('authenficationFailed', this);
        }
    },

    membershipCheck: function() {
        $.ajax({
            type: 'GET',
            url: '/api_data/protected/members/logged_member?sandbox=%@'.fmt(KG.get('activeSandboxKey')),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            headers: KG.core_auth.createAjaxRequestHeaders(),
            context: this,
            error: function(jqXHR, textStatus, errorThrown) {
                SC.Logger.error('Membership error: HTTP error status code: ' + jqXHR.status);
                KG.statechart.sendAction('membershipFailed', this);
            },
            success: function(data, textStatus, jqXHR) {
                console.log('SB Meta success.');
                this.set('membership', data);
                KG.statechart.sendAction('membershipSucceeded', this);
            },
            async: YES
        });
    },

    fetchSandboxMeta: function() {
        $.ajax({
            type: 'GET',
            url: '/api_sandbox/protected/sandboxes/%@/meta'.fmt(KG.get('activeSandboxKey')),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            headers: KG.core_auth.createAjaxRequestHeaders(),
            context: this,
            error: function(jqXHR, textStatus, errorThrown) {
                SC.Logger.error('SB Meta error: HTTP error status code: ' + jqXHR.status);
                if (KG.statechart) {
                    KG.statechart.sendAction('httpError', jqXHR.status);
                }
            },
            success: function(data, textStatus, jqXHR) {
                console.log('SB Meta success.');
                this.set('sandboxMeta', data);
				var lat = data.lat;
				var lon = data.lon;
				var zoom = data.zoom;
				if(lat && lon){
					KG.core_leaflet.setCenter(KG.LonLat.create({lon: lon, lat:lat}), zoom);
				}
            },
            async: YES
        });
    },

    metaDidChange: function() {
        console.log('Meta changed.');
        $('#active-sandbox-label span').text(this.get('sandboxMeta').name);
        this.set('isSandboxOwner', KG.core_auth.get('activeUser').id === this.get('sandboxMeta').owner)
    }.observes('sandboxMeta'),

    addMap: function() {
        var hashLoc = window.location.hash;
        var lat, lon, zoom
        if (hashLoc && hashLoc.length > 0) {
            var tokens = hashLoc.split(';');
            if (tokens.length === 3) {
                lon = parseFloat(tokens[0].substring(5));
                lat = parseFloat(tokens[1].substring(4));
                zoom = parseInt(tokens[2].substring(5));
            }
        }	
        KG.core_leaflet.addToDocument(lon, lat, zoom);
    },

    createNote: function() {
        KG.statechart.sendAction('createNoteAction');
    },

    latitudeLabel: function() {
        var pos = this.get('mousePosition');
        if (pos) {
            return 'Lat: %@'.fmt(pos.get('lat').toFixed(4));
        } else {
            return 'Lat: ?';
        }
    }.property('mousePosition'),

    longitudeLabel: function() {
        var pos = this.get('mousePosition');
        if (pos) {
            return 'Lon: %@'.fmt(pos.get('lon').toFixed(4));
        } else {
            return 'Lon: ?';
        }
    }.property('mousePosition'),

    autosize: function(element) {
        var el = $(element);
        if (el[0]) {
            el.autoResize({
                extraSpace: 20
            });
        } else {
            var self = this;
            setTimeout(function() {
                self.autosize(element)
            },
            300);
        }
    },

	destroyAutosize: function(element){
		var autoR = $(element).data('AutoResizer');
		if(autoR){
			autoR.destroy();
		}
	}
});

$(document).ready(function() {
    KG.statechart.initStatechart();
    if ($.browser.isIphone) {
		//tweaks to hide the address bar
        $('#box').addClass('mobile');
        setTimeout(function() {
            window.scrollTo(0, 1);
        },
        1000);
    }
});
