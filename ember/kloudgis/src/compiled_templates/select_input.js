Ember.TEMPLATES["select-input"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var stack1, stack2, stack3, stack4, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2, stack3, stack4;
  data.buffer.push("\n	");
  stack1 = {};
  stack2 = "select";
  stack1['templateName'] = stack2;
  stack2 = "content";
  stack1['contentBinding'] = stack2;
  stack2 = "valueSelect";
  stack1['valueBinding'] = stack2;
  stack2 = "disabled";
  stack1['disabledBinding'] = stack2;
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
  stack2 = "Ember.TextField";
  stack3 = {};
  stack4 = "valueInput";
  stack3['valueBinding'] = stack4;
  stack4 = "inputClass";
  stack3['classNameBindings'] = stack4;
  stack4 = "disabled";
  stack3['disabledBinding'] = stack4;
  stack4 = helpers.view || depth0.view;
  tmp1 = {};
  tmp1.hash = stack3;
  tmp1.contexts = [];
  tmp1.contexts.push(stack1);
  tmp1.data = data;
  if(typeof stack4 === functionType) { stack1 = stack4.call(depth0, stack2, tmp1); }
  else if(stack4=== undef) { stack1 = helperMissing.call(depth0, "view", stack2, tmp1); }
  else { stack1 = stack4; }
  data.buffer.push(escapeExpression(stack1) + "\n");
  return buffer;}

  stack1 = depth0;
  stack2 = "KG.SelectInputView";
  stack3 = {};
  stack4 = "content";
  stack3['contentBinding'] = stack4;
  stack4 = "value";
  stack3['valueBinding'] = stack4;
  stack4 = "disabled";
  stack3['disabledBinding'] = stack4;
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