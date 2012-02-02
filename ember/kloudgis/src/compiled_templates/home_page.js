Ember.TEMPLATES["home-page"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var stack1, stack2, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n	<div id=\"home-header\">\n		");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "logout-button";
  stack3['id'] = stack4;
  stack4 = "logoutAction";
  stack3['sc_action'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(2, program2, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n		");
  stack1 = {};
  stack2 = "welcome-usr-label";
  stack1['id'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(4, program4, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n		");
  stack1 = {};
  stack2 = "home-error-message error-message";
  stack1['class'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(6, program6, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n	</div>\n	<div id=\"super-home-panel\">\n		");
  stack1 = depth0;
  stack2 = "KG.SandboxListView";
  stack3 = {};
  stack4 = "sandbox-list-panel";
  stack3['id'] = stack4;
  stack4 = "sandbox-list";
  stack3['templateName'] = stack4;
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
  stack1 = depth0;
  stack2 = "KG.AddSandboxView";
  stack3 = {};
  stack4 = "add-sandbox-panel";
  stack3['id'] = stack4;
  stack4 = "add-sandbox";
  stack3['templateName'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "view", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n	</div>\n");
  return buffer;}
function program2(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3;
  data.buffer.push("\n			");
  stack1 = depth0;
  stack2 = "_logout";
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

function program4(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n			");
  stack1 = depth0;
  stack2 = "KG.core_home.connectedUserLabel";
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
  data.buffer.push(escapeExpression(stack1) + "	\n		");
  return buffer;}

function program6(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n			");
  stack1 = depth0;
  stack2 = "KG.homePanelController.errorMessage";
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

  stack1 = {};
  stack2 = "main-home-view";
  stack1['id'] = stack2;
  stack2 = "main-panel";
  stack1['class'] = stack2;
  stack2 = "KG.pageController.homeHidden KG.pageController.homePushedLeft KG.pageController.homePushedRight";
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