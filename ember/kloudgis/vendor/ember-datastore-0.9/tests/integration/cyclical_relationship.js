// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals module test ok equals same AB */

var set = Ember.set, get = Ember.get;

module("Cyclical relationships", { 
  setup: function() {

    // define the application space
    window.AB = Ember.Object.create({
      store: Ember.Store.create().from(Ember.Record.fixtures)
    }); 

    // ..........................................................
    // MODEL
    // 
    
    // Describes a single contact
    AB.Contact = Ember.Record.extend({
      name: Ember.Record.attr(String),
      group: Ember.Record.toOne('AB.Group'),
      isFavorite: Ember.Record.attr(Boolean)
    });
    
    AB.Group = Ember.Record.extend({
      name: Ember.Record.attr(String),
      
      // dynamically discover contacts for a group using a foreign key
      contacts: function() {
        var q = Ember.Query.local(AB.Contact, "group = {record}", {
          record: this
        });  
        return get(this, 'store').find(q);
      }.property().cacheable(),
      
      // discover favorite contacts only
      favoriteContacts: function() {
        return get(this, 'contacts').filterProperty('isFavorite', YES);
      }.property('contacts.[]').cacheable()
      
    });
    
    AB.Group.FIXTURES = [
      { guid: 100, name: "G1" },
      { guid: 101, name: "G2" }
    ];

    AB.Contact.FIXTURES = [
      { guid: 1,
        name: "G1-Fav1",
        group: 100,
        isFavorite: YES },

      { guid: 2,
        name: "G1-Fav2",
        group: 100,
        isFavorite: YES },

      { guid: 3,
        name: "G1-Norm1",
        group: 100,
        isFavorite: NO },

      { guid: 4,
        name: "G2-Fav1",
        group: 101,
        isFavorite: YES },

      { guid: 5,
        name: "G1-Norm1",
        group: 101,
        isFavorite: NO }
    ];
    
    
    Ember.run.begin();
    
  },
  
  teardown: function() {
    Ember.run.end(); 
    AB = null;
  }
});

test("getting all contacts in a group", function() {
  var group  = AB.store.find(AB.Group, 100);
  var expected = AB.store.find(AB.Contact).filterProperty('group', group);
  same(get(group, 'contacts').toArray(), expected, 'contacts');
});

test("finding favoriteContacts", function() {
  var group  = AB.store.find(AB.Group, 100);
  var expected = AB.store.find(AB.Contact)
    .filterProperty('group', group)
    .filterProperty('isFavorite', YES);
    
  same(get(group, 'favoriteContacts'), expected, 'contacts');
  
  var c = AB.store.find(AB.Contact, 4) ;
  set(c, 'group', group); // move to group...
  Ember.run.end();
  Ember.run.begin();
  
  expected.push(c);
  same(get(group, 'favoriteContacts'), expected, 'favoriteContacts after adding extra');
  
});


