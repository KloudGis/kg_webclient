/* ===========================================================================
   BPM Combined Asset File
   MANIFEST: kloudgis ()
   This file is generated automatically by the bpm (http://www.bpmjs.org)
   =========================================================================*/

spade.register("kloudgis/templates/select", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("{{#view KG.SelectView contentBinding=\"content\" valueBinding=\"value\" disabledBinding=\"disabled\"}}\n\t<select {{bindAttr disabled=\"disabled\"}}>\n\t\t{{#each content}}\n\t\t\t<option {{bindAttr value=\"key\"}} >{{label}}</option>\n\t\t{{/each}}\n\t</select>\n{{/view}}\n");
});spade.register("kloudgis/templates/select_input", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("{{#view KG.SelectInputView contentBinding=\"content\" valueBinding=\"value\" disabledBinding=\"disabled\"}}\n\t{{view templateName=\"select\" contentBinding=\"content\" valueBinding=\"valueSelect\" disabledBinding=\"disabled\"}}\n\t{{view Ember.TextField valueBinding=\"valueInput\" classNameBindings=\"inputClass\"  disabledBinding=\"disabled\"}}\n{{/view}}\n");
});spade.register("kloudgis/templates/switch", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("{{#view KG.SwitchView classBinding=\"on\" valueBinding=\"content\" disabledBinding=\"disabled\"}}\n\t<span class=\"thumb\"></span>\n{{/view}}\n");
});