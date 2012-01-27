// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals module ok equals same test MyApp */

var set = Ember.set, get = Ember.get;

var store, Foo, json, foo ;
module("Ember.Record#readAttribute", {
  setup: function() {
    Ember.run.begin();
    store = Ember.Store.create();
    Foo = Ember.Record.extend();
    json = { 
      foo: "bar", 
      number: 123,
      bool: YES,
      array: [1,2,3] 
    };
    
    foo = store.createRecord(Foo, json);
    store.writeStatus(foo.storeKey, Ember.Record.READY_CLEAN); 
  },
  
  teardown: function() {
    Ember.run.end();
  }
});

test("returns unaltered JSON value for existing attributes", function() {
  var key ;
  for(key in json) {
    if (!json.hasOwnProperty(key)) continue;
    equals(get(foo, key), json[key], 'should return value for predefined key %@'.fmt(key));
  }
});

test("returns undefined for unknown JSON attributes", function() {
  equals(get(foo, 'imaginary'), undefined, 'should return undefined for unknown key "imaginary"');
});

test("returns new value if edited via writeAttribute", function() {
  foo.writeAttribute("bar", "baz");
  equals(foo.readAttribute("bar"), "baz", "should return value for new attribute 'bar'");
});

test("returns undefined when data hash is not present", function() {
  store.removeDataHash(foo.storeKey);
  equals(store.readDataHash(foo.storeKey), null, 'precond - data hash should be removed from store');
  equals(foo.readAttribute("foo"), undefined, "should return undefined if data hash is missing");
});


