var fr = { 
	"_Map": "Carte",
	"_Note": "Note",
	"_Notes": "%@ Notes",
	"_createNote": "Créer une note",
	"_cancelCreateNote": "Annuler la création",
	"_newNote" : "Nouvelle note",
	"_Delete": "Supprimer",
	"_backHome": "Retour",
	"_noteTitle": "Titre:",
	"_noteDescription": "Description:",
	"_noteConfirm": "Créer",
	"_noteUpdate": "Mise à jour",
	"_noteTitlePlaceholder": "Votre note",
	"_moveNote": "Glisser la note où vous le voulez.",
	"_author": "Par %@",
	"_comment": "Ajouter un commentaire",
	"_comments": "%@ Commentaires",
	"_commentPlaceholder": "Écrire un commentaire...",
	"_hideComment": "Cacher les commentaires",
	"_closeInspector": "Fermer l'inspecteur",
	"_closeSearch": "Fermer la fenêtre de résultat",	
	"_search": "Recherche...",
	"_searchResult": "%@ Résultats pour %@ dans %@",
	"_unknown" : "Élément",
	"_noteDateFormat": "%@/%@/%@",
	"_commentDateFormat": "%@/%@/%@ à %@:%@"
};

var en = {
	"_Map": "Map",
	"_Note": "Note",
	"_Notes": "%@ Notes",
	"_createNote": "Create Note",
	"_cancelCreateNote": "Cancel create note",
	"_newNote" : "New note",
	"_Delete": "Delete",
	"_backHome": "Return",
	"_noteTitle": "Title:",
	"_noteDescription": "Description:",
	"_noteConfirm": "Create",
	"_noteUpdate": "Update",
	"_noteTitlePlaceholder": "Your note",
	"_moveNote": "Drag where you want it.",
	"_author": "By %@",
	"_comment": "Add a comment",
	"_comments": "%@ Comments",
	"_commentPlaceholder": "Write a comment...",
	"_hideComment": "Hide comments",
	"_closeInspector": "Close the inspector",
	"_closeSearch": "Close the result window",
	"_search": "Search...",
	"_searchResult": "%@ Results for %@ in %@",
	"_unknown" : "Feature",
	"_noteDateFormat": "%@/%@/%@",
	"_commentDateFormat": "%@/%@/%@ at %@:%@"
};

if(KG.lang === 'fr'){
	SC.STRINGS = fr;
}else{
	SC.STRINGS = en;
}

//do the localize after the rendering
SC.run.schedule('render',null, function(){
	console.log('localize page');
	$('#back-home a').text("_backHome".loc());
	$('#create-note a').text("_createNote".loc());
});