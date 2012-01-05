KG.core_palette = Ember.Object.create({
	//palette view
	_view: null,
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