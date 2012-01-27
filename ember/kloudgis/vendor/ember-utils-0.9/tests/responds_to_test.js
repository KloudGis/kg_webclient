// ==========================================================================
// Project:   SproutCore
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals module test ok isObj equals expects same plan */

var obj;

module("Ember.respondsTo", {
  setup: function() {
    obj = Ember.Object.create({
      foo: "bar",
      total: 12345,
      aMethodThatExists: function() {},
      aMethodThatReturnsTrue: function() { return true; },
      aMethodThatReturnsFoobar: function() { return "Foobar"; },
      aMethodThatReturnsFalse: function() { return NO; }
    });
  },
  
  teardown: function() {
    obj = undefined ;
  }
  
});

test("Checks if methods exist using the 'Ember.respondsTo' method", function() {
  equals(Ember.respondsTo(obj, 'aMethodThatExists'), true);
  equals(Ember.respondsTo(obj, 'aMethodThatDoesNotExist'), false);
});


test("Checks if methods exist using the 'obj.respondsTo' method", function() {
  equals(obj.respondsTo('aMethodThatExists'), true);
  equals(obj.respondsTo('aMethodThatDoesNotExist'), false);
});
