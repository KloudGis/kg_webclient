/**
* The class for Note. A note have a position (coordinate), a title, a description, a list comments, ...
**/
KG.Note = KG.Record.extend({
	
	title: SC.Record.attr(String),
	description: SC.Record.attr(String),
	author: SC.Record.attr(Number),
	author_descriptor: SC.Record.attr(String),
	date_update: SC.Record.attr(Number),
	coordinate: SC.Record.attr(Object),
	comments: SC.Record.toMany('KG.NoteComment', {inverse: 'note', isMaster: NO}),
	
	isSelectable: YES,
	isInspectorSelectable: NO,
	
	center: function(){
		var coordinate = this.get('coordinate');
		if(!SC.none(coordinate)){
			return KG.LonLat.create({
                lon: coordinate.x,
                lat: coordinate.y
            });
		}
	}.property('coordinate'),

	authorFormatted: function() {
        var a = this.getPath('author_descriptor');
        if (a) {
            return "_author".loc(a);
        }
        return '';
    }.property('content.author_descriptor')
});