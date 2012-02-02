var deps = {

	Core: {
		src: ['main.js',
              'strings.js',
              'views/button.js',
              'views/forward_text_field.js',
              'views/loading_image.js',
              'views/signup_field.js',
              'compiled_templates/signup_page.js',
		      'core_signup.js',
		      'core_statechart.js'
		    ],
		desc: 'Signup to kloudgis module.  http://kloudgis.org'
	}

};

if (typeof exports !== 'undefined') {
	exports.deps = deps;
}
