KG.core_geonames = SC.Object.create({

    title: '_searchGeonames'.loc(),

	pluginName: 'Geonames',

    searchValue: '',

    loadRecords: function(cb_target, cb) {
        var search = this.get('searchValue');
        $.ajax({
            type: 'GET',
            url: encodeURI('http://ws.geonames.org/searchJSON?q=%@&maxRows=10'.fmt(search)),
            dataType: 'json',
            context: this,
            error: function(jqXHR, textStatus, errorThrown) {
                SC.Logger.error('Geonames error: HTTP error status code: ' + jqXHR.status);
            },
            success: function(data, textStatus, jqXHR) {
                console.log('Geonames success.');
                var records = [];
                if (data && data.geonames && data.geonames.length > 0) {
                    var results = data.geonames,
                    i;
                    for (i = 0; i < results.length; i++) {
                        var geo = {
                            x: results[i].lng,
                            y: results[i].lat
                        };
                        var lonLat = KG.LonLat.create({
                            lon: geo.x,
                            lat: geo.y
                        });
                        records.pushObject(SC.Object.create({
                            title: "%@, %@".fmt(results[i].toponymName, results[i].countryName),
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

KG.core_search.addPlugin(KG.core_geonames);
