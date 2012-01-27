// ==========================================================================
// Ember.Statechart Unit Test
// ==========================================================================
/*globals SC */

var statechart, stateA, stateB, stateC;

module("Ember.HistoryState Tests", {
  setup: function() {
    statechart = Ember.Statechart.create({initialState: 'a', a: Ember.State.extend()});
    stateA = Ember.State.create({ name: 'stateA' });
    stateB = Ember.State.create({ name: 'stateB' });
    stateC = Ember.State.create({ name: 'stateC' });
  },
  
  teardown: function() {
    statechart = stateA = stateB = stateC = null;
  }
});

test("Check default history state", function() {
  var historyState = Ember.HistoryState.create();
  
  equals(historyState.get('isRecursive'), false);
});

test("Check assigned history state", function() {  
  var historyState = Ember.HistoryState.create({
    isRecursive: YES,
    statechart: statechart,
    parentState: stateA,
    defaultState: stateB
  });
  
  equals(historyState.get('statechart'), statechart);
  equals(historyState.get('parentState'), stateA);
  equals(historyState.get('defaultState'), stateB);
  equals(historyState.get('isRecursive'), true);
  equals(historyState.get('state'), stateB);
  
  stateA.set('historyState', stateC);
  
  equals(historyState.get('state'), stateC);
  
  stateA.set('historyState', null);
  
  equals(historyState.get('state'), stateB);
});