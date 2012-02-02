Ember.TEMPLATES["active-note-popup"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var stack1, stack2, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("	\n	");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "yes";
  stack3['manualMouseDown'] = stack4;
  stack4 = "note-zoom-button";
  stack3['class'] = stack4;
  stack4 = "KG.activeNoteController.isOldRecord";
  stack3['isVisibleBinding'] = stack4;
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "zoomNoteAction";
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
  data.buffer.push("	\n	");
  stack1 = {};
  stack2 = "note-date-label";
  stack1['class'] = stack2;
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
  data.buffer.push("			\n	<span>");
  stack1 = depth0;
  stack2 = "KG.activeNoteController.titleLabel";
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
  data.buffer.push(escapeExpression(stack1) + "</span>\n	");
  stack1 = depth0;
  stack2 = "KG.TextField";
  stack3 = {};
  stack4 = "KG.activeNoteController.titleValue";
  stack3['valueBinding'] = stack4;
  stack4 = "KG.activeNoteController.isDisabled";
  stack3['disabledBinding'] = stack4;
  stack4 = "text";
  stack3['type'] = stack4;
  stack4 = "_noteTitlePlaceholder";
  stack3['placeholder_not_loc'] = stack4;
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
  data.buffer.push("\n	<span>");
  stack1 = depth0;
  stack2 = "KG.activeNoteController.descriptionLabel";
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
  data.buffer.push(escapeExpression(stack1) + "</span>\n	");
  stack1 = depth0;
  stack2 = "KG.TextArea";
  stack3 = {};
  stack4 = "note-description-area";
  stack3['id'] = stack4;
  stack4 = "KG.activeNoteController.isDisabled";
  stack3['disabledBinding'] = stack4;
  stack4 = "KG.activeNoteController*content.description";
  stack3['valueBinding'] = stack4;
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
  data.buffer.push("\n	");
  stack1 = {};
  stack2 = "active-note-popup-bottom";
  stack1['class'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(10, program10, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n	");
  stack1 = {};
  stack2 = "note-comments";
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
  
  
  data.buffer.push("\n		<a href=\"javascript:void(0)\">zoom</a>\n	");}

function program4(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n		");
  stack1 = depth0;
  stack2 = "KG.activeNoteController.content.formattedDate";
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
  data.buffer.push(escapeExpression(stack1) + "\n	");
  return buffer;}

function program6(depth0,data) {
  
  
  data.buffer.push("\n	");}

function program8(depth0,data) {
  
  
  data.buffer.push("\n	");}

function program10(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n		");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "yes";
  stack3['manualMouseDown'] = stack4;
  stack4 = "KG.activeNoteController.isUpdateVisible";
  stack3['isVisibleBinding'] = stack4;
  stack4 = "white-button";
  stack3['class'] = stack4;
  stack4 = "confirmNoteAction";
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
  data.buffer.push("		\n		");
  stack1 = depth0;
  stack2 = "KG.Button";
  stack3 = {};
  stack4 = "yes";
  stack3['manualMouseDown'] = stack4;
  stack4 = "KG.activeNoteController.isDeleteVisible";
  stack3['isVisibleBinding'] = stack4;
  stack4 = "red-button";
  stack3['class'] = stack4;
  stack4 = "deleteNoteAction";
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
  data.buffer.push("\n		");
  stack1 = {};
  stack2 = "note-author-label";
  stack1['class'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = self.program(15, program15, data);
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.fn = tmp1;
  tmp1.inverse = self.noop;
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else { stack1 = blockHelperMissing.call(depth0, stack2, tmp1); }
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n	");
  return buffer;}
function program11(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n			");
  stack1 = depth0;
  stack2 = "KG.activeNoteController.confirmLabel";
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

function program13(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n			");
  stack1 = depth0;
  stack2 = "KG.activeNoteController.deleteLabel";
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

function program15(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n			");
  stack1 = depth0;
  stack2 = "KG.activeNoteController.content.authorFormatted";
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
  stack2 = "active-note-popup";
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
  else { data.buffer.push(''); }
})