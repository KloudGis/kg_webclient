//create the namespace
KG = Ember.Application.create({
    lang: 'fr',
    activeSandboxKey: null,
    serverHost: '/',

    //set to NO for PRODUCTION
    debugMode: YES,

    enableLogger: function() {
        if (!this._oldLogger) {
            return;
        }
        window.console.log = this._oldLogger;
    },

    _oldLogger: null,

    disableLogger: function() {
        this._oldLogger = window.console.log;
        window.console.log = function() {};
    }
});

//default: Disable log is not Debug 
if (!KG.get('debugMode')) {
    KG.disableLogger();
}

$(document).ready(function() {
    KG.statechart.initStatechart();
});

