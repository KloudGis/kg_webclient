KG.core_yahoo = SC.Object.create({

    title: '_searchYahoo'.loc(),

    pluginName: 'Yahoo',

    searchValue: '',

    //jeanfelixg@yahoo.ca with domain http://kloudgis.org
    appId: '7w0MZN32',

    loadRecords: function(cb_target, cb) {
        var search = this.get('searchValue');
        $.ajax({
            type: 'GET',
            url: encodeURI('http://where.yahooapis.com/geocode?q=%@&appid=%@&flags=J&count=10&locale=%@_CA'.fmt(search, this.appId, KG.lang)),
            dataType: 'json',
            context: this,
            error: function(jqXHR, textStatus, errorThrown) {
                SC.Logger.error('Yahoo error: HTTP error status code: ' + jqXHR.status);
            },
            success: function(data, textStatus, jqXHR) {
                console.log('Yahoo success.');
                var records = [];
                if (data && data.ResultSet && data.ResultSet.Results) {
                    var results = data.ResultSet.Results,
                    i;
                    for (i = 0; i < results.length; i++) {
                        var geo = {
                            x: results[i].longitude,
                            y: results[i].latitude
                        };
                        var lonLat = KG.LonLat.create({
                            lon: geo.x,
                            lat: geo.y
                        });
                        var props = ['line1', 'line2', 'line3', 'line4'];
                        var vals = [];
                        props.forEach(function(prop) {
							var val = results[i][prop];
							if(val && val.length > 0){
								vals.push(val);
							}
						});

                        records.pushObject(SC.Object.create({
                            title: vals.join(","),
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

KG.core_search.addPlugin(KG.core_yahoo);
