KG.SearchField = KG.TextField.extend({
    type: "search",

    insertNewline: function() {
		KG.statechart.sendAction('searchAction');
	}
});
