Ember.TEMPLATES["bookmark-panel"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var stack1, stack2, stack3, stack4, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2;
  data.buffer.push("\n		<span class=\"button-image\"><span>	\n		");
  stack1 = {};
  stack2 = "super-bookmark-popup";
  stack1['id'] = stack2;
  stack2 = "KG.bookmarksController.activePopup";
  stack1['isVisibleBinding'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(2, program2, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;}
function program2(depth0,data) {
  
  var buffer = '', stack1, stack2;
  data.buffer.push("\n					");
  stack1 = {};
  stack2 = "bookmark-popup";
  stack1['id'] = stack2;
  stack2 = "KG.bookmarksController.activePopup";
  stack1['isVisibleBinding'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(3, program3, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n		");
  return buffer;}
function program3(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("						\n						<div id=\"bookmark-top-bar\">\n							");
  stack1 = depth0;
  stack2 = "_bookmarkTitle";
  stack3 = {};
  stack4 = "bookmark-label";
  stack3['id'] = stack4;
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n							");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "bookmark-add-button";
  stack3['id'] = stack4;
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "white-button unselectable";
  stack3['class'] = stack4;
  stack4 = "addBookmarkAction";
  stack3['sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(4, program4, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n							");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "bookmark-delete-button";
  stack3['id'] = stack4;
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "red-button unselectable";
  stack3['class'] = stack4;
  stack4 = "deleteBookmarkAction";
  stack3['sc_action'] = stack4;
  stack4 = "KG.bookmarksController.editMode";
  stack3['classBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(6, program6, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n							");
  stack1 = depth0;
  stack2 = "KG.EditBookmarkButtonView";
  stack3 = {};
  stack4 = "bookmark-edit-button";
  stack3['id'] = stack4;
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "white-button unselectable";
  stack3['class'] = stack4;
  stack4 = "editBookmarkAction";
  stack3['sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(8, program8, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("											\n						</div>\n						<div id=\"bookmark-collection\">\n						");
  stack1 = {};
  stack2 = "bookmark-list";
  stack1['id'] = stack2;
  stack2 = "KG.bookmarksController.content";
  stack1['contentBinding'] = stack2;
  stack2 = "KG.BookmarkItemView";
  stack1['itemViewClass'] = stack2;
  stack2 = "KG.bookmarksController.editMode";
  stack1['classBinding'] = stack2;
  stack2 = helpers.collection || depth0.collection;
  tmp1 = self.program(10, program10, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n						</div>\n					");
  return buffer;}
function program4(depth0,data) {
  
  
  data.buffer.push("\n								<div></div>\n							");}

function program6(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3;
  data.buffer.push("\n								");
  stack1 = depth0;
  stack2 = "_delete";
  stack3 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, tmp1); }
  else if(stack3=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack3; }
  data.buffer.push(escapeExpression(stack1) + "\n							");
  return buffer;}

function program8(depth0,data) {
  
  
  data.buffer.push("\n								<div></div>\n							");}

function program10(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("	\n								");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "bookmark-item-label";
  stack3['class'] = stack4;
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "selectBookmarkAction";
  stack3['sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(11, program11, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("								\n								");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "bookmark-item-author";
  stack3['class'] = stack4;
  stack4 = "span";
  stack3['tagName'] = stack4;
  stack4 = "selectBookmarkAction";
  stack3['sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(13, program13, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n								");
  stack1 = depth0;
  stack2 = "KG.BookmarkDeleteButtonView";
  stack3 = {};
  stack4 = "bookmark-delete check-delete-button unselectable";
  stack3['class'] = stack4;
  stack4 = "isChecked";
  stack3['classBinding'] = stack4;
  stack4 = "checkBookmarkAction";
  stack3['sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(15, program15, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n						");
  return buffer;}
function program11(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n									");
  stack1 = depth0;
  stack2 = "itemView.content.label";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n								");
  return buffer;}

function program13(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n									");
  stack1 = depth0;
  stack2 = "itemView.content.formattedDescription";
  stack3 = {};
  stack4 = "true";
  stack3['escaped'] = stack4;
  stack4 = helpers._triageMustache || depth0._triageMustache;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "_triageMustache", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n								");
  return buffer;}

function program15(depth0,data) {
  
  
  data.buffer.push("\n									<span>✓</span>\n								");}

  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "bookmark-button";
  stack3['id'] = stack4;
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "toggleBookmarkPopupAction";
  stack3['sc_action'] = stack4;
  stack4 = "header-button header-button-icon";
  stack3['class'] = stack4;
  stack4 = "KG.bookmarksController.activePopup";
  stack3['classBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  else { data.buffer.push(''); }
})