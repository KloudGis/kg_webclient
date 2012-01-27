// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals module test ok equals same */

var set = Ember.set, get = Ember.get;

var Mail;
module("Sample Model from a webmail app", { 
  setup: function() {

    // namespace
    Mail = Ember.Object.create({
      store: Ember.Store.create()
    });

    // Messages are stored in mailboxes.
    Mail.Mailbox = Ember.Record.extend({

      name:    Ember.Record.attr(String, {
        isRequired: YES
      }),

      // here is the mailbox type.  must be one of INBOX, TRASH, OTHER
      mailbox: Ember.Record.attr(String, {
        isRequired: YES,
        only: 'INBOX TRASH OTHER'.w()
      }),
      
      // this is the sortKey that should be used to order the mailbox.
      sortKey: Ember.Record.attr(String, {
        isRequired: YES,
        only: 'subject date from to'.w()
      }),
      
      // load the list of messages.  We use the mailbox guid to load the 
      // messages.  Messages use a foreign key to move the message around.
      // an edit should cause this fetched property to reload.
      //
      // when you get messages, it will fetch "mailboxMessages" from the 
      // owner store, passing the receiver as the param unless you implement
      // the mailboxMessageParams property.
      messages: Ember.Record.fetch('Mail.Message')
    });
    
    // A message has a subject, date, sender, mailboxes, and messageDetail
    // which is a to-one relationship.  mailboxes is kept as an array of 
    // guids.
    Mail.Message = Ember.Record.extend({

      date:        Ember.Record.attr(Date, { isRequired: YES }),
      
      mailboxes:   Ember.Record.toMany('Mail.Mailbox', {
        inverse: 'messages',
        isMaster: YES,
        minimum: 1 // you cannot have less than one mailbox.
      }),
      
      // describe the message detail.
      messageDetail: Ember.Record.toOne('Mail.MessageDetail', {
        inverse: "message", // MessageDetail.message should == this.primaryKey
        isDependent: YES 
      }),

      // access the named property through another property.
      body:    Ember.Record.through('messageDetail'),
      cc:      Ember.Record.through('messageDetail'),
      bcc:     Ember.Record.through('messageDetail'),
      subject: Ember.Record.through('messageDetail')
    });
    
    Mail.Contact = Ember.Record.extend({
      firstName: Ember.Record.attr(String),
      lastName:  Ember.Record.attr(String),
      email:     Ember.Record.attr(String)
    });
    
    // define server.  RestServer knows how to automatically save records to 
    // the server.  You need to define your fetch requests here though.
    Mail.server = Ember.RestServer.create({
      
      // fetch request for mailboxes.
      fetchMailboxes: function(params) {
        return this.fetchRequest('/ma/mailboxes?alt=json') ;
      }
    });

  }
});

