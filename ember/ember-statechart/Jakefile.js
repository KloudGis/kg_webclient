var build = require('./build/build.js');
var COPYRIGHT = "//©2006-2011 Strobe Inc. and contributors.   Portions ©2008-2011 Apple Inc. All rights reserved. Licensed under MIT license";


desc('Combine and compress Ember Statechart source files');
task('build', [], function (compsBase32, buildName) {
	var pathPart = 'js/ember-statechart' + (buildName ? '-' + buildName : ''),
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