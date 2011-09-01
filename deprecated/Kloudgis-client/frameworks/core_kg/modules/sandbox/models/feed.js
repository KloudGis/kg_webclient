CoreKG.Feed = SC.Record.extend(
/** @scope CoreKG.Feed.prototype */ {
		
	title: SC.Record.attr(String),
	descr: SC.Record.attr(String),	
	sandbox: SC.Record.toOne('CoreKG.Project')
});
