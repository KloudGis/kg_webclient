// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals module ok equals same test MyApp */

var set = Ember.set, get = Ember.get;

var MyApp, dataSource;
module("Ember.Record core methods", {
  setup: function() {
    dataSource = Ember.DataSource.create({ 
      
      gotParams: NO,
      wasCommitted: NO,
      
      createRecord: function(store, storeKey, params) {
        this.wasCommitted = YES;
        this.gotParams = params && params['param1'] ? YES: NO;
      }});
    
    MyApp = Ember.Object.create({
      store: Ember.Store.create().from(dataSource)
    })  ;
  
    MyApp.Foo = Ember.Record.extend({});
    MyApp.json = { 
      foo: "bar", 
      number: 123,
      bool: YES,
      array: [1,2,3],
      guid: 1
    };
    
    Ember.run.begin();
    MyApp.foo = MyApp.store.createRecord(MyApp.Foo, MyApp.json);
    Ember.run.end();
    
  },

  teardown: function() {
    MyApp = undefined;
  }
});

test("statusString", function() {
  equals(MyApp.foo.statusString(), 'READY_NEW', 'status string should be READY_NEW');
});

test("Can commitRecord() specific Ember.Record instance", function() {
  
  set(MyApp.foo, 'foo', 'foobar');
  
  // commit the new record
  MyApp.foo.commitRecord({ param1: 'value1' });
  
  equals(dataSource.wasCommitted, YES, 'Record was committed');
  equals(dataSource.gotParams, YES, 'Params were properly passed through commitRecord');
  
});
