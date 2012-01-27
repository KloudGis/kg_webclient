/*globals exports spade */

exports.minify = function(orig_code, pkg) {
  var jsp = spade.require("uglify-js/parse-js");
  var pro = spade.require("uglify-js/process");
  var ast = jsp.parse(orig_code); // parse code and get the initial AST
  ast = pro.ast_mangle(ast); // get a new AST with mangled names
  ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
  return pro.gen_code(ast); // compressed code here
};

