/**
* Core functions for the Sandbox page
**/
KG.core_sandbox = SC.Object.create({

    sandboxMeta: {},
    membership: null,
    isSandboxOwner: NO,

	sandboxLabel: '',
    mousePosition: null,
	mapAdded: NO,
	
	cleanUp:function(){
		this.set('sandboxMeta', {});
		this.set('membership', null);
		this.set('isSandboxOwner', NO);
		this.set('sandboxLabel', '');
		this.set('mousePosition', null);
		
		KG.store.unloadRecords(KG.FeatureType);
		KG.store.unloadRecords(KG.AttrType);
		KG.store.unloadRecords(KG.Bookmark);
		KG.store.unloadRecords(KG.Feature);	
		KG.core_layer.cleanUp();
		KG.store.unloadRecords(KG.Layer);
		KG.core_note.removeAllMarkers();
		KG.store.unloadRecords(KG.Note);
		KG.store.unloadRecords(KG.NoteMarker);
		this.setCenter(null,null);
		//FIXME: Use of a state to manage the popup ?
		KG.activeUserController.set('activePopup', NO);
		
		this._clearRecordArray(KG.bookmarksController.get('content'));
		this._clearRecordArray(KG.layersController.get('content'));
		this._clearRecordArray(KG.paletteController.get('content'));
		this._clearRecordArray(KG.searchController.get('content'));
	},
	
	_clearRecordArray: function(rarray){
		if(!Ember.none(rarray) && rarray.destroy){
			rarray.destroy();
		}
	},

    setCenter: function(lonLat, zoom) {
		if(!lonLat){
			window.location.hash=''
		}else{
        	window.location.hash = 'sb:%@;lon:%@;lat:%@;zoom:%@'.fmt(KG.get('activeSandboxKey'), lonLat.get('lon').toFixed(4), lonLat.get('lat').toFixed(4), zoom);
		}
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
                url: KG.get('serverHost') + 'api_map/public/login?sandbox=%@'.fmt(KG.get('activeSandboxKey')),
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
            KG.statechart.sendAction('authenticationSucceeded', this);
        } else {
            KG.statechart.sendAction('authenficationFailed', this);
        }
    },

    membershipCheck: function() {
        $.ajax({
            type: 'GET',
            url: KG.get('serverHost') + 'api_data/protected/members/logged_member?sandbox=%@'.fmt(KG.get('activeSandboxKey')),
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
            url: KG.get('serverHost') + 'api_sandbox/protected/sandboxes/%@/meta'.fmt(KG.get('activeSandboxKey')),
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
                var hash = this.extractHashValues();
                if (!hash['lon']) {
                    if (lat && lon) {
                        KG.core_leaflet.setCenter(KG.LonLat.create({
                            lon: lon,
                            lat: lat
                        }), zoom);
                    }
                }
            },
            async: YES
        });
    },

    metaDidChange: function() {
        console.log('Meta changed.');
        KG.core_sandbox.set('sandboxLabel', this.get('sandboxMeta').name);
        this.set('isSandboxOwner', KG.core_auth.get('activeUser').id === this.get('sandboxMeta').owner)
    }.observes('sandboxMeta'),

    extractHashValues: function() {
        var hashLoc = window.location.hash;
        if (hashLoc && hashLoc.length > 0) {
            var tokens = hashLoc.split(';');
            if (tokens.length === 4) {
                return {
                    lon: parseFloat(tokens[1].substring(4)),
                    lat: parseFloat(tokens[2].substring(4)),
                    zoom: parseInt(tokens[3].substring(5))
                }
            }
        }
        return {};
    },

    addMap: function() {
        var hash = this.extractHashValues();
		if(this.get('mapAdded')){
			if(hash.lon && hash.lat){
				KG.core_leaflet.setCenter(KG.LonLat.create({lon:hash.lon, lat:hash.lat}), hash.zoom);
			}
		}else{
			this.set('mapAdded', YES);
        	KG.core_leaflet.addToDocument(hash.lon, hash.lat, hash.zoom);	
		}
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

    autosize: function(element, options) {
        if (!options) {
            options = {
                extraSpace: 20
            };
        }
        var el = $(element);
        if (el[0]) {
            el.autoResize(options);
        } else {
            setTimeout(function() {
                var el = $(element);
                if (el[0]) {
                    el.autoResize(options);
                }
            },
            300);
        }
    },

    destroyAutosize: function(element) {
        var autoR = $(element).data('AutoResizer');
        if (autoR) {
            autoR.destroy();
        }
    },

    hasWriteAccess: function() {
		var member = this.get('membership');
		if(!Ember.none(member)){
        	return member.access_type === 'owner' || member.access_type === 'write';
		}
		return NO;
    }.property('membership')
});