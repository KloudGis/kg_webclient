
KG.NoteComment = KG.Comment.extend({
		note: SC.Record.toOne('KG.Note', {inverse: 'comments', isMaster: YES})
});

