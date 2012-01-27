// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals module ok equals same test MyApp */

var set = Ember.set, get = Ember.get;

var store, Application;

module("Ember.Store Error Methods", {
  setup: function() {

    Application = {};
    Application.Thing = Ember.Record.extend({
      name: Ember.Record.attr(String)
    });

    Ember.run.begin();
    store = Ember.Store.create();

    var records = [
      { guid: 1, name: 'Thing One' },
      { guid: 2, name: 'Thing Two' }
    ];

    var types = [ Application.Thing, Application.Thing ];

    store.loadRecords(types, records);
    Ember.run.end();
  },

  teardown: function() {
    store = null;
    Application = null;
  }
});

test("Verify readError() returns correct errors", function() {
  var thing1 = store.find(Application.Thing, 1);
  var storeKey = get(thing1, 'storeKey');

  Ember.run.begin();
  store.writeStatus(storeKey, Ember.Record.BUSY_LOADING);
  store.dataSourceDidError(storeKey, Ember.Record.GENERIC_ERROR);
  Ember.run.end();

  equals(store.readError(storeKey), Ember.Record.GENERIC_ERROR,
    "store.readError(storeKey) should return the correct error object");
});

test("Verify readQueryError() returns correct errors", function() {
  var q = Ember.Query.local(Application.Thing);
  var things = store.find(q);

  Ember.run.begin();
  set(things, 'status', Ember.Record.BUSY_LOADING);
  store.dataSourceDidErrorQuery(q, Ember.Record.GENERIC_ERROR);
  Ember.run.end();

  equals(store.readQueryError(q), Ember.Record.GENERIC_ERROR,
    "store.readQueryError(q) should return the correct error object");
});
