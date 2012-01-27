// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals module ok equals same test MyApp */

var set = Ember.set, get = Ember.get;

var store, storeKey, json;
module("Ember.Store#pushChanges", {
  setup: function() {
    Ember.run.begin();
    store = Ember.Store.create();
    
    json = {
      string: "string",
      number: 23,
      bool:   YES
    };
    
    storeKey1 = Ember.Store.generateStoreKey();
    store.writeDataHash(storeKey1, json, Ember.Record.EMPTY);

    storeKey2 = Ember.Store.generateStoreKey();
    store.writeDataHash(storeKey2, json, Ember.Record.EMPTY);

    storeKey3 = Ember.Store.generateStoreKey();
    store.writeDataHash(storeKey3, json, Ember.Record.EMPTY);

    storeKey4 = Ember.Store.generateStoreKey();
    store.writeDataHash(storeKey4, json, Ember.Record.BUSY_LOADING);

    storeKey5 = Ember.Store.generateStoreKey();
    store.writeDataHash(storeKey5, json, Ember.Record.BUSY_LOADING);

    storeKey6 = Ember.Store.generateStoreKey();
    store.writeDataHash(storeKey6, json, Ember.Record.BUSY_LOADING);
    Ember.run.end();
  }
});

test("Do a pushRetrieve and check if there is conflicts", function() {
  var res = store.pushRetrieve(Ember.Record, undefined, undefined, storeKey1);
  equals(res, storeKey1, "There is no conflict, pushRetrieve was succesful.");
  res = store.pushRetrieve(Ember.Record, undefined, undefined, storeKey4);
  ok(!res, "There is a conflict, because of the state, this is expected.");
});

test("Do a pushDestroy and check if there is conflicts", function() {
  var res = store.pushDestroy(Ember.Record, undefined, storeKey2);
  equals(res, storeKey2, "There is no conflict, pushDestroy was succesful.");
  res = store.pushRetrieve(Ember.Record, undefined, undefined, storeKey5);
  ok(!res, "There is a conflict, because of the state, this is expected.");
});

test("Issue a pushError and check if there is conflicts", function() {
  var res = store.pushError(Ember.Record, undefined, Ember.Record.NOT_FOUND_ERROR, storeKey3);
  equals(res, storeKey3, "There is no conflict, pushError was succesful.");
  res = store.pushRetrieve(Ember.Record, undefined, undefined, storeKey6);
  ok(!res, "There is a conflict, because of the state, this is expected.");
});

