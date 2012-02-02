var build = require('./build/build.js');
var vm = require('vm');

var crlf = '\r\n',
	COPYRIGHT = '/*' + crlf + ' Copyright (c) 2010-2011, XYZ Civitas' + crlf +
                ' Kloudgis.' + crlf +
                ' http://kloudgis.com' + crlf + '*/' + crlf;
                
var fs = require('fs');
var vm = require('vm');

var emberjs = fs.readFileSync('./js/ember-0.9.4.js', 'utf8');
var templatesDir = './src/templates';
var compiledDir = './src/compiled_templates';


desc('Compile all .handlebars templates');
task({ 'handlebars': [] }, function () {
  process.stdout.write('Compiling .handlebars templates');
  var files = fs.readdirSync(templatesDir);
  var i;
  for (i = 0; i < files.length; i++) {
    if (/\.handlebars$/.test(files[i])) {
      compileHandlebarsTemplate(templatesDir + '/' + files[i]);
      process.stdout.write('.');
    }
  }
  console.log('done');
});

function compileHandlebarsTemplate(file) {
  //dummy jQuery
  var jQuery = function() { return jQuery; };
  jQuery.ready = function() { return jQuery; };
  jQuery.inArray = function() { return jQuery; };
  jQuery.jquery = "1.7.1";

  //dummy DOM element
  var element = {
    firstChild: function () { return element; },
    innerHTML: function () { return element; }
  };

  var sandbox = {
    // DOM
    document: {
      createRange: false,
      createElement: function() { return element; }
    },

    // Console
    console: console,

    // jQuery
    jQuery: jQuery,
    $: jQuery,

    // handlebars template to compile
    template: fs.readFileSync(file, 'utf8'),

    // compiled handlebars template
    templatejs: null
  };

  // window
  sandbox.window = sandbox;

  // create a context for the vm using the sandbox data
  var context = vm.createContext(sandbox);

  // load Ember into the sandbox
  vm.runInContext(emberjs, context, 'ember.js');

  //compile the handlebars template inside the vm context
  vm.runInContext('templatejs = Ember.Handlebars.precompile(template).toString();', context);

  var fileNameWithExt = file.replace(/^.*(\\|\/|\:)/, '');
  var fileName = fileNameWithExt.substring(0, fileNameWithExt.length-11);
  var templateN = fileName.replace(/_/g, '-');
  //extract the compiled template from the vm context and save to .js file
  fs.writeFileSync(compiledDir + '/' + fileNameWithExt.replace(/\.handlebars$/, '.js'), 'Ember.TEMPLATES["'+ templateN+ '"] =Handlebars.template(' + context.templatejs + ')', 'utf8');
}

desc('Combine and compress Kloudgis source files');
task('build', ['handlebars'], function (compsBase32, buildName) {
	var pathPart = 'js/kloudgis' + (buildName ? '-' + buildName : ''),
		srcPath = pathPart + '-src.js',
		path = pathPart + '.js';

	var files = build.getFiles(compsBase32);

	console.log('Concatenating ' + files.length + ' files...');
	var content = build.combineFiles(files);
	
	var oldSrc = build.load(srcPath),
		newSrc = COPYRIGHT + content,
		srcDelta = build.getSizeDelta(newSrc, oldSrc);
		
	console.log('\tUncompressed size: ' + newSrc.length + ' bytes (' + srcDelta + ')');
		
	if (newSrc === oldSrc) {
		console.log('\tNo changes');
	} else {
		build.save(srcPath, newSrc);
		console.log('\tSaved to ' + srcPath);
	}
	
	console.log('Compressing...');

	var oldCompressed = build.load(path),
		newCompressed = COPYRIGHT + build.uglify(content),
		delta = build.getSizeDelta(newCompressed, oldCompressed);
		
	console.log('\tCompressed size: ' + newCompressed.length + ' bytes (' + delta + ')');

	if (newCompressed === oldCompressed) {
		console.log('\tNo changes');
	} else {
		build.save(path, newCompressed);
		console.log('\tSaved to ' + path);
	}
});

task('default', ['build']);