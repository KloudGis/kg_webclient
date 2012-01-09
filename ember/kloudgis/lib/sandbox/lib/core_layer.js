/**
* Core functions to manage the layers
**/
KG.core_layer = SC.Object.create({

    loadLayers: function() {
        var layers = KG.store.find(KG.LAYER_QUERY);
        KG.layersController.set('content', layers);
        layers.onReady(this, this._layersReady);
    },

    _layersReady: function(layers) {
        //FIXME: sortProperty is not yet implemented in beta3
        var ordered = layers; //layers.sortProperty('renderOrder'); 
        ordered.filterProperty('visibility', YES).filterProperty('canRender', YES).forEach(function(layer) {
            KG.core_leaflet.addWMSLayer(layer);
        });
    },

    getLayersSelection: function() {
        var layers = KG.layersController.get('content');
        if (!SC.none(layers) && layers.get('length') > 0) {
            var sel = layers.filterProperty('visibility', YES).filterProperty('isSelectable', YES);
            return sel;
        }
        return [];
    },

/* Return the main layer if there is at least one visible layer matched the featureytpe*/
    getMainWMSFor: function(featuretype) {
        var layers = KG.layersController.get('content');
        if (!SC.none(layers) && layers.get('length') > 0) {
            if (layers.filterProperty('visibility', YES).filterProperty('ft_id', featuretype.get('id')).get('length') > 0) {
                return layers.filterProperty('name', KG.get('activeSandboxKey'));
            }
        }
        return [];
    }

});
