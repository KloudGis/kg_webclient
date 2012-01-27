// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals module test ok equals same */

var set = Ember.set, get = Ember.get;

var TestRunner;
module("Sample Model from TestRunner Application", { 
  setup: function() {

    // namespace
    TestRunner = Ember.Object.create({
      store: Ember.Store.create()
    });

    // describes a single target.  has target name, target type, and url to 
    // load tests.
    TestRunner.Target = Ember.Record.extend({

      /** test name */
      name: Ember.Record.attr(String),
      
      /** test type - one of 'app', 'framework', 'sproutcore' */
      type: Ember.Record.attr(String, { only: 'single group all'.w() }),

      /** Fetches list of tests dynamically */
      tests: Ember.Record.fetch('TestRunner.Test')

    });

    /* JSON:
    
     { 
       link_test:  "url to laod test",
        },
    */ 
    TestRunner.Test = Ember.Record.extend({
      
      // testName
      testUrl: Ember.Record.attr({
        key: 'link_test'
      }),
      
      target: Ember.Record.attr('TestRunner.Target', {
        inverse: 'tests',
        isMaster: YES,
        isEditable: NO
      })
      
    });

  }
});

