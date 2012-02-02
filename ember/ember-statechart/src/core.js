// ==========================================================================
// Project:   SproutCore Statechart
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================



//UTILS
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

var tryToPerform = function(obj, methodName) {
  var args = slice.call(arguments);
  args.shift(); args.shift();
  return Ember.respondsTo(obj, methodName) && (obj[methodName].apply(obj, args) !== false);
};

/**
  Checks to see if the `methodName` exists on the `obj`,
  and if it does, invokes it with the arguments passed.

  @function

  @param {Object} obj The object to check for the method
  @param {String} methodName The method name to check for
  @param {Object...} args The arguments to pass to the method

  @returns {Boolean} true if the method does not return false
  @returns {Boolean} false otherwise
*/
Ember.tryToPerform = tryToPerform;

Ember.Object.reopen(
/** @scope Ember.Object.prototype */{

  tryToPerform: function() {
    var args = slice.call(arguments);
    args.unshift(this);
    return Ember.tryToPerform.apply(SC, args);
  }

});



//sc


Ember.handleActions = function(func) {
  var args = Array.prototype.slice.call(arguments);
  // remove func
  args.shift();

  func.isActionHandler = YES;
  func.actions = args;
  return func;
};

Ember.stateObserves = function(func) {
  var args = Array.prototype.slice.call(arguments);
  // remove func
  args.shift();

  func.isStateObserveHandler = YES;
  func.args = args;
  return func;
};