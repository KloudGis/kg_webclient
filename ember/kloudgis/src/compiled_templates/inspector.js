Ember.TEMPLATES["inspector"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var stack1, stack2, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n	");
  stack1 = {};
  stack2 = "inspector-title";
  stack1['id'] = stack2;
  stack2 = "header";
  stack1['tagName'] = stack2;
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
  data.buffer.push("	\n	<div id=\"inspector-panel\">						\n		");
  stack1 = {};
  stack2 = "KG.inspectorController";
  stack1['contentBinding'] = stack2;
  stack2 = "inspector-attrs-list";
  stack1['class'] = stack2;
  stack2 = helpers.collection || depth0.collection;
  tmp1 = self.program(7, program7, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("	\n		<div id=\"comment-super-panel\">\n		</div>			\n		");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "delete-feature red-button";
  stack3['class'] = stack4;
  stack4 = "deleteFeatureInspectorAction";
  stack3['sc_action'] = stack4;
  stack4 = "KG.inspectorController.deleteTitle";
  stack3['titleBinding'] = stack4;
  stack4 = "KG.inspectorController.isWriteable";
  stack3['isVisibleBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(9, program9, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("													\n	</div>				\n");
  return buffer;}
function program2(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n		");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "ios-button ios-tb-left";
  stack3['class'] = stack4;
  stack4 = "KG.inspectorController.isDirty";
  stack3['isVisibleBinding'] = stack4;
  stack4 = "cancelInspectorAction";
  stack3['sc_action'] = stack4;
  stack4 = "KG.inspectorController.cancelTitle";
  stack3['titleBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(3, program3, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n		<h1 class=\"label-ellipsis\" ");
  stack1 = {};
  stack2 = "KG.inspectorController.title";
  stack1['title'] = stack2;
  stack2 = helpers.bindAttr || depth0.bindAttr;
  tmp1 = {};
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else if(stack2=== undef) { stack1 = helperMissing.call(depth0, "bindAttr", tmp1); }
  else { stack1 = stack2; }
  data.buffer.push(escapeExpression(stack1) + ">");
  stack1 = depth0;
  stack2 = "KG.inspectorController.title";
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
  data.buffer.push(escapeExpression(stack1) + "</h1>\n		");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "ios-button ios-tb-right";
  stack3['class'] = stack4;
  stack4 = "closeInspectorAction";
  stack3['sc_action'] = stack4;
  stack4 = "KG.inspectorController.saveTitle";
  stack3['titleBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(5, program5, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("			\n	");
  return buffer;}
function program3(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3;
  data.buffer.push("\n			");
  stack1 = depth0;
  stack2 = "_cancel";
  stack3 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, tmp1); }
  else if(stack3=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack3; }
  data.buffer.push(escapeExpression(stack1) + "\n		");
  return buffer;}

function program5(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n			");
  stack1 = depth0;
  stack2 = "KG.inspectorController.saveLabel";
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
  data.buffer.push(escapeExpression(stack1) + "\n		");
  return buffer;}

function program7(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n			");
  stack1 = depth0;
  stack2 = "KG.InspectorAttributeView";
  stack3 = {};
  stack4 = "inspector-list-item";
  stack3['class'] = stack4;
  stack4 = "itemView.content.css_class";
  stack3['classBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "view", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n		");
  return buffer;}

function program9(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3;
  data.buffer.push("\n			");
  stack1 = depth0;
  stack2 = "_Delete";
  stack3 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, tmp1); }
  else if(stack3=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack3; }
  data.buffer.push(escapeExpression(stack1) + "\n		");
  return buffer;}

  stack1 = {};
  stack2 = "super-inspector";
  stack1['id'] = stack2;
  stack2 = "KG.inspectorController.active";
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