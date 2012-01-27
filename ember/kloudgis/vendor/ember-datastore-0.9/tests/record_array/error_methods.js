// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals module ok equals same test MyApp */

var set = Ember.set, get = Ember.get;

var store, Application;
module("Ember.RecordArray Error Methods", {
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
  var q = Ember.Query.local(Application.Thing);
  var things = store.find(q);

  Ember.run.begin();
  set(things, 'status', Ember.Record.BUSY_LOADING);
  store.dataSourceDidErrorQuery(q, Ember.Record.GENERIC_ERROR);
  Ember.run.end();

  ok(get(things, 'isError'), "isError on things array should be YES");

  equals(get(things, 'errorObject'), Ember.Record.GENERIC_ERROR,
    "get('errorObject') on things array should return the correct error object");
});
