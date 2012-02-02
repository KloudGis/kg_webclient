Ember.TEMPLATES["page-header"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var stack1, stack2, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n	");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "active-sandbox-button";
  stack3['id'] = stack4;
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "header-button";
  stack3['class'] = stack4;
  stack4 = "yes";
  stack3['disabled'] = stack4;
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
  data.buffer.push("\n	");
  stack1 = {};
  stack2 = "active-user-panel";
  stack1['templateName'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = {};
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else if(stack2=== undef) { stack1 = helperMissing.call(depth0, "view", tmp1); }
  else { stack1 = stack2; }
  data.buffer.push(escapeExpression(stack1) + "\n	");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "palette-button";
  stack3['id'] = stack4;
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "header-button header-button-icon";
  stack3['class'] = stack4;
  stack4 = "showPaletteAction";
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
  data.buffer.push("\n	");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "create-note-button";
  stack3['id'] = stack4;
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "header-button header-button-icon";
  stack3['class'] = stack4;
  stack4 = "createNoteAction";
  stack3['sc_action'] = stack4;
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
  data.buffer.push("\n	");
  stack1 = {};
  stack2 = "notification-panel";
  stack1['templateName'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = {};
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else if(stack2=== undef) { stack1 = helperMissing.call(depth0, "view", tmp1); }
  else { stack1 = stack2; }
  data.buffer.push(escapeExpression(stack1) + "\n	\n	");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "search-button";
  stack3['id'] = stack4;
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "toogleSearchPopopAction";
  stack3['sc_action'] = stack4;
  stack4 = "header-button header-button-icon";
  stack3['class'] = stack4;
  stack4 = "KG.searchController.activePopup";
  stack3['classBinding'] = stack4;
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
  data.buffer.push("\n	\n	");
  stack1 = {};
  stack2 = "bookmark-panel";
  stack1['templateName'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = {};
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else if(stack2=== undef) { stack1 = helperMissing.call(depth0, "view", tmp1); }
  else { stack1 = stack2; }
  data.buffer.push(escapeExpression(stack1) + "\n");
  return buffer;}
function program2(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n		<div class=\"message-label\"><span class=\"label-ellipsis\">");
  stack1 = depth0;
  stack2 = "KG.core_sandbox.sandboxLabel";
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
  data.buffer.push(escapeExpression(stack1) + "</span></div>\n	");
  return buffer;}

function program4(depth0,data) {
  
  
  data.buffer.push("\n		<img src=\"css/images/palette.png\">\n	");}

function program6(depth0,data) {
  
  
  data.buffer.push("\n		<img src=\"css/images/note.png\">\n	");}

function program8(depth0,data) {
  
  
  data.buffer.push("\n			<span class=\"button-image\"><span>\n	");}

  stack1 = {};
  stack2 = "header";
  stack1['tagName'] = stack2;
  stack2 = "sandbox-header";
  stack1['id'] = stack2;
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