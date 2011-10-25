/**
* A position in Longitude/Latitude. 
**/
KG.LonLat = SC.Object.extend({
	lon:null,
	lat:null,
	
	distance: function(lonLat){
		var lon1 = this.get('lon'), lat1 = this.get('lat'), lon2 = lonLat.get('lon'), lat2 = lonLat.get('lat');
		var x = (lon2-lon1);
		var y = (lat2-lat1);
		var d = Math.sqrt(x*x + y*y);
		return d;
	},
	
	distanceKm: function(lonLat){
		var lon1 = this.get('lon'), lat1 = this.get('lat'), lon2 = lonLat.get('lon'), lat2 = lonLat.get('lat');
		var R = 6371; // km
		var dLat = this.toRad(lat2-lat1);
		var dLon = this.toRad(lon2-lon1);
		var lat1 = this.toRad(lat1);
		var lat2 = this.toRad(lat2);

		var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		var d = R * c;
		return d;
	},
	
	toRad: function(Value) {
	    /** Converts numeric degrees to radians */
	    return Value * Math.PI / 180;
	}
});