KG.core_osm = SC.Object.create({

    title: '_searchOSM'.loc(),

	pluginName: 'OSM',

    searchValue: '',

    loadRecords: function(cb_target, cb) {
        var search = this.get('searchValue');
        $.ajax({
            type: 'GET',
            url: encodeURI('http://nominatim.openstreetmap.org/search?q=%@&format=json&limit=10'.fmt(search)),
            dataType: 'json',
            context: this,
            error: function(jqXHR, textStatus, errorThrown) {
                SC.Logger.error('OSM error: HTTP error status code: ' + jqXHR.status);
            },
            success: function(data, textStatus, jqXHR) {
                console.log('OSM success.');
                var records = [];
                if (data && data.length > 0) {
                    var results = data,
                    i;
                    for (i = 0; i < results.length; i++) {
                        var geo = {
                            x: results[i].lon,
                            y: results[i].lat
                        };
                        var lonLat = KG.LonLat.create({
                            lon: geo.x,
                            lat: geo.y
                        });
                        records.pushObject(SC.Object.create({
                            title: "%@, %@".fmt(results[i].display_name),
                            geo: {coords: [geo], centroid:{x: geo.x, y: geo.y}, geo_type: 'Point'},
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

KG.core_search.addPlugin(KG.core_osm);