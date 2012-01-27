// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals module ok equals same test MyApp */

var set = Ember.set, get = Ember.get;

var store, Application;
module("Ember.Record Error Methods", {
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

test("Verify error methods behave correctly", function() {
  var thing1 = store.find(Application.Thing, 1);
  var storeKey = get(thing1, 'storeKey');

  var thing2 = store.find(Application.Thing, 2);

  Ember.run.begin();
  store.writeStatus(storeKey, Ember.Record.BUSY_LOADING);
  store.dataSourceDidError(storeKey, Ember.Record.GENERIC_ERROR);
  Ember.run.end();

  ok(get(thing1, 'isError'), "isError on thing1 should be YES");
  ok(!get(thing2, 'isError'), "isError on thing2 should be NO");

  equals(get(thing1, 'errorObject'), Ember.Record.GENERIC_ERROR,
    "get('errorObject') on thing1 should return the correct error object");

  equals(get(thing2, 'errorObject'), null,
    "get('errorObject') on thing2 should return null");
});
