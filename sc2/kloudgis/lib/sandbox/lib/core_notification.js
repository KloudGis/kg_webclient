//must include jquery.atmosphere.js ext dependency
KG.core_notification = SC.Object.create({

    connectedEndpoint: null,
	callbackAdded: NO,

    listen: function() {
        var sandbox = KG.get('activeSandboxKey');
        var location = '/api_notification/%@'.fmt(sandbox);
		//close active if any to avoid multiple open stream
		$.atmosphere.close();
        $.atmosphere.subscribe(location, !this.callbackAdded ? this.atmosphereCallback: null, $.atmosphere.request = {
            transport: 'streaming',
			//enable websocket when tomcat (server side) supports it
			//transport: 'websocket',
			headers: KG.core_auth.createAjaxRequestHeaders()
        });
		this.callbackAdded = YES;
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
				try{
					var oData = JSON.parse(data);
					var messData = KG.Message.create(oData);
					console.log('Message received');
					console.log(messData);
				}catch(e){
					console.log('NOTIFICATION: ' + e);
				}	
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
