// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

require("ember-views/views/collection_view");
require("ember-handlebars/main");

var set = Ember.set, get = Ember.get;

module("collections", {
  setup: function() {
    window.Tests = Ember.Namespace.create({
      store: Ember.Store.create().from("Ember.FixturesDataSource")
    });

    Tests.Comment = Ember.Record.extend({
      body: Ember.Record.attr(String),
      post: Ember.Record.toOne("Tests.Post", {
        inverse: 'comments',
        isMaster: YES
      })
    });

    Tests.Post = Ember.Record.extend({
      title: Ember.Record.attr(String),
      body: Ember.Record.attr(String),
      comments: Ember.Record.toMany("Tests.Comment", {
        inverse: 'post',
        isMaster: NO
      })
    });

    Tests.Post.FIXTURES = [
      { guid: 1, title: "First post", comments: [1, 2] }
    ];

    Tests.Comment.FIXTURES = [
      { guid: 1,
        body: "First",
        post: 1
      },
      { guid: 2,
        body: "Second",
        post: 1
      }
    ];

    Ember.run.begin();

  },
  teardown: function() {
    window.Tests = undefined;
    Ember.run.end();
  }
});

test("properly adds and removes nodes with Ember.ManyArray", function() {
  var post = Tests.store.find(Tests.Post).objectAt(0);

  Tests.commentsController = Ember.ArrayProxy.create({
    content: post.get("comments")
  });

  Tests.commentsListView = Ember.CollectionView.extend({
    contentBinding: "Tests.commentsController.content"
  });

  var view = Ember.View.create({
    template: Ember.Handlebars.compile(
      "{{#collection Tests.commentsListView}}" +
        "{{content.body}}" +
      "{{/collection}}"
    )
  });

  Ember.run(function() {
    view.appendTo('#qunit-fixture');
  });

  equals(view.$().text(), 'FirstSecond');

  var comment;
  Ember.run(function() {
    var attrs = { guid: 3, body: "Third", post: 1 };
    comment = Tests.store.createRecord(Tests.Comment, attrs);

    post.get("comments").addInverseRecord(comment);
    // TODO: I can't make it work without calling rerender, but
    // it works properly in application, so I'm leaving it like
    // this for now
    view.rerender();
  });

  Ember.run(function() {
    post.get("comments").removeInverseRecord(comment);
    view.rerender();
  });

  equals(view.$().text(), 'FirstSecond');
});

test("properly adds and removes nodes with Ember.RecordArray", function() {
  var comments = Tests.store.find(Tests.Comment);

  Tests.commentsController = Ember.ArrayProxy.create({
    content: comments
  });

  Tests.commentsListView = Ember.CollectionView.extend({
    contentBinding: "Tests.commentsController.content"
  });

  var view = Ember.View.create({
    template: Ember.Handlebars.compile(
      "{{#collection Tests.commentsListView}}" +
        "{{content.body}}" +
      "{{/collection}}"
    )
  });

  Ember.run(function() {
    view.appendTo('#qunit-fixture');
  });

  equals(view.$().text(), 'FirstSecond');

  var comment;
  Ember.run(function() {
    var attrs = { guid: 3, body: "Third", post: 1 };
    comment = Tests.store.createRecord(Tests.Comment, attrs);
    view.rerender();
  });

  equals(view.$().text(), 'ThirdFirstSecond');

  Ember.run(function() {
    comment.destroy();
    view.rerender();
  });

  equals(view.$().text(), 'FirstSecond');
});

