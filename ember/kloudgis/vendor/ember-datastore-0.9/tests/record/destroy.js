// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals module ok equals same test MyApp */

var set = Ember.set, get = Ember.get;

var MyFoo = null, MyApp, callInfo ;
module("Ember.Record#destroy", {
  setup: function() {
    Ember.run.begin();
    MyApp = Ember.Object.create({
      store: Ember.Store.create()
    })  ;
  
    MyApp.Foo = Ember.Record.extend();
    MyApp.json = { 
      foo: "bar", 
      number: 123,
      bool: YES,
      array: [1,2,3] 
    };
    
    MyApp.foo = MyApp.store.createRecord(MyApp.Foo, MyApp.json);
    
    // modify store so that everytime refreshRecords() is called it updates 
    // callInfo
    callInfo = null ;
    MyApp.store.__orig = MyApp.store.destroyRecord;
    MyApp.store.destroyRecord = function(records) {
      callInfo = Array.prototype.slice.call(arguments) ; // save method call
      MyApp.store.__orig.apply(MyApp.store, arguments); 
    };
    Ember.run.end();
  },

  teardown: function() {
    MyApp = undefined;
  }
});

test("calling destroy on a newRecord will mark the record as destroyed and calls destroyRecords on the store", function() {
  equals(get(MyApp.foo, 'status'), Ember.Record.READY_NEW, 'precond - status is READY_NEW');
  Ember.run.begin();
  MyApp.foo.destroy();
  Ember.run.end();
  same(callInfo, [null, null, MyApp.foo.storeKey], 'destroyRecords() should not be called');
  
  equals(get(MyApp.foo, 'status'), Ember.Record.DESTROYED_CLEAN, 'status should be Ember.Record.DESTROYED_CLEAN');
});

test("calling destroy on existing record should call destroyRecord() on store", function() {

  // Fake it till you make it...
  MyApp.store.writeStatus(MyApp.foo.storeKey, Ember.Record.READY_CLEAN)
    .dataHashDidChange(MyApp.foo.storeKey, null, YES);
    
  equals(get(MyApp.foo, 'status'), Ember.Record.READY_CLEAN, 'precond - status is READY CLEAN');
  
  Ember.run.begin();
  MyApp.foo.destroy();
  Ember.run.end();
  
  same(callInfo, [null, null, MyApp.foo.storeKey], 'destroyRecord() should not be called');
  equals(get(MyApp.foo, 'status'), Ember.Record.DESTROYED_DIRTY, 'status should be Ember.Record.DESTROYED_DIRTY');
});

test("calling destroy on a record that is already destroyed should do nothing", function() {

  // destroy once
  Ember.run.begin();
  MyApp.foo.destroy();
  Ember.run.end();
  equals(get(MyApp.foo, 'status'), Ember.Record.DESTROYED_CLEAN, 'status should be DESTROYED_CLEAN');
  
  Ember.run.begin();
  MyApp.foo.destroy();
  Ember.run.end();
  equals(get(MyApp.foo, 'status'), Ember.Record.DESTROYED_CLEAN, 'status should be DESTROYED_CLEAN');
});

test("should return receiver", function() {
  equals(MyApp.foo.destroy(), MyApp.foo, 'should return receiver');
});

test("destroy should update status cache", function() {
  var st = get(MyApp.foo, 'status');
  ok(st !== Ember.Record.DESTROYED_CLEAN, 'precond - foo should not be destroyed');

  Ember.run.begin();
  MyApp.foo.destroy();
  equals(get(MyApp.foo, 'status'), Ember.Record.DESTROYED_CLEAN, 'status should be DESTROYED_CLEAN immediately when destroyed directly by record');
  Ember.run.end();
});


