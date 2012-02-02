Ember.TEMPLATES["bool-renderer"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, stack2, stack3, stack4, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


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
  data.buffer.push(escapeExpression(stack1) + "\n</span>	\n");
  stack1 = {};
  stack2 = "switch";
  stack1['templateName'] = stack2;
  stack2 = "inspector-attr-value";
  stack1['class'] = stack2;
  stack2 = "itemView.content.value";
  stack1['contentBinding'] = stack2;
  stack2 = "KG.inspectorController.isReadOnly";
  stack1['disabledBinding'] = stack2;
  stack2 = helpers.view || depth0.view;
  tmp1 = {};
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else if(stack2=== undef) { stack1 = helperMissing.call(depth0, "view", tmp1); }
  else { stack1 = stack2; }
  data.buffer.push(escapeExpression(stack1));
  return buffer;
})