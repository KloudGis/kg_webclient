Ember.TEMPLATES["info-popup"] =Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
helpers = helpers || Ember.Handlebars.helpers;
  var buffer = '', stack1, stack2, stack3, stack4, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = '', stack1, stack2;
  data.buffer.push("	\n	<img ");
  stack1 = {};
  stack2 = "logo";
  stack1['src'] = stack2;
  stack2 = helpers.bindAttr || depth0.bindAttr;
  tmp1 = {};
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else if(stack2=== undef) { stack1 = helperMissing.call(depth0, "bindAttr", tmp1); }
  else { stack1 = stack2; }
  data.buffer.push(escapeExpression(stack1) + "/>		\n");
  return buffer;}

  stack1 = {};
  stack2 = "KG.infoController.allButFirst";
  stack1['contentBinding'] = stack2;
  stack2 = "KG.infoController.listVisible";
  stack1['isVisibleBinding'] = stack2;
  stack2 = "popup-info-list";
  stack1['class'] = stack2;
  stack2 = "KG.FeatureInfoPopupItemView";
  stack1['itemViewClass'] = stack2;
  stack2 = helpers.collection || depth0.collection;
  tmp1 = {};
  tmp1.hash = stack1;
  tmp1.contexts = [];
  tmp1.data = data;
  if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, tmp1); }
  else if(stack2=== undef) { stack1 = helperMissing.call(depth0, "collection", tmp1); }
  else { stack1 = stack2; }
  data.buffer.push(escapeExpression(stack1) + "	\n");
  stack1 = depth0;
  stack2 = "KG.FeatureInfoPopupItemView";
  stack3 = {};
  stack4 = "KG.infoController.firstFeature";
  stack3['contentBinding'] = stack4;
  stack4 = "master-row";
  stack3['class'] = stack4;
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
  stack1 = depth0;
  stack2 = "KG.ExpandButtonView";
  stack3 = {};
  stack4 = "div";
  stack3['tagName'] = stack4;
  stack4 = "popup-info-expand-button";
  stack3['class'] = stack4;
  stack4 = "KG.infoController.multipleFeatures";
  stack3['isVisibleBinding'] = stack4;
  stack4 = "KG.infoController.listVisible";
  stack3['expandedBinding'] = stack4;
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
  return buffer;
})