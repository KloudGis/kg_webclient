// ==========================================================================
// Project:   SproutCore
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

var slice = Array.prototype.slice;

var respondsTo = function(obj, methodName) {
  return !!(obj[methodName] instanceof Function);
};

/**
  @param {Object} obj The object to check for the method
  @param {String} methodName The method name to check for
*/
Ember.respondsTo = respondsTo;

Ember.Object.reopen(
/** @scope Ember.Object.prototype */{

  respondsTo: function() {
    var args = slice.call(arguments);
    args.unshift(this);
    return Ember.respondsTo.apply(SC, args);
  }

});