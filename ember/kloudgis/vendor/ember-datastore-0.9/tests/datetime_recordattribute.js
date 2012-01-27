// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Apple Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals module ok equals same test MyApp */

var set = Ember.set, get = Ember.get;

// This file tests both Ember.DateTime which is in the foundation framework and
// Ember.RecordAttribute which is in the datastore framework. The desktop
// framework might not be the best place for it but it works because the
// desktop framework requires both datestore and foundation frameworks.

var sprocket, nullSprocket, d1, d2;

module('Ember.DateTime transform', {

  setup: function() {
    
    d1 = Ember.DateTime.create({ year: 2009, month: 3, day: 1, hour: 20, minute: 30, timezone: 480 });
    d2 = Ember.DateTime.create({ year: 2009, month: 3, day: 1, hour: 20, minute: 30, timezone: Ember.DateTime.timezone });
    
    MyApp = Ember.Object.create({
      store: Ember.Store.create()
    });
    
    MyApp.Sprocket = Ember.Record.extend({
      createdAt: Ember.Record.attr(Ember.DateTime),
      frenchCreatedAt: Ember.Record.attr(Ember.DateTime, { format: '%d/%m/%Y %H:%M:%S' })  
    });
        
    Ember.run.begin();
    MyApp.store.loadRecords(MyApp.Sprocket, [
      { 
        guid: '1', 
        createdAt: '2009-03-01T20:30:00-08:00',
        frenchCreatedAt: '01/03/2009 20:30:00'
      },
      { 
        guid: '2', 
        createdAt: null,
        frenchCreatedAt: null
      }
    ]);
    Ember.run.end();
    
    sprocket = MyApp.store.find(MyApp.Sprocket, '1');
    nullSprocket = MyApp.store.find(MyApp.Sprocket, '2');
  },
  
  teardown: function() {
    MyApp = sprocket = nullSprocket = null;
  }

});

test("reading a DateTime should successfully parse the underlying string value", function() {
  equals(get(sprocket, 'createdAt'), d1, 'reading a DateTime should return the correct Ember.DateTime object');
  equals(get(sprocket, 'frenchCreatedAt'), d2, 'reading a DateTime with a custom format should return the correct Ember.DateTime object');
});

test("writing a DateTime should successfully format the value into a string", function() {
  d1 = d1.advance({ year: 1, hour: 2, minute: 28 });
  d2 = d2.advance({ month: -2, minute: 16 });
  
  set(sprocket, 'createdAt', d1);
  set(sprocket, 'frenchCreatedAt', d2);
  
  equals(sprocket.readAttribute('createdAt'), '2010-03-01T22:58:00-08:00', 'writing a DateTime should successfully format the value into the a string');
  equals(sprocket.readAttribute('frenchCreatedAt'), '01/01/2009 20:46:00', 'writing a DateTime with a custom format should successfully format the value into the a string');
});

test("reading or writing null values should work", function() {
  set(sprocket, 'createdAt', null);
  equals(sprocket.readAttribute('createdAt'), null);
  
  equals(get(nullSprocket, 'createdAt'), null);
});
