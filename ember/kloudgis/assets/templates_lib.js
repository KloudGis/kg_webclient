/* ===========================================================================
   BPM Combined Asset File
   MANIFEST: kloudgis ()
   This file is generated automatically by the bpm (http://www.bpmjs.org)
   =========================================================================*/

spade.register("kloudgis/~templates/select", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("{{#view KG.SelectView contentBinding=\"parentView.content\" valueBinding=\"parentView.value\" disabledBinding=\"parentView.disabled\"}}\n\t<select {{bindAttr disabled=\"disabled\"}}>\n\t\t{{#each content}}\n\t\t\t<option {{bindAttr value=\"key\"}} >{{label}}</option>\n\t\t{{/each}}\n\t</select>\n{{/view}}\n");
});spade.register("kloudgis/~templates/select_input", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("{{#view KG.SelectInputView contentBinding=\"parentView.content\" valueBinding=\"parentView.value\" disabledBinding=\"parentView.disabled\"}}\n\t{{view templateName=\"select\" contentBinding=\"parentView.content\" valueBinding=\"parentView.valueSelect\" disabledBinding=\"parentView.disabled\"}}\n\t{{view Ember.TextField valueBinding=\"parentView.valueInput\" classBinding=\"parentView.inputClass\" disabledBinding=\"parentView.disabled\"}}\n{{/view}}\n");
});spade.register("kloudgis/~templates/switch", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("{{#view KG.SwitchView classBinding=\"on\" valueBinding=\"parentView.content\" disabledBinding=\"parentView.disabled\"}}\n\t<span class=\"thumb\"></span>\n{{/view}}\n");
});