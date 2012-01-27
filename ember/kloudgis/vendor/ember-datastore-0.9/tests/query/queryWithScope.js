// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals module ok equals same test MyApp */

var set = Ember.set, get = Ember.get;

// test parsing of query string
var q, scope1, scope2;
module("Ember.Query#queryWithScope", {
  setup: function() {
    q = Ember.Query.create({
      conditions: "foo = bar",
      parameters: { foo: "bar" },
      orderBy: "foo",
      recordType: Ember.Record,
      recordTypes: [Ember.Record],
      location: Ember.Query.REMOTE
    }).freeze();
    
    scope1 = Ember.Set.create();
    scope2 = Ember.Set.create();
  },
  
  teardown: function() {
    q = scope1 = scope2 = null;
  }
});

function verifyCopy(copy, original) {
  var keys = 'conditions orderBy recordType recordTypes parameters location'.w();
  keys.forEach(function(key) {
    equals(get(copy, key), get(original, key), 'copy.%@ should equal original.%@'.fmt(key, key));
  });
}

test("getting into scope first time", function() {
  
  var q2 = q.queryWithScope(scope1);
  verifyCopy(q2, q);
  equals(get(q2, 'scope'), scope1, 'new query should have scope1');
  
  var q3 = q.queryWithScope(scope1);
  equals(q3, q2, 'calling again with same scope should return same instance');
});

test("chained scope", function() {
  var q2 = q.queryWithScope(scope1) ;
  var q3 = q2.queryWithScope(scope2);
  
  verifyCopy(q3, q2);
  equals(get(q3, 'scope'), scope2, 'new query should have scope2');
  
  var q4 = q2.queryWithScope(scope2);
  equals(q4, q3, 'calling again with same scope should return same instance');
});

