// ==========================================================================
// Ember.Statechart Unit Test
// ==========================================================================
/*globals SC */

var statechart = null;

module("Ember.Statechart: State - isCurrentState Property Tests", {
  setup: function() {

    statechart = Ember.Statechart.create({
      
      monitorIsActive: YES,
      
      rootState: Ember.State.extend({
        
        initialSubstate: 'a',
        
        a: Ember.State.extend(),
        
        b: Ember.State.extend()
        
      })
      
    });
    
    statechart.initStatechart();
  },
  
  teardown: function() {
    statechart.destroy();
    statechart = null;
  }
});

test("check observing isCurrentState", function() {
  var a = statechart.getState('a'),
      value;

  Ember.addObserver(a, 'isCurrentState', function() {
    value = a.get('isCurrentState');
  });
  
  equals(a.get('isCurrentState'), true);
  
  Ember.run(function() { statechart.gotoState('b'); });
  equals(a.get('isCurrentState'), false);
  equals(value, false);
  
  Ember.run(function() { statechart.gotoState('a'); });
  equals(a.get('isCurrentState'), true);
  equals(value, true);
  
  Ember.run(function() { statechart.gotoState('b'); });
  equals(a.get('isCurrentState'), false);
  equals(value, false);

});