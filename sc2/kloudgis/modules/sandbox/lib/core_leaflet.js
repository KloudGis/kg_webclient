KG.core_leaflet = SC.Object.create({

    map: null,
    popup: null,

    addToDocument: function() {
        var key = '8ccaf9c293f247d6b18a30fce375e298';
        var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/' + key + '/997/256/{z}/{x}/{y}.png',
        cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
        layer = new L.TileLayer(cloudmadeUrl, {
            maxZoom: 18,
            attribution: cloudmadeAttribution
        });

        // initialize the map on the "map" div
        var map = new L.Map('map');
        map.setView(new L.LatLng(46, -72), 8).addLayer(layer);
        this.map = map;
        this.popup = new L.Popup();
        this.map.on('zoomend', this.onZoom, this);
        this.map.on('moveend', this.onMove, this);
        this.map.on('click', this.onClick, this);
    },

    onZoom: function(e) {
        console.log('zoom changed');
    },

    onMove: function(e) {
        console.log('map moved');
    },

    onClick: function(e) {
        console.log('map clicked');
    }

});

/*var osmURL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var at = 'OSM';
var layer = new L.TileLayer(osmURL, {
    maxZoom: 20,
    attribution: at
});
*/

