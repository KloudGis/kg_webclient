Ember.TEMPLATES["sandbox-list"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, stack2, stack3, stack4, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n	");
  stack1 = depth0;
  stack2 = "titleString";
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
  data.buffer.push(escapeExpression(stack1) + "\n");
  return buffer;}

function program3(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n");
  stack1 = {};
  stack2 = "KG.sandboxesController";
  stack1['contentBinding'] = stack2;
  stack2 = "sandbox-list";
  stack1['class'] = stack2;
  stack2 = helpers.collection || depth0.collection;
  tmp1 = self.program(4, program4, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n	\n");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "create-sandbox-button";
  stack3['id'] = stack4;
  stack4 = "white-button";
  stack3['class'] = stack4;
  stack4 = "createSandboxAction";
  stack3['sc_action'] = stack4;
  stack4 = "KG.core_home.createSandboxTitle";
  stack3['titleBinding'] = stack4;
  stack4 = "KG.sandboxesController.recordsReady";
  stack3['isVisibleBinding'] = stack4;
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
  data.buffer.push("\n");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "delete-mode-button";
  stack3['id'] = stack4;
  stack4 = "white-button";
  stack3['class'] = stack4;
  stack4 = "toggleDeleteSandboxModeAction";
  stack3['sc_action'] = stack4;
  stack4 = "KG.core_home.deleteSandboxTitle";
  stack3['titleBinding'] = stack4;
  stack4 = "KG.sandboxesController.recordsReady";
  stack3['isVisibleBinding'] = stack4;
  stack4 = "KG.homePanelController.deleteMode";
  stack3['classBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(12, program12, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("	\n");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "delete-sandbox-button";
  stack3['id'] = stack4;
  stack4 = "red-button";
  stack3['class'] = stack4;
  stack4 = "deleteSandboxAction";
  stack3['sc_action'] = stack4;
  stack4 = "KG.homePanelController.deleteMode";
  stack3['classBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(14, program14, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;}
function program4(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n		");
  stack1 = depth0;
  stack2 = "KG.SandboxView";
  stack3 = {};
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "sandbox-list-item common-list-button";
  stack3['class'] = stack4;
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
  data.buffer.push("\n");
  return buffer;}
function program5(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n			");
  stack1 = depth0;
  stack2 = "KG.DeleteCheckboxView";
  stack3 = {};
  stack4 = "sb-item-check check-delete-button";
  stack3['class'] = stack4;
  stack4 = "checkSandboxAction";
  stack3['sc_action'] = stack4;
  stack4 = "isChecked isOwner";
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
  data.buffer.push("\n			");
  stack1 = {};
  stack2 = "span";
  stack1['tagName'] = stack2;
  stack2 = "sandbox-name";
  stack1['class'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(8, program8, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n			<div class=\"info-line\">\n				");
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
  data.buffer.push(escapeExpression(stack1) + "\n			</div>\n		");
  return buffer;}
function program6(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n				<span>✓</span> ");
  stack1 = depth0;
  stack2 = "_leave";
  stack3 = {};
  stack4 = "span";
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
  data.buffer.push(escapeExpression(stack1) + "\n			");
  return buffer;}

function program8(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n				");
  stack1 = depth0;
  stack2 = "itemView.content.name";
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
  data.buffer.push(escapeExpression(stack1) + "\n			");
  return buffer;}

function program10(depth0,data) {
  
  
  data.buffer.push("\n	<div></div>\n");}

function program12(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n	<div></div>\n	");
  stack1 = depth0;
  stack2 = "_cancel";
  stack3 = {};
  stack4 = "span";
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
  data.buffer.push(escapeExpression(stack1) + "\n");
  return buffer;}

function program14(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3;
  data.buffer.push("\n	");
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
  data.buffer.push(escapeExpression(stack1) + "\n");
  return buffer;}

  stack1 = depth0;
  stack2 = "KG.TitleView";
  stack3 = {};
  stack4 = "sandboxes-title";
  stack3['id'] = stack4;
  stack4 = "page-title";
  stack3['class'] = stack4;
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
  data.buffer.push("\n");
  stack1 = helpers.view || depth0.view;
  tmp1 = self.program(3, program3, data);
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack1, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("		");
  return buffer;
})