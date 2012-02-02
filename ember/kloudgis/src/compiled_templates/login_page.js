Ember.TEMPLATES["login-page"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, stack2, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n	<div>\n		<a id=\"kloud-logo\">\n			<img src=\"css/images/kloudgis_black_128.png\" alt=\"Kloudgis\"/>\n		</a>		\n		<a id=\"kloud-brand\">Kloudgis</a>\n	<div class=\"login-pane\">\n		<table>\n		<tr>\n		<td>\n			<label id=\"email-label\" for=\"user-field\">");
  stack1 = depth0;
  stack2 = "_email";
  stack3 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, tmp1); }
  else if(stack3=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack3; }
  data.buffer.push(escapeExpression(stack1) + "</label>\n		</td>\n		<td>\n			");
  stack1 = depth0;
  stack2 = "KG.TextField";
  stack3 = {};
  stack4 = "user-field";
  stack3['id'] = stack4;
  stack4 = "KG.credential.user";
  stack3['valueBinding'] = stack4;
  stack4 = "email";
  stack3['type'] = stack4;
  stack4 = "_UsernameHint";
  stack3['placeholder_not_loc'] = stack4;
  stack4 = "false";
  stack3['spellcheck'] = stack4;
  stack4 = "off";
  stack3['autocorrect'] = stack4;
  stack4 = "off";
  stack3['autocapitalize'] = stack4;
  stack4 = "on";
  stack3['autocomplete'] = stack4;
  stack4 = "loginAction";
  stack3['nl_sc_action'] = stack4;
  stack4 = "true";
  stack3['autofocus'] = stack4;
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
  data.buffer.push("	\n			</td>\n		<tr>\n		<td>\n			<label id=\"pwd-label\" for=\"pwd-field\">");
  stack1 = depth0;
  stack2 = "_pwd";
  stack3 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, tmp1); }
  else if(stack3=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack3; }
  data.buffer.push(escapeExpression(stack1) + "</label>\n			</td>\n			<td>\n			");
  stack1 = depth0;
  stack2 = "KG.TextField";
  stack3 = {};
  stack4 = "pwd-field";
  stack3['id'] = stack4;
  stack4 = "KG.credential.pwd";
  stack3['valueBinding'] = stack4;
  stack4 = "password";
  stack3['type'] = stack4;
  stack4 = "_PasswordHint";
  stack3['placeholder_not_loc'] = stack4;
  stack4 = "false";
  stack3['spellcheck'] = stack4;
  stack4 = "off";
  stack3['autocorrect'] = stack4;
  stack4 = "off";
  stack3['autocapitalize'] = stack4;
  stack4 = "on";
  stack3['autocomplete'] = stack4;
  stack4 = "loginAction";
  stack3['nl_sc_action'] = stack4;
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
  data.buffer.push("\n			</td>\n		</div>\n		<tr id=\"login-button-row\">\n		<td>\n		</td>\n		<td>	\n			");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "loginAction";
  stack3['sc_action'] = stack4;
  stack4 = "login-button";
  stack3['id'] = stack4;
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
  data.buffer.push("\n		</td>\n		</table>\n		");
  stack1 = depth0;
  stack2 = "SC.Checkbox";
  stack3 = {};
  stack4 = "remember-me";
  stack3['id'] = stack4;
  stack4 = "KG.core_login.rememberMeLabel";
  stack3['titleBinding'] = stack4;
  stack4 = "KG.core_login.rememberMe";
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
  data.buffer.push(escapeExpression(stack1) + "\n		");
  stack1 = {};
  stack2 = "error-message";
  stack1['class'] = stack2;
  stack2 = "KG.core_login.errorMessage";
  stack1['messageBinding'] = stack2;
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
  data.buffer.push("\n	</div>	\n	<div id=\"signup-box\">\n		<span id=\"signup-title\">");
  stack1 = depth0;
  stack2 = "_signupTitle";
  stack3 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, tmp1); }
  else if(stack3=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack3; }
  data.buffer.push(escapeExpression(stack1) + "</span>\n		");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "signupAction";
  stack3['sc_action'] = stack4;
  stack4 = "signup-button";
  stack3['id'] = stack4;
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
  data.buffer.push("\n	</div>\n");
  return buffer;}
function program2(depth0,data) {
  
  
  data.buffer.push("\n			");}

function program4(depth0,data) {
  
  
  data.buffer.push("\n			");}

function program6(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3;
  data.buffer.push("\n				");
  stack1 = depth0;
  stack2 = "_login";
  stack3 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, tmp1); }
  else if(stack3=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack3; }
  data.buffer.push(escapeExpression(stack1) + "\n			");
  return buffer;}

function program8(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n			");
  stack1 = depth0;
  stack2 = "message";
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
  data.buffer.push(escapeExpression(stack1) + " \n		");
  return buffer;}

function program10(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3;
  data.buffer.push("	\n			");
  stack1 = depth0;
  stack2 = "_signup";
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
  stack2 = "main-login-view";
  stack1['id'] = stack2;
  stack2 = "main-panel";
  stack1['class'] = stack2;
  stack2 = "KG.pageController.loginHidden KG.pageController.loginPushedLeft KG.pageController.loginPushedRight";
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
  data.buffer.push("	\n");
  return buffer;
})