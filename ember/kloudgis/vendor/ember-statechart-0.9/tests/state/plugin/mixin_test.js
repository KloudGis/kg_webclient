// ==========================================================================
// Ember.Statechart Unit Test
// ==========================================================================
/*globals SC TestState */

TestState = null;
var obj, MixinA, MixinB, stateA, stateB, stateC;

module("Ember.State.plugin: Mixin Tests", {
  setup: function() {
    
    MixinA = {
      isMixinA: YES
    };
    
    MixinB = {
      isMixinB: YES
    };

    TestState = Ember.State.extend({
      isTestState: YES
    });

    obj = Ember.Object.create(Ember.StatechartManager, {
      
      initialState: 'stateA',
      
      stateA: Ember.State.plugin('TestState'),
      
      stateB: Ember.State.plugin('TestState', MixinA),
      
      stateC: Ember.State.plugin('TestState', MixinA, MixinB)
      
    });
    
    stateA = obj.getState('stateA');
    stateB = obj.getState('stateB');
    stateC = obj.getState('stateC');

  },
  
  teardown: function() {
    obj = TestState = MixinA = MixinB = null;
    stateA = stateB = stateC = null;
  }

});

test("check plugin state A", function() {
  ok(stateA instanceof TestState);
  ok(stateA.get('isTestState'));
  ok(!stateA.get('isMixinA'));
  ok(!stateA.get('isMixinB'));
});

test("check plugin state B", function() {
  ok(stateB instanceof TestState);
  ok(stateB.get('isTestState'));
  ok(stateB.get('isMixinA'));
  ok(!stateB.get('isMixinB'));
});

test("check plugin state C", function() {
  ok(stateC instanceof TestState);
  ok(stateC.get('isTestState'));
  ok(stateC.get('isMixinA'));
  ok(stateC.get('isMixinB'));
});