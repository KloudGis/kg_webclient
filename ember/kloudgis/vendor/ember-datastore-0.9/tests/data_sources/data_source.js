// ==========================================================================
// Project:   Ember.DataSource Unit Test
// Copyright: ©2011 Junction Networks and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/*globals JN module test ok equals same stop start */

var set = Ember.set, get = Ember.get;

var MyApp, wasCalled;
module("Ember.DataSource", {
  setup: function () {
    MyApp = window.MyApp = {};
    MyApp.store = Ember.Store.create();
    MyApp.Foo = Ember.Record.extend();

    MyApp.DataSource = Ember.DataSource.extend({
      fetch: function (store, query) {
        wasCalled = true;
        equals(arguments.length, 2);
        return YES;
      },

      createRecord: function (store, storeKey, params) {
        wasCalled = true;
        equals(arguments.length, 3);
        return YES;
      },

      updateRecord: function (store, storeKey, params) {
        wasCalled = true;
        equals(arguments.length, 3);
        return YES;
      },

      retrieveRecord: function (store, storeKey, params) {
        wasCalled = true;
        equals(arguments.length, 3);
        return YES;
      },

      destroyRecord: function (store, storeKey, params) {
        wasCalled = true;
        equals(arguments.length, 3);
        return YES;
      }
    });
    Ember.run.begin();
  },

  teardown: function () {
    Ember.run.end();
    window.MyApp = MyApp = undefined;
    delete window.MyApp;
  }
});

test("The dataSource will forward calls to the appropriate methods", function () {
  var ds = MyApp.DataSource.create();
  set(MyApp.store, 'dataSource', ds);
  ok(MyApp.store.find(Ember.Query.remote(MyApp.Foo)),
     "the fetch should return a record array");
  ok(wasCalled, "`fetch` should have been called");
  wasCalled = NO;

  ok(MyApp.store.find(MyApp.Foo, "testing retrieve"),
     "retrieve should return a new record (because the dataSource handled the request YES)");
  ok(wasCalled, "`retrieve` should have been called");
  wasCalled = NO;

  var rec = MyApp.store.createRecord(MyApp.Foo, {});

  equals(MyApp.store.commitRecord(MyApp.Foo, 'foo', get(rec, 'storeKey')), YES,
         "commiting a new record should return YES");
  ok(wasCalled, "`createRecord` should have been called");
  wasCalled = NO;

  MyApp.store.writeStatus(get(rec, 'storeKey'), Ember.Record.READY_CLEAN);

  set(rec, 'zero', 0);
  equals(MyApp.store.commitRecord(MyApp.Foo, 'foo', get(rec, 'storeKey')), YES,
         "updating a record should return YES");
  ok(wasCalled, "`updateRecord` should have been called");
  wasCalled = NO;

  MyApp.store.writeStatus(get(rec, 'storeKey'), Ember.Record.READY_CLEAN);

  rec.destroy();
  // broken in Ember.Store
  equals(MyApp.store.commitRecord(MyApp.Foo, 'foo', get(rec, 'storeKey')), YES,
     "destroying the record should return YES");
  ok(wasCalled, "`destroyRecord` should have been called");
});

test("The dataSource will return YES when all records committed return YES", function () {
  var ds = MyApp.DataSource.create({
    createRecord: function () { return YES; },
    updateRecord: function () { return YES; },
    destroyRecord: function () { return YES; }
  });

  set(MyApp.store, 'dataSource', ds);

  var rec1 = MyApp.store.createRecord(MyApp.Foo, {}),
      rec2, rec3;

  equals(MyApp.store.commitRecords(), YES,
         "commiting a single new record should return YES");

  MyApp.store.writeStatus(get(rec1, 'storeKey'), Ember.Record.READY_CLEAN);

  set(rec1, 'zero', 0);
  rec2 = MyApp.store.createRecord(MyApp.Foo, {});

  equals(MyApp.store.commitRecords(), YES,
         "commiting records for an 'update' and 'create' should return YES");

  MyApp.store.writeStatus(get(rec1, 'storeKey'), Ember.Record.READY_CLEAN);
  MyApp.store.writeStatus(get(rec2, 'storeKey'), Ember.Record.READY_CLEAN);

  rec1.destroy();
  set(rec2, 'one', 1);
  rec3 = MyApp.store.createRecord(MyApp.Foo, {});

  equals(MyApp.store.commitRecords(), YES,
         "commiting records for an 'update', 'create', and 'destroy' should return YES");
});

test("The dataSource will return Ember.MIXED_STATE when all records committed return YES and NO", function () {
  var ds = MyApp.DataSource.create({
    createRecord: function () { return NO; },
    updateRecord: function () { return YES; },
    destroyRecord: function () { return NO; }
  });

  set(MyApp.store, 'dataSource', ds);

  var rec1 = MyApp.store.createRecord(MyApp.Foo, {}),
      rec2, rec3;

  equals(MyApp.store.commitRecords(), NO,
         "commiting a single new record should return NO");

  MyApp.store.writeStatus(get(rec1, 'storeKey'), Ember.Record.READY_CLEAN);

  set(rec1, 'zero', 0);
  rec2 = MyApp.store.createRecord(MyApp.Foo, {});

  equals(MyApp.store.commitRecords(), Ember.MIXED_STATE,
         "commiting records for an 'update' and 'create' should return %@".fmt(Ember.MIXED_STATE));

  MyApp.store.writeStatus(get(rec1, 'storeKey'), Ember.Record.READY_CLEAN);
  MyApp.store.writeStatus(get(rec2, 'storeKey'), Ember.Record.READY_CLEAN);

  rec1.destroy();
  set(rec2, 'one', 1);
  rec3 = MyApp.store.createRecord(MyApp.Foo, {});

  equals(MyApp.store.commitRecords(), Ember.MIXED_STATE,
         "commiting records for an 'update', 'create', and 'destroy' should return %@".fmt(Ember.MIXED_STATE));
});

test("The dataSource will return NO when all records committed return NO", function () {
  var ds = MyApp.DataSource.create({
    createRecord: function () { return NO; },
    updateRecord: function () { return NO; },
    destroyRecord: function () { return NO; }
  });
  set(MyApp.store, 'dataSource', ds);

  var rec1 = MyApp.store.createRecord(MyApp.Foo, {}),
      rec2, rec3;

  equals(MyApp.store.commitRecords(), NO,
         "commiting a single new record should return NO");

  MyApp.store.writeStatus(get(rec1, 'storeKey'), Ember.Record.READY_CLEAN);

  set(rec1, 'zero', 0);
  rec2 = MyApp.store.createRecord(MyApp.Foo, {});

  equals(MyApp.store.commitRecords(), NO,
         "commiting records for an 'update' and 'create' should return NO");

  MyApp.store.writeStatus(get(rec1, 'storeKey'), Ember.Record.READY_CLEAN);
  MyApp.store.writeStatus(get(rec2, 'storeKey'), Ember.Record.READY_CLEAN);

  rec1.destroy();
  set(rec2, 'one', 1);
  rec3 = MyApp.store.createRecord(MyApp.Foo, {});

  equals(MyApp.store.commitRecords(), NO,
         "commiting records for an 'update', 'create', and 'destroy' should return NO");
});
