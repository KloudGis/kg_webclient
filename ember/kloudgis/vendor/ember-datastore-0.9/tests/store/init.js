// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals module ok equals same test MyApp */

var set = Ember.set, get = Ember.get;

// This file tests the initial state of the store when it is first created
// either independently or as a chained store.

module("Ember.Store#init");

test("initial setup for root store", function() {
  var store = Ember.Store.create();
  
  equals(Ember.typeOf(store.dataHashes), 'object', 'should have dataHashes');
  equals(Ember.typeOf(store.revisions), 'object', 'should have revisions');
  equals(Ember.typeOf(store.statuses), 'object', 'should have statuses');
  ok(!store.editables, 'should not have editables');
  ok(!store.recordErrors, 'should not have recordErrors');
  ok(!store.queryErrors, 'should not have queryErrors');
}); 

