// ==========================================================================
// Project:   KG.mapController
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals KG */

/** @class

  The active map.

  @extends SC.ObjectController
*/
KG.mapController = SC.ObjectController.create({
	
	pixelsToWorld: function(pixels){
		var center = this.getCenter();
        var centerOff = this.getCenterOffsetPixels(pixels);
        var dLat = centerOff.lat - center.lat;
        var dLon = centerOff.lon - center.lon;
        return Math.sqrt(dLat * dLat + dLon * dLon);
	},
	
	showPopup: function(lonlat, content){
		return this.get('content').showPopup(lonlat, content);
	},
	
	closePopup: function(){
		return this.get('content').closePopup();
	},
	
	closeMarkerPopup: function(marker){
	 	return this.get('content').closeMarkerPopup(marker);
	},
	
	getFatBounds: function(){
		return this.get('content').getFatBounds();
	},

    addDefaultBaseLayer:function(){
		return this.get('content').addDefaultBaseLayer();
	},
	
	addToDocument: function(div){
		return this.get('content').addToDocument(div);
	},
	
	getCenter: function(){
		return this.get('content').getCenter();
	},
	
	getCenterOffsetPixels: function(pixels){
		return this.get('content').getCenterOffsetPixels(pixels);
	},
	
	setCenter: function(lon, lat, zoom){
		return this.get('content').setCenter(lon,lat, zoom);	
	},
	
	updateSize: function(center){
		return this.get('content').updateSize(center);	
	},
	
	addLayer: function(layer){
		return this.get('content').addLayer(layer);
	},
	
	addMarker: function(marker, target, method){
		return this.get('content').addMarker(marker,target, method);
	},
	
	removeMarker: function(marker){
		return this.get('content').removeMarker(marker);
	},
	
	highlight: function(coordinates, geo_type, key){
		return this.get('content').highlight(coordinates, geo_type, key);
	},
	
	removeHighlight: function(key){
		return this.get('content').removeHighlight(key);
	},
	
	setSelectionHighlight: function(coordinates, geo_type){
		return this.get('content').setSelectionHighlight(coordinates, geo_type);
	}
});
