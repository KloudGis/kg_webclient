// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals module ok equals same test MyApp */

var set = Ember.set, get = Ember.get;

// test parsing of query string
var store, storeKey, rec1, rec2, rec3, rec4, rec5, MyApp, q;

module("Ember.Query comparison of records", {
  setup: function() {
    Ember.run.begin();

    // setup dummy app and store
    MyApp = Ember.Object.create({
      store: Ember.Store.create()
    });
    
    // setup a dummy model
    MyApp.Foo = Ember.Record.extend({});
    
    // load some data
    MyApp.store.loadRecords(MyApp.Foo, [
      { guid: 1, firstName: "John", lastName: "Doe", year: 1974 },
      { guid: 2, firstName: "Jane", lastName: "Doe", year: 1975 },
      { guid: 3, firstName: "Emily", lastName: "Parker", year: 1975, active: null },
      { guid: 4, firstName: "Johnny", lastName: "Cash", active: false },
      { guid: 5, firstName: "Bert", lastName: "Berthold", active: true }
    ]);
    
    rec1 = MyApp.store.find(MyApp.Foo,1);
    rec2 = MyApp.store.find(MyApp.Foo,2);
    rec3 = MyApp.store.find(MyApp.Foo,3);
    rec4 = MyApp.store.find(MyApp.Foo,4);
    rec5 = MyApp.store.find(MyApp.Foo,5);
    
    
    q = Ember.Query.create();

    Ember.run.end();
  },
  
  teardown: function() {
    // IMPORTANT: must delete so we don't screw up other unit tests.
    // cleanup after ourselves
    delete Ember.Query.comparisons.firstName;
    MyApp = undefined;
  }
});
 
 
// ..........................................................
// TESTS
// 

test("Ember.Query.comparisons", function(){
  Ember.Query.registerComparison('firstName', function(name1,name2){
    if (name1.length < name2.length) return -1;
    if (name1.length > name2.length) return 1;
    return 0;
  });
  ok(Ember.Query.comparisons['firstName'], 'comparison for firstName should be set');
  q.orderBy = "firstName";
  q.parse();
  equals(q.compare(rec2,rec3), -1, "firstName should be compared by registered comparison");
  
  q.orderBy = "lastName";
  q.parse();
  equals(q.compare(rec2,rec3), -1, "lastName should be compared by Ember.compare()");
});
