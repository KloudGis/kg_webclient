// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals module ok equals same test MyApp */

var set = Ember.set, get = Ember.get;

var store, storeKey, json, hash, hash2;

module("Ember.Store#createRecord", {
  setup: function() {
    
    MyRecordType = Ember.Record.extend({
      string: Ember.Record.attr(String, { defaultValue: "Untitled" }),
      number: Ember.Record.attr(Number, { defaultValue: 5 }),
      bool: Ember.Record.attr(Boolean, { defaultValue: YES })
    });

    Ember.run.begin();

    store = Ember.Store.create();
    
    json = {
      string: "string",
      number: 23,
      bool:   YES
    };
    
    storeKey = Ember.Store.generateStoreKey();

    store.writeDataHash(storeKey, json, Ember.Record.READY_CLEAN);

    Ember.run.end();
  }
});

test("create a record", function() {
  var sk;
  var rec = Ember.Record.create();
  hash = {
    guid: "1234abcd",
    string: "abcd",
    number: 1,
    bool:   NO
    };
  hash2 = {
    string: "abcd",
    number: 1,
    bool:   NO
  };

  rec = store.createRecord(Ember.Record, hash);
  ok(rec, "a record was created");
  sk=store.storeKeyFor(Ember.Record, get(rec, 'id'));
  equals(store.readDataHash(sk), hash, "data hashes are equivalent");
  equals(get(rec, 'id'), "1234abcd", "guids are the same");

  rec = store.createRecord(Ember.Record, hash2, "priKey");
  ok(rec, "a record with a custom id was created");
  sk=store.storeKeyFor(Ember.Record, "priKey");
  equals(store.readDataHash(sk), hash2, "data hashes are equivalent");
  equals(get(rec, 'id'), "priKey", "guids are the same");
  
  equals(store.changelog.length, 2, "The changelog has the following number of entries:");
  
  
});

test("Creating an empty (null) record should make the hash available", function() {
  
  store.createRecord(MyRecordType, null, 'guid8');
  var storeKey = store.storeKeyFor(MyRecordType, 'guid8');
  
  ok(store.readDataHash(storeKey), 'data hash should not be empty/undefined');
  
});
