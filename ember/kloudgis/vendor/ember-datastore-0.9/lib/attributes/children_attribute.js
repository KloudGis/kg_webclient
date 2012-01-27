// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2010 Evin Grano
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

require('ember-runtime');
require('ember-datastore/system/record');
require('ember-datastore/attributes/record_attribute');
require('ember-datastore/attributes/child_attribute');
require('ember-datastore/system/child_array');

var get = Ember.get, set = Ember.set;

/** @class
  
  ChildrenAttribute is a subclass of ChildAttribute and handles to-many 
  relationships for child records.
  
  When setting ( `set()` ) the value of a toMany attribute, make sure
  to pass in an array of Ember.Record objects.
  
  There are many ways you can configure a ChildrenAttribute:
  
      contacts: Ember.ChildrenAttribute.attr('Ember.Child');
  
  @extends Ember.RecordAttribute
  @since SproutCore 1.0
*/
Ember.ChildrenAttribute = Ember.ChildAttribute.extend(
  /** @scope Ember.ChildrenAttribute.prototype */ {
    
  // ..........................................................
  // LOW-LEVEL METHODS
  //
  
  /**  @private - adapted for to many relationship */
  toType: function(record, key, value) {
    var attrKey   = get(this, 'key') || key,
        arrayKey  = '__kidsArray__'+Ember.guidFor(this),
        ret       = record[arrayKey],
        recordType  = get(this, 'typeClass'), rel;

    // lazily create a ManyArray one time.  after that always return the 
    // same object.
    if (!ret) {
      ret = Ember.ChildArray.create({ 
        record:         record,
        propertyName:   attrKey,
        defaultRecordType: recordType
      });

      record[arrayKey] = ret ; // save on record
      rel = get(record, 'relationships');
      if (!rel) set(record, 'relationships', rel = []);
      rel.push(ret); // make sure we get notified of changes...
    }

    return ret;
  },
  
  // Default fromType is just returning itself
  fromType: function(record, key, value){
    var sk, store, 
        arrayKey = '__kidsArray__'+Ember.guidFor(this),
        ret = record[arrayKey];
    if (record) {
      record.writeAttribute(key, value);
      if (ret) ret = ret.recordPropertyDidChange();
    }
    
    return ret;
  }
});


