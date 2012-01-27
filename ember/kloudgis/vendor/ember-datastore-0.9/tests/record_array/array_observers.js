/*globals MyRecord */

var set = Ember.set, get = Ember.get;

(function(root) {
  var store;
  var query;
  var recordArray;

  module("Ember.RecordArray - implements array content observers", {
    setup: function() {
    },

    teardown: function() {
      root.MyRecord = undefined;
    }
  });

  test("notifies when a record is added to the store that matches a query", function() {
    var callCount = 0,
        lastRemovedCount = 0,
        lastAddedCount = 0;

    Ember.run(function() {
      store = Ember.Store.create();
      root.MyRecord = Ember.Record.extend();
      query = Ember.Query.local(MyRecord);

      recordArray = store.find(query);
      recordArray.addArrayObserver(this, {
        didChange: function(target, start, removedCount, addedCount) {
          lastRemovedCount = removedCount;
          lastAddedCount = addedCount;
        },

        willChange: function() {}
      });

      store.createRecord(MyRecord, {});
    });

    equals(lastAddedCount, 1);
    equals(lastRemovedCount, 0);
    equals(get(recordArray, 'length'), 1);
  });

  test("notifies when a record is removed from the store that matches a query", function() {
    var lastRemovedCount = 0,
        lastAddedCount = 0;

    var record;

    Ember.run(function() {
      store = Ember.Store.create();
      root.MyRecord = Ember.Record.extend();
      query = Ember.Query.local(MyRecord);

      recordArray = store.find(query);

      recordArray.addArrayObserver(this, {
        didChange: function(target, start, removedCount, addedCount) {
          lastRemovedCount = removedCount;
          lastAddedCount = addedCount;
        },

        willChange: function() {}
      });

      record = store.createRecord(MyRecord, {
        guid: 1
      });
    });

    equals(lastAddedCount, 1);
    equals(lastRemovedCount, 0);

    Ember.run(function() {
      record.destroy();
    });

    equals(lastAddedCount, 0);
    equals(lastRemovedCount, 1);
    equals(get(recordArray, 'length'), 0);
  });
})(this);
