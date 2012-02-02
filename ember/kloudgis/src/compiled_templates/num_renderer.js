Ember.TEMPLATES["num-renderer"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, stack2, stack3, stack4, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  
  data.buffer.push("\n	");}

  data.buffer.push("<span class=\"inspector-attr-name\">\n	");
  stack1 = depth0;
  stack2 = "itemView.content.label";
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
  data.buffer.push(escapeExpression(stack1) + "\n</span>	\n<div class=\"inspector-attr-value\">\n	");
  stack1 = depth0;
  stack2 = "KG.NumericTextField";
  stack3 = {};
  stack4 = "itemView.content.value";
  stack3['valueBinding'] = stack4;
  stack4 = "number";
  stack3['type'] = stack4;
  stack4 = "itemView.content.min";
  stack3['minBinding'] = stack4;
  stack4 = "itemView.content.max";
  stack3['maxBinding'] = stack4;
  stack4 = "itemView.content.step";
  stack3['stepBinding'] = stack4;
  stack4 = "KG.inspectorController.isReadOnly";
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
  data.buffer.push("\n</div>");
  return buffer;
})