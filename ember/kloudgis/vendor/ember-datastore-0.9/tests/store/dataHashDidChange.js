// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals module ok equals same test MyApp */

var set = Ember.set, get = Ember.get;

// NOTE: The test below are based on the Data Hashes state chart.  This models
// the "did_change" event in the Store portion of the diagram.

var MyApp;

var store, child, storeKey, json;
module("Ember.Store#dataHashDidChange", {
  setup: function() {
    MyApp = {};
    store = Ember.Store.create();
    
    json = {
      string: "string",
      number: 23,
      bool:   YES
    };
    
    storeKey = Ember.Store.generateStoreKey();

    store.writeDataHash(storeKey, json, Ember.Record.READY_CLEAN);
    store.editables = null; // manually patch to setup test state
    child = store.chain();  // test multiple levels deep
    
    
    MyApp.Foo = Ember.Record.extend({
      prop1: Ember.Record.attr(String, { defaultValue: 'Default Value for prop1' }),
      prop2: Ember.Record.attr(String, { defaultValue: 'Default Value for prop2' }),
      prop3: Ember.Record.attr(String, { defaultValue: 'Default Value for prop2' })
    });
    
  },

  teardown: function() {
    window.MyApp = undefined;
  }
});

// ..........................................................
// BASIC STATE TRANSITIONS
// 


function testStateTransition(fromState, toState) {

  // verify preconditions
  equals(store.storeKeyEditState(storeKey), fromState, 'precond - storeKey edit state');
  if (store.chainedChanges) {
    ok(!store.chainedChanges.contains(storeKey), 'changedChanges should NOT include storeKey');
  }

  var oldrev = store.revisions[storeKey];
  
  // perform action
  equals(store.dataHashDidChange(storeKey), store, 'should return receiver');

  // verify results
  equals(store.storeKeyEditState(storeKey), toState, 'store key edit state is in same state');

  // verify revision
  ok(oldrev !== store.revisions[storeKey], 'revisions should change. was: %@ - now: %@'.fmt(oldrev, store.revisions[storeKey]));
  
} 

test("edit state = LOCKED", function() {
  Ember.run.begin();
  
  store.readDataHash(storeKey); // lock
  testStateTransition(Ember.Store.LOCKED, Ember.Store.LOCKED);
  
  Ember.run.end();
}) ;

test("edit state = EDITABLE", function() {
  Ember.run.begin();
  
  store.readEditableDataHash(storeKey); // make editable
  testStateTransition(Ember.Store.EDITABLE, Ember.Store.EDITABLE);
  
  Ember.run.end();
}) ;

// ..........................................................
// SPECIAL CASES
// 

test("calling with array of storeKeys will edit all store keys", function() {
  Ember.run.begin();
  
  var storeKeys = [storeKey, Ember.Store.generateStoreKey()], idx ;
  store.dataHashDidChange(storeKeys, 2000) ;
  for(idx=0;idx<storeKeys.length;idx++) {
    equals(store.revisions[storeKeys[idx]], 2000, 'storeKey at index %@ should have new revision'.fmt(idx));
  }
  
  Ember.run.end();
});

test("calling dataHashDidChange twice with different statusOnly values before flush is called should trigger a non-statusOnly flush if any of the statusOnly values were NO", function() {
  Ember.run.begin();

  // Create a phony record because that's the only way the 'hasDataChanges'
  // data structure will be used.
  var record = Ember.Record.create({ id: 514 }) ;
  var storeKey = Ember.Record.storeKeyFor(514) ;
  record = store.materializeRecord(storeKey) ;
  store.dataHashDidChange(storeKey, null, NO) ;
  store.dataHashDidChange(storeKey, null, YES) ;
  
  ok(store.recordPropertyChanges.hasDataChanges.contains(storeKey), 'recordPropertyChanges.hasDataChanges should contain the storeKey %@'.fmt(storeKey)) ;

  Ember.run.end();
});

test("calling _notifyRecordPropertyChange twice, once with a key and once without, before flush is called should invalidate all cached properties when flush is finally called", function() {
  Ember.run.begin();

  var mainStore = Ember.Store.create();
  var record    = mainStore.createRecord(MyApp.Foo, {});
  
  // Make sure the property values get cached.
  var cacheIt = get(record, 'prop1');
  cacheIt     = get(record, 'prop2');
  
  var storeKey = get(record, 'storeKey');
  
  // Send an innocuous "prop2 changed" notification, because we want to be sure
  // that if we notify about a change to one property and later also change all
  // properties, all properties get changed.  (Even if we notify about yet
  // another individual property change after that, but still before the flush.)
  mainStore._notifyRecordPropertyChange(storeKey, NO, 'prop2');
  
  var nestedStore  = mainStore.chain();
  var nestedRecord = nestedStore.materializeRecord(storeKey);
  
  // Now, set the values of prop1 and prop2 to be different for the records in
  // the nested store.
  set(nestedRecord, 'prop1', 'New value');
  
  // Now, when we commit, we'll be changing the dataHash of the main store and
  // should notify that all properties have changed.
  nestedStore.commitChanges();
  
  // Now, we'll do one more innocuous "prop3 changed" notification to ensure
  // that the eventual flush does indeed invalidate *all* property caches, and
  // not just prop2 and prop3.
  mainStore._notifyRecordPropertyChange(storeKey, NO, 'prop3');

  // Let the flush happen.
  Ember.run.end();


  // Finally, read 'prop1' from the main store's object.  It should be the new
  // value!
  equals(get(record, 'prop1'), 'New value', 'The main store’s record should return the correct value for prop1, not the stale cached version') ;
});
