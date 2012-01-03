KG.BubbleTouchView = SC.View.extend({
    touchStart: function(touch) {
        this._super(touch);
        return YES; //bubble
    },

    touchEnd: function(touch) {
        this._super(touch);
        return YES; //bubble
    }
});
