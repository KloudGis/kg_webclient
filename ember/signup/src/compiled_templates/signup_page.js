Ember.TEMPLATES["signup-page"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, stack2, stack3, stack4, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n							<label id=\"email-label\" for=\"user-textfield\">");
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
  data.buffer.push(escapeExpression(stack1) + "</label>\n							");
  stack1 = depth0;
  stack2 = "KG.ForwardTextField";
  stack3 = {};
  stack4 = "user-textfield";
  stack3['id'] = stack4;
  stack4 = "KG.userFieldController.value";
  stack3['valueBinding'] = stack4;
  stack4 = "email";
  stack3['type'] = stack4;
  stack4 = "_UserHint";
  stack3['placeholder_not_loc'] = stack4;
  stack4 = "false";
  stack3['spellcheck'] = stack4;
  stack4 = "off";
  stack3['autocorrect'] = stack4;
  stack4 = "off";
  stack3['autocapitalize'] = stack4;
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
  data.buffer.push("\n							<span>");
  stack1 = depth0;
  stack2 = "KG.userFieldController.errorMessage";
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
  data.buffer.push(escapeExpression(stack1) + "</span>						\n							");
  stack1 = depth0;
  stack2 = "KG.LoadingImageView";
  stack3 = {};
  stack4 = "KG.userFieldController.isBusy";
  stack3['isVisibleBinding'] = stack4;
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
  data.buffer.push("\n						");
  return buffer;}
function program2(depth0,data) {
  
  
  data.buffer.push("\n							");}

function program4(depth0,data) {
  
  var buffer = '', stack1, stack2;
  data.buffer.push("\n								<img ");
  stack1 = {};
  stack2 = "loadingImage";
  stack1['src'] = stack2;
  stack2 = helpers.bindAttr || depth0.bindAttr;
  tmp1 = {};
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else if(stack2=== undef) { stack1 = helperMissing.call(depth0, "bindAttr", tmp1); }
  else { stack1 = stack2; }
  data.buffer.push(escapeExpression(stack1) + " alt=\"Loading\"/>\n							");
  return buffer;}

function program6(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n							<label id=\"pwd-label\" for=\"pwd-textfield\">");
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
  data.buffer.push(escapeExpression(stack1) + "</label>\n							");
  stack1 = depth0;
  stack2 = "KG.ForwardTextField";
  stack3 = {};
  stack4 = "pwd-textfield";
  stack3['id'] = stack4;
  stack4 = "KG.pwdFieldController.value";
  stack3['valueBinding'] = stack4;
  stack4 = "password";
  stack3['type'] = stack4;
  stack4 = "_PwdHint";
  stack3['placeholder_not_loc'] = stack4;
  stack4 = "false";
  stack3['spellcheck'] = stack4;
  stack4 = "off";
  stack3['autocorrect'] = stack4;
  stack4 = "off";
  stack3['autocapitalize'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(7, program7, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n							<span>");
  stack1 = depth0;
  stack2 = "KG.pwdFieldController.errorMessage";
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
  data.buffer.push(escapeExpression(stack1) + "</span>						\n						");
  return buffer;}
function program7(depth0,data) {
  
  
  data.buffer.push("\n							");}

function program9(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n							<label id=\"name-label\" for=\"name-textfield\">");
  stack1 = depth0;
  stack2 = "_name";
  stack3 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, tmp1); }
  else if(stack3=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack3; }
  data.buffer.push(escapeExpression(stack1) + "</label>\n							");
  stack1 = depth0;
  stack2 = "KG.ForwardTextField";
  stack3 = {};
  stack4 = "name-textfield";
  stack3['id'] = stack4;
  stack4 = "KG.nameFieldController.value";
  stack3['valueBinding'] = stack4;
  stack4 = "text";
  stack3['type'] = stack4;
  stack4 = "_NameHint";
  stack3['placeholder_not_loc'] = stack4;
  stack4 = "false";
  stack3['spellcheck'] = stack4;
  stack4 = "off";
  stack3['autocorrect'] = stack4;
  stack4 = "off";
  stack3['autocapitalize'] = stack4;
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
  data.buffer.push("\n							<span>");
  stack1 = depth0;
  stack2 = "KG.nameFieldController.errorMessage";
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
  data.buffer.push(escapeExpression(stack1) + "</span>					\n						");
  return buffer;}
function program10(depth0,data) {
  
  
  data.buffer.push("\n							");}

function program12(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n							<label id=\"company-label\" for=\"company-textfield\">");
  stack1 = depth0;
  stack2 = "_company";
  stack3 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, tmp1); }
  else if(stack3=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack3; }
  data.buffer.push(escapeExpression(stack1) + "</label>\n							");
  stack1 = depth0;
  stack2 = "KG.ForwardTextField";
  stack3 = {};
  stack4 = "company-textfield";
  stack3['id'] = stack4;
  stack4 = "KG.companyFieldController.value";
  stack3['valueBinding'] = stack4;
  stack4 = "text";
  stack3['type'] = stack4;
  stack4 = "_CompanyHint";
  stack3['placeholder_not_loc'] = stack4;
  stack4 = "false";
  stack3['spellcheck'] = stack4;
  stack4 = "off";
  stack3['autocorrect'] = stack4;
  stack4 = "off";
  stack3['autocapitalize'] = stack4;
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
  data.buffer.push("\n							<span>");
  stack1 = depth0;
  stack2 = "KG.companyFieldController.errorMessage";
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
  data.buffer.push(escapeExpression(stack1) + "</span>				\n						");
  return buffer;}
function program13(depth0,data) {
  
  
  data.buffer.push("\n							");}

function program15(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n							<label id=\"location-label\" for=\"location-textfield\">");
  stack1 = depth0;
  stack2 = "_location";
  stack3 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, tmp1); }
  else if(stack3=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack3; }
  data.buffer.push(escapeExpression(stack1) + "</label>\n							");
  stack1 = depth0;
  stack2 = "KG.ForwardTextField";
  stack3 = {};
  stack4 = "location-textfield";
  stack3['id'] = stack4;
  stack4 = "KG.locationFieldController.value";
  stack3['valueBinding'] = stack4;
  stack4 = "text";
  stack3['type'] = stack4;
  stack4 = "_LocationHint";
  stack3['placeholder_not_loc'] = stack4;
  stack4 = "false";
  stack3['spellcheck'] = stack4;
  stack4 = "off";
  stack3['autocorrect'] = stack4;
  stack4 = "off";
  stack3['autocapitalize'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = self.program(16, program16, data);
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack4, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n							<span>");
  stack1 = depth0;
  stack2 = "KG.locationFieldController.errorMessage";
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
  data.buffer.push(escapeExpression(stack1) + "</span>						\n						");
  return buffer;}
function program16(depth0,data) {
  
  
  data.buffer.push("\n							");}

function program18(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3;
  data.buffer.push("\n                            ");
  stack1 = depth0;
  stack2 = "_createAccount";
  stack3 = helpers.loc || depth0.loc;
  tmp1 = {};
  tmp1.hash = {};
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, tmp1); }
  else if(stack3=== undef) { stack1 = helperMissing.call(depth0, "loc", stack2, tmp1); }
  else { stack1 = stack3; }
  data.buffer.push(escapeExpression(stack1) + "						\n						");
  return buffer;}

function program20(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n							<span>");
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
  data.buffer.push(escapeExpression(stack1) + "</span>\n						");
  return buffer;}

  data.buffer.push("<a  id=\"kloud-logo\" href=\"/kloudgis\">\n			<img src=\"css/images/kloudgis_black_128.png\" alt=\"Kloudgis\"/>\n		</a>\n		<span id=\"kloud-welcome\">");
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
  data.buffer.push(escapeExpression(stack1) + "	</span>\n		<div class=\"signup-pane\">\n			<table>\n			<tr class=\"section\">\n					<td>\n						");
  stack1 = depth0;
  stack2 = "KG.SignupField";
  stack3 = {};
  stack4 = "user-field";
  stack3['id'] = stack4;
  stack4 = "focus hasError";
  stack3['classBinding'] = stack4;
  stack4 = "KG.userFieldController.hasError";
  stack3['hasErrorBinding'] = stack4;
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
  data.buffer.push("	\n					</td>\n			</tr>\n			<tr class=\"section\">\n					<td>\n						");
  stack1 = depth0;
  stack2 = "KG.SignupField";
  stack3 = {};
  stack4 = "pwd-field";
  stack3['id'] = stack4;
  stack4 = "focus hasError";
  stack3['classBinding'] = stack4;
  stack4 = "KG.pwdFieldController.hasError";
  stack3['hasErrorBinding'] = stack4;
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
  data.buffer.push("	\n					</td>\n			</tr>\n			<tr class=\"section\">\n					<td>\n						");
  stack1 = depth0;
  stack2 = "KG.SignupField";
  stack3 = {};
  stack4 = "name-field";
  stack3['id'] = stack4;
  stack4 = "focus hasError";
  stack3['classBinding'] = stack4;
  stack4 = "KG.nameFieldController.hasError";
  stack3['hasErrorBinding'] = stack4;
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
  data.buffer.push("	\n					</td>\n			</tr>\n			<tr class=\"section\">\n					<td>\n						");
  stack1 = depth0;
  stack2 = "KG.SignupField";
  stack3 = {};
  stack4 = "company-field";
  stack3['id'] = stack4;
  stack4 = "focus hasError";
  stack3['classBinding'] = stack4;
  stack4 = "KG.companyFieldController.hasError";
  stack3['hasErrorBinding'] = stack4;
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
  data.buffer.push("	\n					</td>\n			</tr>\n			<tr class=\"section\">\n					<td>\n						");
  stack1 = depth0;
  stack2 = "KG.SignupField";
  stack3 = {};
  stack4 = "location-field";
  stack3['id'] = stack4;
  stack4 = "focus hasError";
  stack3['classBinding'] = stack4;
  stack4 = "KG.locationFieldController.hasError";
  stack3['hasErrorBinding'] = stack4;
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
  data.buffer.push("	\n					</td>\n			</tr>	\n			<tr class=\"section\">\n					<td>\n						");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "createAccountAction";
  stack3['sc_action'] = stack4;
  stack4 = "create-button";
  stack3['id'] = stack4;
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
  data.buffer.push("\n					</td>\n			</tr>\n			<tr class=\"section\">\n					<td>\n						");
  stack1 = {};
  stack2 = "KG.core_signup.globalError";
  stack1['messageBinding'] = stack2;
  stack2 = "global-error";
  stack1['id'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(20, program20, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n					</td>\n			</tr>\n			</table>\n		</div>");
  return buffer;
})