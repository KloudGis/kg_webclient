//must include jquery.atmosphere.js ext dependency
KG.core_notification = SC.Object.create({

    connectedEndpoint: null,
    callbackAdded: NO,
    postCallbackAdded: NO,

    listen: function() {
        var sandbox = KG.get('activeSandboxKey');
        var location = KG.get('serverHost') + 'api_notification/general?sandbox=%@'.fmt(sandbox);
        //close active if any to avoid multiple open stream
        this.stopListen();
        $.atmosphere.subscribe(location, !this.callbackAdded ? this.atmosphereCallback: null, $.atmosphere.request = {
            transport: 'streaming',
            //enable websocket when tomcat (server side) supports it
            //	transport: 'websocket',
            headers: KG.core_auth.createAjaxRequestHeaders()
        });
        this.callbackAdded = YES;
        this.connectedEndpoint = $.atmosphere.response;
        //renew the listen after 8 hours
        this.timerId = setTimeout(function() {
            KG.core_notification.listen();
        },
        8 * 60 * 60 * 1000);
    },

    stopListen: function() {
        $.atmosphere.close();
        if (this.timerId) {
            clearTimeout(this.timerId);
            this.timerId = null;
        }
    },

    atmosphereCallback: function(response) {
        // Websocket events.
        $.atmosphere.log('info', ["response.state: " + response.state]);
        $.atmosphere.log('info', ["response.transport: " + response.transport]);
        $.atmosphere.log('info', ["response.status: " + response.status]);

        detectedTransport = response.transport;
        if (response.transport != 'polling' && response.state != 'connected' && response.state != 'closed' && response.state != 'messagePublished') {
            $.atmosphere.log('info', ["response.responseBody: " + response.responseBody]);
            if (response.status == 200) {
                var data = response.responseBody;
                if (!data || data.charAt(0) !== '{') {
                    console.log('Message ignored - Must be JSON format');
                } else {
                    try {
                        var oData = JSON.parse(data);
                        var messageData = KG.Message.create(oData);
                        if (messageData.get('author') !== KG.core_auth.get('activeUser').user) {
							
                            if (messageData.get('type') === 'text') {				//text message (Chat)
                                KG.notificationsController.insertAt(0, messageData);
                            } else if (messageData.get('type') === 'note') {		//message related to Note
                                KG.core_note.refreshMarkers(YES);
                            } else if (messageData.get('type') === 'note_comment') {//message related to Note Comment
                                var aNote = KG.activeNoteController.get('content');
                                if (!SC.none(aNote) && aNote.get('id') === messageData.getPath('content.note_id')) {
									//reload the comments if the change is for the active note
                                    KG.core_note.fetchComments(YES);
                                }
                            } else if (messageData.get('type') === 'bookmark') {	//message related to Bookmark
								if(messageData.getPath('content.modif_type') === 'delete'){
									KG.store.unloadRecord(KG.Bookmark, messageData.getPath('content.id'));
								}
                                KG.statechart.sendAction('refreshBookmarkAction');
                            }
                        } else {//message from current user: Confirmation feedback
                            KG.statechart.sendAction('notificationSent', messageData);
                        }
                    } catch(e) {
                        console.log('NOTIFICATION: ' + e);
                    }
                }
            }
        }
    },

    postMessage: function(
    /*KG.Message*/
    message) {
        if (!this.connectedEndpoint) {
            return NO;
        }
        var sandbox = KG.get('activeSandboxKey');
        var location = KG.get('serverHost') + 'api_notification/general?sandbox=%@'.fmt(sandbox);
        this.connectedEndpoint.push(location, null, $.atmosphere.request = {
            data: JSON.stringify(message.toDataHash()),
            headers: KG.core_auth.createAjaxRequestHeaders()
        });

        return YES;
    }

});
