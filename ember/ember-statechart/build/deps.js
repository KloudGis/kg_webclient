var deps = {

    Core: {
		src: ['core.js',
              'ext/function.js',
              'system/async.js',
              'system/state.js',
              'system/empty_state.js',
              'system/history_state.js',
              'system/statechart.js',
		    ],
		desc: 'Ember statechart'
	}

};

if (typeof exports !== 'undefined') {
	exports.deps = deps;
}
