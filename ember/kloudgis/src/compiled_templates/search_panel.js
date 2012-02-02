Ember.TEMPLATES["search-panel"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var stack1, stack2, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n				");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "x-button search-close-button";
  stack3['class'] = stack4;
  stack4 = "toogleSearchPopopAction";
  stack3['sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "view", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n				");
  stack1 = {};
  stack2 = "search-popup";
  stack1['id'] = stack2;
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
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n					");
  stack1 = depth0;
  stack2 = "KG.SearchField";
  stack3 = {};
  stack4 = "KG.searchController.searchHistorySize";
  stack3['resultsBinding'] = stack4;
  stack4 = "_search";
  stack3['placeholder_not_loc'] = stack4;
  stack4 = "KG.searchController.searchValue";
  stack3['valueBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "view", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n						");
  stack1 = {};
  stack2 = "KG.searchController";
  stack1['contentBinding'] = stack2;
  stack2 = "KG.searchController.hasResults";
  stack1['isVisibleBinding'] = stack2;
  stack2 = "search-cat-list";
  stack1['class'] = stack2;
  stack2 = "KG.RecordsButtonView";
  stack1['itemViewClass'] = stack2;
  stack2 = helpers.collection || depth0.collection;
  tmp1 = self.program(3, program3, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n						");
  stack1 = {};
  stack2 = "KG.core_search.plugins";
  stack1['contentBinding'] = stack2;
  stack2 = "KG.core_search.searchAsked";
  stack1['isVisibleBinding'] = stack2;
  stack2 = "search-cat-list";
  stack1['class'] = stack2;
  stack2 = "KG.PluginRecordsButtonView";
  stack1['itemViewClass'] = stack2;
  stack2 = helpers.collection || depth0.collection;
  tmp1 = self.program(17, program17, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n				");
  return buffer;}
function program3(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("		\n							");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "search-cat-item common-list-button";
  stack3['class'] = stack4;
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "selectSearchCategoryAction";
  stack3['sc_action'] = stack4;
  stack4 = "recordsVisible";
  stack3['recordsVisibleBinding'] = stack4;
  stack4 = "recordsVisible";
  stack3['classBinding'] = stack4;
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
  data.buffer.push("\n							<div class=\"super-result-list\">\n								");
  stack1 = {};
  stack2 = "records";
  stack1['contentBinding'] = stack2;
  stack2 = "search-result-list";
  stack1['class'] = stack2;
  stack2 = "recordsVisible";
  stack1['recordsVisibleBinding'] = stack2;
  stack2 = "recordsVisible";
  stack1['classBinding'] = stack2;
  stack2 = helpers.collection || depth0.collection;
  tmp1 = self.program(9, program9, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n								<div class=\"more-panel\">\n									");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "white-button search-more-result";
  stack3['class'] = stack4;
  stack4 = "hasMoreResult";
  stack3['isVisibleBinding'] = stack4;
  stack4 = "showMoreResultsAction";
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
  data.buffer.push("\n								</div>\n							</div>\n						");
  return buffer;}
function program4(depth0,data) {
  
  var buffer = '', stack1, stack2;
  data.buffer.push("\n								");
  stack1 = {};
  stack2 = "cat-title-label label-ellipsis";
  stack1['class'] = stack2;
  stack2 = "itemView.content.title";
  stack1['titleBinding'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(5, program5, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("											\n								");
  stack1 = {};
  stack2 = "cat-size-label label-ellipsis capsule-label";
  stack1['class'] = stack2;
  stack2 = "span";
  stack1['tagName'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(7, program7, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n							");
  return buffer;}
function program5(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n									");
  stack1 = depth0;
  stack2 = "itemView.content.title";
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

function program7(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n									");
  stack1 = depth0;
  stack2 = "itemView.content.count";
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

function program9(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n									");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "search-record-item common-list-button";
  stack3['class'] = stack4;
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "featureZoomAction";
  stack3['sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(10, program10, data);
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
  return buffer;}
function program10(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n										");
  stack1 = {};
  stack2 = "label-ellipsis";
  stack1['class'] = stack2;
  stack2 = "itemView.content.title";
  stack1['titleBinding'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(11, program11, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n										");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "itemView.content.isSelectable";
  stack3['isVisibleBinding'] = stack4;
  stack4 = "search-select";
  stack3['class'] = stack4;
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "selectFeatureInspectorAction";
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
  data.buffer.push("\n									");
  return buffer;}
function program11(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n											");
  stack1 = depth0;
  stack2 = "itemView.content.title";
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
  data.buffer.push(escapeExpression(stack1) + "\n										");
  return buffer;}

function program13(depth0,data) {
  
  
  data.buffer.push("	\n											<img src=\"css/images/right_arrow_24.png\"/>		\n											");}

function program15(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3;
  data.buffer.push("\n										");
  stack1 = depth0;
  stack2 = "_showMore";
  stack3 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, tmp1); }
  else if(stack3=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack3; }
  data.buffer.push(escapeExpression(stack1) + "\n									");
  return buffer;}

function program17(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n							");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "search-plugin-item common-list-button";
  stack3['class'] = stack4;
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "selectSearchPluginAction";
  stack3['sc_action'] = stack4;
  stack4 = "recordsVisible";
  stack3['recordsVisibleBinding'] = stack4;
  stack4 = "recordsVisible";
  stack3['classBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(18, program18, data);
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
  stack1 = {};
  stack2 = "records";
  stack1['contentBinding'] = stack2;
  stack2 = "search-result-list";
  stack1['class'] = stack2;
  stack2 = "recordsVisible";
  stack1['recordsVisibleBinding'] = stack2;
  stack2 = "recordsVisible";
  stack1['classBinding'] = stack2;
  stack2 = helpers.collection || depth0.collection;
  tmp1 = self.program(21, program21, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n						");
  return buffer;}
function program18(depth0,data) {
  
  var buffer = '', stack1, stack2;
  data.buffer.push("\n								");
  stack1 = {};
  stack2 = "plugin-title-label label-ellipsis";
  stack1['class'] = stack2;
  stack2 = "itemView.content.title";
  stack1['titleBinding'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(19, program19, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n							");
  return buffer;}
function program19(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n									");
  stack1 = depth0;
  stack2 = "itemView.content.title";
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

function program21(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n								");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "search-record-item common-list-button";
  stack3['class'] = stack4;
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "featureZoomAction";
  stack3['sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(22, program22, data);
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
  return buffer;}
function program22(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n									");
  stack1 = {};
  stack2 = "label-ellipsis";
  stack1['class'] = stack2;
  stack2 = "itemView.content.title";
  stack1['titleBinding'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(23, program23, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n									");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "itemView.content.hasCreateNote";
  stack3['isVisibleBinding'] = stack4;
  stack4 = "search-create-note";
  stack3['class'] = stack4;
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "createNoteFromFeatureAction";
  stack3['sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(25, program25, data);
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
  return buffer;}
function program23(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n										");
  stack1 = depth0;
  stack2 = "itemView.content.title";
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
  data.buffer.push(escapeExpression(stack1) + "\n									");
  return buffer;}

function program25(depth0,data) {
  
  
  data.buffer.push("	\n										<img src=\"css/images/note_black.png\"/>		\n									");}

  stack1 = {};
  stack2 = "super-search-popup";
  stack1['id'] = stack2;
  stack2 = "KG.searchController.activePopup";
  stack1['classBinding'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(1, program1, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  else { data.buffer.push(''); }
})