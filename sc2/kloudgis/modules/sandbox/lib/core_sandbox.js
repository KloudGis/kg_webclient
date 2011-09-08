/*var osmURL = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var at = 'OSM';
var layer = new L.TileLayer(osmURL, {
    maxZoom: 20,
    attribution: at
});
*/
var key = '8ccaf9c293f247d6b18a30fce375e298';

var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/'+ key +'/997/256/{z}/{x}/{y}.png',
    cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
    layer = new L.TileLayer(cloudmadeUrl, {maxZoom: 18, attribution: cloudmadeAttribution});

// initialize the map on the "map" div
var map = new L.Map('map');

// set the map view to a given center and zoom and add the OSM layer
map.setView(new L.LatLng(46, -72), 8).addLayer(layer);

// create a marker in the given location and add it to the map
var marker = new L.Marker(new L.LatLng(46, -72));
map.addLayer(marker);

// attach a given HTML content to the marker and immediately open it
marker.bindPopup("A pretty CSS3 popup.<br />Easily customizable.").openPopup();