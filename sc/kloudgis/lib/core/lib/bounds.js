KG.Bounds = SC.Object.extend({
	
	sw: null,
	ne: null,
	
	contains: function(bounds){
		var sw = this.get('sw');
		var ne = this.get('ne');
		var sw2 = bounds.get('sw');
		var ne2 = bounds.get('ne');
		return (sw2.get('lat') >= sw.get('lat')) && (ne2.get('lat') <= ne.get('lat')) &&
						(sw2.get('lon') >= sw.get('lon')) && (ne2.get('lon') <= ne.get('lon'));
	},
	
	toString: function() {
		return "sw:%@ ne:%@".fmt(this.get('sw'), this.get('ne'));
	}
});