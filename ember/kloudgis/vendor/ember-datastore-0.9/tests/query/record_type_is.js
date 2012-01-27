// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals module ok equals same test MyApp */

var set = Ember.set, get = Ember.get;

// test parsing of query string
var rec, q;
module("Ember.Query comparison of record types", {
  setup: function() {
    Ember.run.begin();

    // setup dummy app and store
    window.MyApp = Ember.Object.create({
      store: Ember.Store.create()
    });
    
    // setup a dummy model
    window.MyApp.Foo = Ember.Record.extend({});
    
    // load some data
    window.MyApp.store.loadRecords(window.MyApp.Foo, [
      { guid: 1, firstName: "John", lastName: "Doe" }
    ]);
    
    rec = window.MyApp.store.find(window.MyApp.Foo,1);
    
    q = Ember.Query.create();

    Ember.run.end();
  },

  teardown: function() {
    window.MyApp = undefined;
  }
});


  
test("should handle record types", function() {
  
  q.conditions = "TYPE_IS 'MyApp.Foo'";
  q.parse();
  equals(Ember.Store.recordTypeFor(rec.storeKey), Ember.getPath('MyApp.Foo'), 'record type should be MyApp.Foo');
  ok(q.contains(rec), 'record with proper type should match');
  
  q.conditions = "TYPE_IS 'MyApp.Baz'";
  q.parse();
  ok(!q.contains(rec), 'record with wrong type should not match');
});
