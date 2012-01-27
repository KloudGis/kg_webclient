// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals module ok equals same test MyApp */

var set = Ember.set, get = Ember.get;

// test core array-mapping methods for RecordArray
var store, storeKey, json, rec, storeKeys, recs;
module("Ember.RecordArray core methods", {
  setup: function() {
    // setup dummy store
    store = Ember.Store.create();
    storeKey = Ember.Record.storeKeyFor('foo');
    json = {  guid: "foo", foo: "bar" };
    store.writeDataHash(storeKey, json, Ember.Record.READY_CLEAN); 
    
    
    // get record
    rec = store.materializeRecord(storeKey);
    equals(get(rec, 'foo'), 'bar', 'record should have json');
    
    // get record array.
    storeKeys = [storeKey];
    recs = Ember.RecordArray.create({ store: store, storeKeys: storeKeys });
  }
});

test("initial status", function() {
  equals(get(recs, 'status'), Ember.Record.EMPTY, 'status should be Ember.Record.EMPTY');
});

// ..........................................................
// LENGTH
// 

test("should pass through length", function() {
  equals(get(recs, 'length'), storeKeys.length, 'rec should pass through length');  
});

test("changing storeKeys length should change length of rec array also", function() {

  var oldlen = get(recs, 'length');
  
  storeKeys.pushObject(Ember.Store.generateStoreKey()); // change length
  
  ok(storeKeys.length > oldlen, 'precond - storeKeys.length should have changed');
  equals(get(recs, 'length'), storeKeys.length, 'rec should pass through length');    
});

// ..........................................................
// objectAt
// 

test("should materialize record for object", function() {
  equals(storeKeys[0], storeKey, 'precond - storeKeys[0] should be storeKey');
  equals(recs.objectAt(0), rec, 'recs.objectAt(0) should materialize record');
});

test("reading past end of array length should return undefined", function() {
  equals(recs.objectAt(2000), undefined, 'recs.objectAt(2000) should be undeinfed');
});

test("modifying the underlying storeKey should change the returned materialized record", function() {
  // read record once to make it materialized
  equals(recs.objectAt(0), rec, 'recs.objectAt(0) should materialize record');  
  
  // create a new record.
  Ember.run.begin();
  var rec2 = store.createRecord(Ember.Record, { foo: "rec2" });
  Ember.run.end();

  var storeKey2 = get(rec2, 'storeKey');
  
  // add to beginning of storeKey array
  storeKeys.unshiftObject(storeKey2);
  equals(get(recs, 'length'), 2, 'should now have length of 2');
  equals(recs.objectAt(0), rec2, 'objectAt(0) should return new record');
  equals(recs.objectAt(1), rec, 'objectAt(1) should return old record');
});

test("reading a record not loaded in store should trigger retrieveRecord", function() {
  var callCount = 0;

  // patch up store to record a call and to make it look like data is not 
  // loaded.
  store.removeDataHash(storeKey, Ember.Record.EMPTY);
  store.retrieveRecord = function() { callCount++; };
  
  equals(store.peekStatus(storeKeys.objectAt(0)), Ember.Record.EMPTY, 'precond - storeKey must not be loaded');
  
  var rec = recs.objectAt(0);
  equals(callCount, 1, 'store.retrieveRecord() should have been called');
});

// ..........................................................
// replace()
// 

test("adding a record to the record array should pass through storeKeys", function() {
  // read record once to make it materialized
  equals(recs.objectAt(0), rec, 'recs.objectAt(0) should materialize record');  
  
  // create a new record.
  Ember.run.begin();
  var rec2 = store.createRecord(Ember.Record, { foo: "rec2" });
  Ember.run.end();
  
  var storeKey2 = get(rec2, 'storeKey');
  
  // add record to beginning of record array
  recs.unshiftObject(rec2);
  
  // verify record array
  equals(get(recs, 'length'), 2, 'should now have length of 2');
  equals(recs.objectAt(0), rec2, 'recs.objectAt(0) should return new record');
  equals(recs.objectAt(1), rec, 'recs.objectAt(1) should return old record');
  
  // verify storeKeys
  equals(storeKeys.objectAt(0), storeKey2, 'storeKeys[0] should return new storeKey');
  equals(storeKeys.objectAt(1), storeKey, 'storeKeys[1] should return old storeKey');
});

// ..........................................................
// Property Observing
// 

test("changing the underlying storeKeys should notify observers of records", function() {

  // setup observer
  var obj = Ember.Object.create({
    cnt: 0,
    observer: function() { this.cnt++; }
  });
  Ember.addObserver(recs, '[]', obj, obj.observer); 
  
  // now modify storeKeys
  storeKeys.pushObject(Ember.Store.generateStoreKey());
  equals(obj.cnt, 1, 'observer should have fired after changing storeKeys');
});

test("swapping storeKey array should change recordArray and observers", function() {

  // setup alternate storeKeys
  Ember.run.begin();
  var rec2 = store.createRecord(Ember.Record, { foo: "rec2" });
  Ember.run.end();
  
  var storeKey2 = get(rec2, 'storeKey');
  var storeKeys2 = [storeKey2];

  // setup observer
  var obj = Ember.Object.create({
    cnt: 0,
    observer: function() { this.cnt++; }
  });
  Ember.addObserver(recs, '[]', obj, obj.observer); 
  
  // read record once to make it materialized
  equals(recs.objectAt(0), rec, 'recs.objectAt(0) should materialize record');  
  
  // now swap storeKeys
  obj.cnt = 0 ;
  set(recs, 'storeKeys', storeKeys2);
  
  // verify observer fired and record changed
  equals(obj.cnt, 1, 'observer should have fired after swap');
  equals(recs.objectAt(0), rec2, 'recs.objectAt(0) should return new rec');
  
  // modify storeKey2, make sure observer fires and content changes
  obj.cnt = 0;
  storeKeys2.unshiftObject(storeKey);
  equals(obj.cnt, 1, 'observer should have fired after edit');
  equals(get(recs, 'length'), 2, 'should reflect new length');
  equals(recs.objectAt(0), rec, 'recs.objectAt(0) should return pushed rec');  

});
