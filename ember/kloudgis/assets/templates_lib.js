/* ===========================================================================
   BPM Combined Asset File
   MANIFEST: kloudgis ()
   This file is generated automatically by the bpm (http://www.bpmjs.org)
   =========================================================================*/

spade.register("kloudgis/~templates/bool_renderer", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("<span class=\"inspector-attr-name\">\n\t{{itemView.content.label}}\n</span>\t\n{{#view KG.SwitchView valueBinding=\"itemView.content.value\" classBinding=\"on\" class=\"inspector-attr-value\"}}\n\t<span class=\"thumb\"></span>\n{{/view}}\n");
});spade.register("kloudgis/~templates/catalog_renderer", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("<span class=\"inspector-attr-name\">\n\t{{itemView.content.label}}\n</span>\t\n<div class=\"inspector-attr-value\">\n\t{{#view KG.SelectView contentBinding=\"itemView.content.enumValues\" valueBinding=\"itemView.content.value\"}}\n\t\t<select>\n\t\t\t{{#each content}}\n\t\t\t\t<option {{bindAttr value=\"key\"}} >{{label}}</option>\n\t\t\t{{/each}}\n\t\t</select>\n\t{{/view}}\n</div>\n");
});spade.register("kloudgis/~templates/catalog_text_renderer", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("<span class=\"inspector-attr-name\">\n\t{{itemView.content.label}}\n</span>\t\n<div class=\"inspector-attr-value\">\n\t{{#view KG.SelectInputView contentBinding=\"itemView.content.enumValuesCustom\" valueBinding=\"itemView.content.value\"}}\n\t\t{{#view KG.SelectView contentBinding=\"parentView.content\" valueBinding=\"parentView.valueSelect\"}}\n\t\t\t<select>\n\t\t\t\t{{#each content}}\n\t\t\t\t\t<option {{bindAttr value=\"key\"}} >{{label}}</option>\n\t\t\t\t{{/each}}\n\t\t\t</select>\n\t\t{{/view}}\n\t\t{{view Ember.TextField valueBinding=\"parentView.valueInput\" classBinding=\"parentView.inputClass\"}}\n\t{{/view}}\n</div>\n");
});spade.register("kloudgis/~templates/img_renderer", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("<span class=\"inspector-attr-name\">\n\t{{itemView.content.label}}\n</span>\t\n\n<div class=\"inspector-attr-value\">\n\t<img {{bindAttr src=\"itemView.content.imgBase64Value\"}}/>\n</div>\n");
});spade.register("kloudgis/~templates/label_renderer", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("<span class=\"inspector-attr-name\">\n\t{{itemView.content.label}}\n</span>\t\n\n<div class=\"inspector-attr-value\">\n\t<span>\n\t\t{{itemView.content.value}}\n\t</span>\n</div>\n");
});spade.register("kloudgis/~templates/num_range_renderer", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("<span class=\"inspector-attr-name\">\n\t{{itemView.content.label}}\n</span>\t\n<div class=\"inspector-attr-value\">\n\t{{#view KG.NumericTextField valueBinding=\"itemView.content.value\" type=\"range\" minBinding=\"itemView.content.min\" maxBinding=\"itemView.content.max\" stepBinding=\"itemView.content.step\"}}\n\t{{/view}}\n</div>\n");
});spade.register("kloudgis/~templates/num_renderer", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("<span class=\"inspector-attr-name\">\n\t{{itemView.content.label}}\n</span>\t\n<div class=\"inspector-attr-value\">\n\t{{#view KG.NumericTextField valueBinding=\"itemView.content.value\" type=\"number\" minBinding=\"itemView.content.min\" maxBinding=\"itemView.content.max\" stepBinding=\"itemView.content.step\"}}\n\t{{/view}}\n</div>\n");
});spade.register("kloudgis/~templates/text_renderer", function(require, exports, __module, ARGV, ENV, __filename){
return Ember.Handlebars.compile("<span class=\"inspector-attr-name\">\n\t{{itemView.content.label}}\n</span>\t\n<div class=\"inspector-attr-value\">\n\t{{#view KG.TextField valueBinding=\"itemView.content.value\" spellcheck=\"false\" autocorrect=\"off\" autocapitalize=\"off\"}}\n\t{{/view}}\n</div>\n");
});