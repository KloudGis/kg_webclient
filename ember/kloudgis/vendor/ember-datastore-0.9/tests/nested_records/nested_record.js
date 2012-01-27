/**
 * Nested Records (Ember.Record) Unit Test
 *
 * @author Evin Grano
 */

 var set = Ember.set, get = Ember.get;

// ..........................................................
// Basic Set up needs to move to the setup and teardown
// 
var NestedRecord, store, testParent, testParent2, childData1; 

var initModels = function(){
  NestedRecord.ParentRecordTest = Ember.Record.extend({
    /** Child Record Namespace */
    nestedRecordNamespace: NestedRecord,

    name: Ember.Record.attr(String),
    info: Ember.Record.toOne('NestedRecord.ChildRecordTest', { nested: true })
  });

  NestedRecord.ChildRecordTest = Ember.Record.extend({
    id: Ember.Record.attr(String),
    name: Ember.Record.attr(String),
    value: Ember.Record.attr(String)
  });
};

// ..........................................................
// Basic Ember.Record Stuff
// 
module("Basic Ember.Record Functions w/ Parent > Child", {

  setup: function() {
    NestedRecord = Ember.Object.create({
      store: Ember.Store.create()
    });
    store = NestedRecord.store;
    initModels();
    Ember.run.begin();
    // Test Parent 1
    testParent = store.createRecord(NestedRecord.ParentRecordTest, {
      name: 'Parent Name',
      info: {
        type: 'ChildRecordTest',
        name: 'Child Name',
        value: 'Blue Goo',
        guid: '5001'
      }
    });
    // Test parent 2
    testParent2 = NestedRecord.store.createRecord(NestedRecord.ParentRecordTest, {
      name: 'Parent Name 2',
      info: {
        type: 'ChildRecordTest',
        name: 'Child Name 2',
        value: 'Purple Goo',
        guid: '5002'
      }
    });
    Ember.run.end();
    
    
    // ..........................................................
    // Child Data
    // 
    childData1 = {
      type: 'ChildRecordTest',
      name: 'Child Name',
      value: 'Green Goo',
      guid: '5002'
    };
  },

  teardown: function() {
    delete NestedRecord.ParentRecordTest;
    delete NestedRecord.ChildRecordTest;
    testParent = null;
    testParent2 = null;
    store = null;
    childData1 = null;
    NestedRecord = null;
  }
});

test("Function: readAttribute()", function() {
  equals(testParent.readAttribute('name'), 'Parent Name', "readAttribute should be correct for name attribute");
  
  equals(testParent.readAttribute('nothing'), null, "readAttribute should be correct for invalid key");
  
  same(testParent.readAttribute('info'),   
    {
      type: 'ChildRecordTest',
      name: 'Child Name',
      value: 'Blue Goo',
      guid: '5001'
    },
    "readAttribute should be correct for info child attribute");
  
});

test("Support Multiple Parent Records With Different Child Records", function() {
  
  same(testParent2.readAttribute('info'),
    {
      type: 'ChildRecordTest',
      name: 'Child Name 2',
      value: 'Purple Goo',
      guid: '5002'
    },
    "readAttribute should be correct for info child attribute on new record");
  equals(get(get(testParent2, 'info'), 'value'), 'Purple Goo', "get should retrieve the proper value on new record");

  same(testParent.readAttribute('info'),
    {
      type: 'ChildRecordTest',
      name: 'Child Name',
      value: 'Blue Goo',
      guid: '5001'
    },
    "readAttribute should be correct for info child attribute on first record");
  equals(get(get(testParent, 'info'), 'value'), 'Blue Goo', "get should retrieve the proper value on first record");
});

test("Function: writeAttribute()", function() {
  
  testParent.writeAttribute('name', 'New Parent Name');
  equals(get(testParent, 'name'), 'New Parent Name', "writeAttribute should be the new name attribute");
  
  testParent.writeAttribute('nothing', 'nothing');
  equals(get(testParent, 'nothing'), 'nothing', "writeAttribute should be correct for new key");
  
  testParent.writeAttribute('info', {
    type: 'ChildRecordTest',
    name: 'New Child Name',
    value: 'Red Goo'
  });
  same(testParent.readAttribute('info'),   
    {
      type: 'ChildRecordTest',
      name: 'New Child Name',
      value: 'Red Goo'
    },
    "writeAttribute with readAttribute should be correct for info child attribute");
});

test("Basic Read", function() {
  var id;
  // Test general gets
  equals(get(testParent, 'name'), 'Parent Name', "get should be correct for name attribute");
  equals(get(testParent, 'nothing'), null, "get should be correct for invalid key");
  
  // Test Child Record creation
  var cr = get(testParent, 'info');
  // Check Model Class information
  ok((cr instanceof  Ember.Record), "get() creates an actual instance that is a kind of a Ember.Record Object");
  ok((cr instanceof NestedRecord.ChildRecordTest), "get() creates an actual instance of a ChildRecordTest Object");
  
  // Check reference information
  var pm = get(cr, 'primaryKey');
  var key = get(cr, pm);
  var storeRef = store.find(NestedRecord.ChildRecordTest, key);
  ok(storeRef, 'checking that the store has the instance of the child record with proper primary key');
  equals(cr, storeRef, "checking the parent reference is the same as the direct store reference");
  
  // Check to see if the attributes of a Child Record match the refrence of the parent
  same(get(storeRef, 'attributes'), testParent.readAttribute('info'), "check that the ChildRecord's attributes are the same as the ParentRecord's readAttribute for the reference");
  
  // Duplication check
  var sameCR = get(testParent, 'info');
  ok(sameCR, "check to see if we have an instance of a child record again");
  var oldKey = get(cr, pm), newKey = get(sameCR, pm);
  equals(oldKey, newKey, "check to see if the Primary Key are the same");
  same(sameCR, cr, "check to see that it is the same child record as before");
});

test("Basic Write As a Hash", function() {
  
  // Test general gets
  set(testParent, 'name', 'New Parent Name');
  equals(get(testParent, 'name'), 'New Parent Name', "set() should change name attribute");
  set(testParent, 'nothing', 'nothing');
  equals(get(testParent, 'nothing'), 'nothing', "set should change non-existent property to a new property");
  
  // Test Child Record creation
  var oldCR = get(testParent, 'info');
  set(testParent, 'info', {
    type: 'ChildRecordTest',
    name: 'New Child Name',
    value: 'Red Goo',
    guid: '6001'
  });
  var cr = get(testParent, 'info');
  // Check Model Class information
  ok((cr instanceof  Ember.Record), "set() with an object creates an actual instance that is a kind of a Ember.Record Object");
  ok((cr instanceof NestedRecord.ChildRecordTest), "set() with an object creates an actual instance of a ChildRecordTest Object");
  
  // Check reference information
  var pm = get(cr, 'primaryKey');
  var key = get(cr, pm);
  var storeRef = store.find(NestedRecord.ChildRecordTest, key);
  ok(storeRef, 'after a set() with an object, checking that the store has the instance of the child record with proper primary key');
  equals(cr, storeRef, "after a set with an object, checking the parent reference is the same as the direct store reference");
  var oldKey = get(oldCR, pm);
  ok(!(oldKey === key), 'check to see that the old child record has a different key from the new child record');
  
  // Check for changes on the child bubble to the parent.
  set(cr, 'name', 'Child Name Change');
  equals(get(cr, 'name'), 'Child Name Change', "after a set('name', <new>) on child, checking that the value is updated");
  ok(get(cr, 'status') & Ember.Record.DIRTY, 'check that the child record is dirty');
  ok(get(testParent, 'status') & Ember.Record.DIRTY, 'check that the parent record is dirty');
  var newCR = get(testParent, 'info');
  same(newCR, cr, "after a set('name', <new>) on child, checking to see that the parent has recieved the changes from the child record");
  same(testParent.readAttribute('info'), get(cr, 'attributes'), "after a set('name', <new>) on child, readAttribute on the parent should be correct for info child attributes");
});

test("Basic Write As a Child Record", function() {
  
  // Test general gets
  set(testParent, 'name', 'New Parent Name');
  equals(get(testParent, 'name'), 'New Parent Name', "set() should change name attribute");
  set(testParent, 'nothing', 'nothing');
  equals(get(testParent, 'nothing'), 'nothing', "set should change non-existent property to a new property");
  
  // Test Child Record creation
  var store = get(testParent, 'store');
  var cr = store.createRecord(NestedRecord.ChildRecordTest, {type: 'ChildRecordTest', name: 'New Child Name', value: 'Red Goo', guid: '6001'});
  // Check Model Class information
  ok((cr instanceof  Ember.Record), "before the set(), check for actual instance that is a kind of a Ember.Record Object");
  ok((cr instanceof NestedRecord.ChildRecordTest), "before the set(), check for actual instance of a ChildRecordTest Object");
  set(testParent, 'info', cr);
  cr = get(testParent, 'info');
  // Check Model Class information
  ok((cr instanceof  Ember.Record), "set() with an object creates an actual instance that is a kind of a Ember.Record Object");
  ok((cr instanceof NestedRecord.ChildRecordTest), "set() with an object creates an actual instance of a ChildRecordTest Object");
  
  // Check reference information
  var pm = get(cr, 'primaryKey');
  var key = get(cr, pm);
  var storeRef = store.find(NestedRecord.ChildRecordTest, key);
  ok(storeRef, 'after a set() with an object, checking that the store has the instance of the child record with proper primary key');
  equals(cr, storeRef, "after a set with an object, checking the parent reference is the same as the direct store reference");
  
  // Check for changes on the child bubble to the parent.
  set(cr, 'name', 'Child Name Change');
  equals(get(cr, 'name'), 'Child Name Change', "after a set('name', <new>) on child, checking that the value is updated");
  ok(get(cr, 'status') & Ember.Record.DIRTY, 'check that the child record is dirty');
  ok(get(testParent, 'status') & Ember.Record.DIRTY, 'check that the parent record is dirty');
  var newCR = get(testParent, 'info');
  same(newCR, cr, "after a set('name', <new>) on child, checking to see that the parent has recieved the changes from the child record");
  same(testParent.readAttribute('info'), get(cr, 'attributes'), "after a set('name', <new>) on child, readAttribute on the parent should be correct for info child attributes");

  // Make sure you can set the child to null.
  set(testParent, 'info', null);
  equals(get(testParent, 'info'), null, 'should be able to set child record to null');
});

test("Child Status Changed", function() {
  var cr;
  cr = get(testParent, 'info');
  equals(get(cr, 'status'), get(testParent, 'status'), 'after initializing the parent to READY_NEW, check that the child record matches');
  
  Ember.run.begin();
  store.writeStatus(testParent.storeKey, Ember.Record.READY_DIRTY);
  store.dataHashDidChange(testParent.storeKey);
  equals(get(cr, 'status'), get(testParent, 'status'), 'after setting the parent to READY_DIRTY, check that the child record matches');
  Ember.run.end();
  
  Ember.run.begin();
  store.writeStatus(testParent.storeKey, Ember.Record.BUSY_REFRESH);
  store.dataHashDidChange(testParent.storeKey);
  equals(get(cr, 'status'), get(testParent, 'status'), 'after setting the parent to BUSY_REFRESH, check that the child record matches');
  Ember.run.end();
});

test("Child Status Matches Store Status", function() {
  var cr;
  var storeStatus;
  cr = get(testParent, 'info');
  
  storeStatus = store.readStatus(cr.storeKey);
  equals(storeStatus, get(cr, 'status'), 'after initializing the parent to READY_NEW, check that the store status matches for the child');
  equals(get(cr, 'status'), get(testParent, 'status'), 'after initializing the parent to READY_NEW, check that the child record matches');
  
  Ember.run.begin();
  store.writeStatus(testParent.storeKey, Ember.Record.READY_CLEAN);
  store.dataHashDidChange(testParent.storeKey);
  Ember.run.end();
  
  storeStatus = store.readStatus(cr.storeKey);
  equals(get(testParent, 'status'), Ember.Record.READY_CLEAN, 'parent status should be READY_CLEAN');
  equals(storeStatus, get(cr, 'status'), 'after setting the parent to READY_CLEAN, the child\'s status and store status should be READY_CLEAN before calling get(\'status\') on the child');
  equals(get(cr, 'status'), get(testParent, 'status'), 'after setting the parent to READY_CLEAN, check that the child record matches');
  
  Ember.run.begin();
  store.writeStatus(testParent.storeKey, Ember.Record.READY_DIRTY);
  store.dataHashDidChange(testParent.storeKey);
  Ember.run.end();
  
  storeStatus = store.readStatus(cr.storeKey);
  equals(get(testParent, 'status'), Ember.Record.READY_DIRTY, 'parent status should be READY_DIRTY');
  equals(storeStatus, get(cr, 'status'), 'after setting the parent to READY_DIRTY, the child\'s status and store status should be READY_DIRTY before calling get(\'status\') on the child');
  equals(get(cr, 'status'), get(testParent, 'status'), 'after setting the parent to READY_DIRTY, check that the child record matches');
  
  Ember.run.begin();
  store.writeStatus(testParent.storeKey, Ember.Record.BUSY_REFRESH);
  store.dataHashDidChange(testParent.storeKey);
  storeStatus = store.readStatus(cr.storeKey);
  Ember.run.end();
  
  equals(get(testParent, 'status'), Ember.Record.BUSY_REFRESH, 'parent status should be BUSY_REFRESH');
  equals(storeStatus, get(cr, 'status'), 'after setting the parent to BUSY_REFRESH, the child\'s status and store status should be BUSY_REFRESH before calling get(\'status\') on the child');
  equals(get(cr, 'status'), get(testParent, 'status'), 'after setting the parent to BUSY_REFRESH, check that the child record matches');
});
