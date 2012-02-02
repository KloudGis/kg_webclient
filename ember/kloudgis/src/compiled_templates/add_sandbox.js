Ember.TEMPLATES["add-sandbox"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, stack2, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n	");
  stack1 = depth0;
  stack2 = "KG.homePanelController.addTitle";
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
  data.buffer.push("\n	<div>\n		");
  stack1 = depth0;
  stack2 = "KG.TextField";
  stack3 = {};
  stack4 = "_sandboxName";
  stack3['placeholder_not_loc'] = stack4;
  stack4 = "KG.addSandboxController.name";
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
  data.buffer.push(escapeExpression(stack1) + "	\n	</div>\n	");
  stack1 = depth0;
  stack2 = "_position";
  stack3 = {};
  stack4 = "field-label";
  stack3['class'] = stack4;
  stack4 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n	<div id=\"add-sandbox-map\"></div>\n	");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "white-button";
  stack3['class'] = stack4;
  stack4 = "cancelCreateAction";
  stack3['sc_action'] = stack4;
  stack4 = "KG.addSandboxController.cancelCreateTooltip";
  stack3['titleBinding'] = stack4;
  stack4 = "KG.homePanelController.createSandboxInProgress";
  stack3['disabledBinding'] = stack4;
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
  data.buffer.push("\n	");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "white-button";
  stack3['class'] = stack4;
  stack4 = "commitCreateAction";
  stack3['sc_action'] = stack4;
  stack4 = "KG.addSandboxController.commitCreateTooltip";
  stack3['titleBinding'] = stack4;
  stack4 = "KG.homePanelController.createSandboxInProgress";
  stack3['disabledBinding'] = stack4;
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
  data.buffer.push("\n");
  return buffer;}
function program4(depth0,data) {
  
  
  data.buffer.push("\n		<img src=\"css/images/cancel_30.png\">\n	");}

function program6(depth0,data) {
  
  
  data.buffer.push("\n		<img src=\"css/images/checkmark_30.png\">\n	");}

  stack1 = {};
  stack2 = "add-sandbox-title";
  stack1['id'] = stack2;
  stack2 = "page-title";
  stack1['class'] = stack2;
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
  data.buffer.push("\n");
  stack1 = {};
  stack2 = "inner-add-sandbox-panel";
  stack1['id'] = stack2;
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
  return buffer;
})