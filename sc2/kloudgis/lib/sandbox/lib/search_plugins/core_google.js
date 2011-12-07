KG.core_google = SC.Object.create({

    title: "_searchGoogle".loc(),

	pluginName: 'Google',
	
    searchValue: '',

    loadRecords: function(cb_target, cb) {
        var search = this.get('searchValue');
        $.ajax({
            type: 'GET',
            url: encodeURI('/maps/api/geocode/json?address=%@&sensor=true'.fmt(search)),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            context: this,
            error: function(jqXHR, textStatus, errorThrown) {
                SC.Logger.error('Google error: HTTP error status code: ' + jqXHR.status);
            },
            success: function(data, textStatus, jqXHR) {
                console.log('Google success.');
				var records = [];
                if (data && data.results && data.results.length > 0) {
                    var results = data.results,
                    i;
                    for (i = 0; i < results.length; i++) {
                        var geo = {
                            x: results[i].geometry.location.lng,
                            y: results[i].geometry.location.lat
                        };
                        var lonLat = KG.LonLat.create({
                            lon: geo.x,
                            lat: geo.y
                        });
                        records.pushObject(SC.Object.create({
                            title: results[i].formatted_address,
                            coords: [geo],
                            center: lonLat,
                            hasCreateNote: YES
                        }));
                    }                
                }
				cb.call(cb_target, records);
            },
            async: YES
        });
    },
});

KG.core_search.addPlugin(KG.core_google);
