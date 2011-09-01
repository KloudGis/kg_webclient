CoreKG.LonLat = SC.Object.extend({
	
	lon: 0,
	lat: 0,
	
	toString: function() {
		return "Lon:%@ Lat:%@".fmt(this.get('lon'), this.get('lat'));
	}
});