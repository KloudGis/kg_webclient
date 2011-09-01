sc_require('lib/1_raphael')
sc_require('lib/2_g_raphael')
sc_require('lib/3_g_pie')
KG.RPieView = SC.View.extend({
	
	layerDidChange: function() {
        this.set('layerNeedsUpdate', YES);
    }.observes('layer'),

    updateLayer: function() {
        sc_super();
		var frame = this.get('frame');
        var r = new Raphael(this.get('layer'), frame.width, frame.height);      
		r.text(20,20, "Test!!");
		var min = Math.min(frame.width, frame.height);
		var pie = r.g.piechart(min, min/2, min/5, [55, 20, 13, 32, 5, 1, 2, 10], {legend: ["%%.%% – Enterprise Users", "%% IE Users"], legendpos: "west",/* href: ["http://raphaeljs.com", "http://g.raphaeljs.com"]*/});
		                pie.hover(function () {
		                    this.sector.stop();
		                    this.sector.scale(1.1, 1.1, this.cx, this.cy);
		                    if (this.label) {
		                        this.label[0].stop();
		                        this.label[0].scale(1.5);
		                        this.label[1].attr({"font-weight": 800});
		                    }
		                }, function () {
		                    this.sector.animate({scale: [1, 1, this.cx, this.cy]}, 500, "bounce");
		                    if (this.label) {
		                        this.label[0].animate({scale: 1}, 500, "bounce");
		                        this.label[1].attr({"font-weight": 400});
		                    }
		                });
					/*	pie.click(function () {
		                    this.sector.stop();
							if(this.sector.kg_scale){
								this.sector.kg_scale = NO;
								this.sector.scale(1.0, 1.0, this.cx, this.cy);
							}else{
								this.sector.kg_scale = YES;
		                    	this.sector.scale(1.5, 1.5, this.cx, this.cy);		                   
							}
		                });*/
    }
});