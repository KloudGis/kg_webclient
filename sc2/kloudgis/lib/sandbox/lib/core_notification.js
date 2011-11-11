//must include jquery.atmosphere.js ext dependency
KG.core_notification = SC.Object.create({

    connectedEndpoint: null,

    listen: function() {
        var sandbox = KG.get('activeSandboxKey');
        var location = '/api_notification/%@'.fmt(sandbox);
        $.atmosphere.subscribe(location, this.atmosphereCallback, $.atmosphere.request = {
            transport: 'streaming',
			headers: KG.core_auth.createAjaxRequestHeaders()
        });
        this.connectedEndpoint = $.atmosphere.response;
    },

    atmosphereCallback: function(response) {
        // Websocket events.
        $.atmosphere.log('info', ["response.state: " + response.state]);
        $.atmosphere.log('info', ["response.transport: " + response.transport]);
        $.atmosphere.log('info', ["response.status: " + response.status]);

        detectedTransport = response.transport;
        if (response.transport != 'polling' && response.state != 'connected' && response.state != 'closed') {
            $.atmosphere.log('info', ["response.responseBody: " + response.responseBody]);
            if (response.status == 200) {
                var data = response.responseBody;
				var oData = JSON.parse(data);
				var messData = KG.Message.create(oData);
				console.log(messData);
            }
        }
    },

	postMessage: function(/*KG.Message*/message){
		if(!this.connectedEndpoint){
			return NO;
		}
		var sandbox = KG.get('activeSandboxKey');
        var location = '/api_notification/%@'.fmt(sandbox);
		this.connectedEndpoint.push(location, null, $.atmosphere.request = {data: JSON.stringify(message.toDatahash()), headers: KG.core_auth.createAjaxRequestHeaders()});
	}
});
