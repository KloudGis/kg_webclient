KG.core_palette = Ember.Object.create({
	//palette view
	_view: null,
	_paletteMarker: null,
	
	createFeature: function(paletteItem){
		//wipe previous marker, if any
		this.cancelCreateFeature();
		var center = KG.core_leaflet.getCenter();
		var marker = Ember.Object.create();
		this._paletteMarker = marker;
		var options = {
            title: paletteItem.get('title'),
            animated: YES,
            iconPath: 'resources/images/palette_marker.png',
            draggable: YES,
            popupContent: "_moveFeature".loc(),
            openPopup: YES,
            dragendTarget: this,
            dragendCb: this.markerDragged,
            injectGetNativePositionFunction: YES
        };
		KG.core_leaflet.addMarker(marker, center.get('lon'), center.get('lat'), options);
		KG.paletteController.set('isDirty', YES);
	},
	
	cancelCreateFeature: function(){
		if(!Ember.none(this._paletteMarker)){
			KG.core_leaflet.removeMarker(this._paletteMarker);
			this._paletteMarker = null;
		}
		KG.paletteController.set('isDirty', NO);
	},
	
	markerDragged: function(marker, lon, lat){
		console.log('dragged!');
	}
});

//lazzy creation too speed up app launch
$(document).ready(function() {
    setTimeout(function() {
        KG.core_palette._view = Ember.View.create({
            templateName: 'palette'
        });
        KG.core_palette._view.append();
    },
    1000);
});