KG.pageController = Ember.Object.create({
    loginHidden: NO,
    loginPushedLeft: NO,
    loginPushedRight: NO,

    homeHidden: YES,
    homePushedLeft: NO,
    homePushedRight: YES,

    sandboxHidden: YES,
    sandboxPushedLeft: NO,
    sandboxPushedRight: YES,

    _timeout: null,
	_timeout2: null,

    setLoginActive: function() {
        clearTimeout(this._timeout);
		clearTimeout(this._timeout2);
        var self = this;
        this.set('loginHidden', NO);
        this.set('loginPushedLeft', NO);
        this.set('loginPushedRight', NO);
        this._timeout = setTimeout(function() {
            self.set('homeHidden', YES);
        },
        1500);
        this.set('homePushedLeft', NO);
        this.set('homePushedRight', YES);
        this.set('sandboxHidden', YES);
        this.set('sandboxPushedLeft', NO);
        this.set('sandboxPushedRight', YES);
    },

    setHomeActive: function() {
        clearTimeout(this._timeout);
		clearTimeout(this._timeout2);
		var self = this;
		this._timeout = setTimeout(function() {
            self.set('loginHidden', YES);
        },
        1500);
        this.set('loginPushedLeft', YES);
        this.set('loginPushedRight', NO);
        this.set('homeHidden', NO);
        this.set('homePushedLeft', NO);
        this.set('homePushedRight', NO);
		this._timeout2 = setTimeout(function() {
            self.set('sandboxHidden', YES);
        },
        1500);
        this.set('sandboxPushedLeft', NO);
        this.set('sandboxPushedRight', YES);
    },

    setSandboxActive: function() {
	    var self = this;
        clearTimeout(this._timeout);
		clearTimeout(this._timeout2);
        this.set('loginHidden', YES);
        this.set('loginPushedLeft', YES);
        this.set('loginPushedRight', NO);
		this._timeout = setTimeout(function() {
            self.set('homeHidden', YES);
        },
        1500);
        this.set('homePushedLeft', YES);
        this.set('homePushedRight', NO);
        this.set('sandboxHidden', NO);
        this.set('sandboxPushedLeft', NO);
        this.set('sandboxPushedRight', NO);
    },

});
