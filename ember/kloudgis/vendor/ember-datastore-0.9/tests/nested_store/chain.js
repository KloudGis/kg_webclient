// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals module ok equals same test MyApp */

var set = Ember.set, get = Ember.get;

// This file tests the initial state of the store when it is first created
// either independently or as a chained store.

var Rec = Ember.Record.extend({
  
  title: Ember.Record.attr(String),
  
  fired: NO,
  
  reset: function() { 
    this.fired = NO;
  },
  
  titleDidChange: function() {
    this.fired = YES;
  }.observes('title')
    
});

// ..........................................................
// Ember.Store#chain - init
// 
module("Ember.Store#chain - init");

test("initial setup for chained store", function() {
  var parent = Ember.Store.create();
  var store  = parent.chain();
  
  ok(store !== parent, 'chain should return new child store');
  
  equals(get(store, 'parentStore'), parent, 'should have parentStore');
  
  equals(Ember.typeOf(store.dataHashes), 'object', 'should have dataHashes');
  parent.dataHashes.foo = 'bar';
  equals(store.dataHashes.foo, 'bar', 'dataHashes should inherit from parent');
    
  equals(Ember.typeOf(store.revisions), 'object', 'should have revisions');
  parent.revisions.foo = 'bar';
  equals(store.revisions.foo, 'bar', 'revisions should inherit from parent');

  equals(Ember.typeOf(store.statuses), 'object', 'should have statuses');
  parent.statuses.foo = 'bar';
  equals(store.statuses.foo, 'bar', 'statuses should inherit from parent');
  
  ok(!store.locks, 'should not have locks');
  ok(!store.chainedChanges, 'should not have chainedChanges');
  ok(!store.editables, 'should not have editables');
});

test("allow for custom subclasses of Ember.NestedStore", function() {
  var parent = Ember.Store.create();
  
  // We should get an exception if we specify a "subclass" that's not a class
  raises(function() {
    parent.chain({}, "I am not a class");
  }, Error, 'we should get an exception if we specify a subclass that\'s not a class');
  
  // We should get an exception if we specify a class that's not a subclass of
  // Ember.NestedStore
  raises(function() {
    parent.chain({}, Ember.Store);
  }, Error, 'we should get an exception if we specify a subclass that is not a subclass of Ember.NestedStore');
  
  
  // Our specified (proper!) subclass should be respected.
  var MyNestedStoreSubclass = Ember.NestedStore.extend();
  var nested = parent.chain({}, MyNestedStoreSubclass);
  ok(nested instanceof MyNestedStoreSubclass, 'our nested store should be the Ember.NestedStore subclass we specified');
}); 


// ..........................................................
// SPECIAL CASES
// 

test("chained store changes should propagate reliably", function() {
  var parent = Ember.Store.create(), rec, store, rec2;

  Ember.run(function() {
    parent.loadRecords(Rec, [{ title: "foo", guid: 1 }]);
  });
  
  rec = parent.find(Rec, 1);
  ok(rec && get(rec, 'title')==='foo', 'precond - base store should have record');

  // run several times to make sure this works reliably when used several 
  // times in the same app
  
  // trial 1
  Ember.run.begin();
  store = parent.chain();
  rec2  = store.find(Rec, 1);
  ok(rec2 && get(rec2, 'title')==='foo', 'chain store should have record');
  
  rec.reset();
  set(rec2, 'title', 'bar');
  Ember.run.end();
  
  equals(get(rec2, 'title'), 'bar', 'chained rec.title should changed');
  equals(get(rec, 'title'), 'foo', 'original rec.title should NOT change');
  equals(get(store, 'hasChanges'), YES, 'chained store.hasChanges');
  equals(rec.fired, NO, 'original rec.title should not have notified');
  
  Ember.run.begin();
  rec.reset();
  store.commitChanges();
  store.destroy();
  Ember.run.end();

  equals(get(rec, 'title'), 'bar', 'original rec.title should change');
  equals(rec.fired, YES, 'original rec.title should have notified');  


  // trial 2
  Ember.run.begin();
  store = parent.chain();
  rec2  = store.find(Rec, 1);
  ok(rec2 && get(rec2, 'title')==='bar', 'chain store should have record');
  
  rec.reset();
  set(rec2, 'title', 'baz');
  Ember.run.end();
  
  equals(get(rec2, 'title'), 'baz', 'chained rec.title should changed');
  equals(get(rec, 'title'), 'bar', 'original rec.title should NOT change');
  equals(get(store, 'hasChanges'), YES, 'chained store.hasChanges');
  equals(rec.fired, NO, 'original rec.title should not have notified');
  
  Ember.run.begin();
  rec.reset();
  store.commitChanges();
  store.destroy();
  Ember.run.end();

  equals(get(rec, 'title'), 'baz', 'original rec.title should change');
  equals(rec.fired, YES, 'original rec.title should have notified');  
  

  // trial 1
  Ember.run.begin();
  store = parent.chain();
  rec2  = store.find(Rec, 1);
  ok(rec2 && get(rec2, 'title')==='baz', 'chain store should have record');
  
  rec.reset();
  set(rec2, 'title', 'FOO2');
  Ember.run.end();
  
  equals(get(rec2, 'title'), 'FOO2', 'chained rec.title should changed');
  equals(get(rec, 'title'), 'baz', 'original rec.title should NOT change');
  equals(get(store, 'hasChanges'), YES, 'chained store.hasChanges');
  equals(rec.fired, NO, 'original rec.title should not have notified');
  
  Ember.run.begin();
  rec.reset();
  store.commitChanges();
  store.destroy();
  Ember.run.end();

  equals(get(rec, 'title'), 'FOO2', 'original rec.title should change');
  equals(rec.fired, YES, 'original rec.title should have notified');  
  
});
