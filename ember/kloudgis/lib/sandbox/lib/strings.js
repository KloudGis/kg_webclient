var fr = { 
	"_me": "Moi",
	"_save": "Sauvegarde",
	"_cancel": "Annuler",
	"_close": "Fermer",
	"_Map": "Carte",
	"_Note": "Note",
	"_Notes": "%@ Notes",
	"_notes_": "Notes",
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
	"_0comment": "Ajouter un commentaire",
	"_1comment": "Un Commentaire",
	"_comments": "%@ Commentaires",
	"_0hideComment": "Cacher",
	"_1hideComment": "Cacher le commentaire",
	"_hideComments": "Cacher les %@ commentaires",
	"_commentPlaceholder": "Écrire un commentaire...",
	"_closeInspectorTitle": "Fermer l'inspecteur",
	"_cancelInspectorTitle" : "Annuler les changements",
	"_saveInspectorTitle" : "Sauvegarder les changements",
	"_saveInspectorLabel" : "Sauvegarde",	
	"_closeSearch": "Fermer la fenêtre de résultat",	
	"_search": "Recherche...",
	"_searchResult": "%@ Résultats pour %@ dans %@",
	"_unknown" : "Élément",
	"_searchGoogle": "Rechercher Google",
	"_searchGeonames": "Rechercher Geonames",
	"_searchOSM": "Rechercher OSM",
	"_searchYahoo" : "Rechercher Yahoo",
	"_notificationTitle": "Notifications",
	"_notificationClear": "Effacer",
	"_notificationSendText": "Envoyer un message",
	"_notificationSendButton": "Envoyer",
	"_bookmarkTitle": "Signets",
	"_bookmarkAdd": "Ajouter",
	"_bookmarkEdit": "Modifier",
	"_bookmarkDialogTitle": "Ajouter un signet",
	"_bookmarkCloseDialogTitle": "Fermer la fenêtre d'ajout de signet",
	"_textMessageTitle": " a envoyé un message à ",
	"_sendOnEnterTooltip" : "Envoyer le message en appuyant sur Retour",
	"_failedToSendMessage": "Impossible d'envoyer le message.",
	"_timeoutSendMessage" : "Erreur lors de l'envoi du message.",
	"_sendMessageSuccessful" : "Message envoyé.",
	"_otherValue" : "Autre...",
	"_paletteTitle": "Palette",
	"_showPalette" : "Afficher la Palette",
	"_moveFeature": "Glisser le nouveau '%@' où vous le voulez.",
	"_bookmarkDescription": "Par %@ à %@"
};

var en = {
	"_me": "Me",
	"_save": "Save",
	"_cancel": "Cancel",
	"_close": "Close",
	"_Map": "Map",
	"_Note": "Note",
	"_Notes": "%@ Notes",
	"_notes_": "Notes",
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
	"_moveNote": "Drag the note where you want.",
	"_author": "By %@",
	"_0comment": "Add a comment",
	"_1comment": "One comment",
	"_comments": "%@ comments",
	"_0hideComment": "Hide",
	"_1hideComment": "Hide the comment",
	"_hideComments": "Hide the %@ comments",
	"_commentPlaceholder": "Write a comment...",
	"_closeInspectorTitle": "Close the Inspector",
	"_cancelInspectorTitle" : "Cancel the Changes",
	"_saveInspectorTitle" : "Save the Changes",
	"_saveInspectorLabel" : "Save",
	"_closeSearch": "Close the result window",
	"_search": "Search...",
	"_searchResult": "%@ Results for %@ in %@",
	"_unknown" : "Feature",
	"_searchGoogle": "Search Google",
	"_searchGeonames": "Search Geonames",
	"_searchOSM": "Search OSM",
	"_searchYahoo" : "Search Yahoo",
	"_notificationTitle": "Notifications",
	"_notificationClear": "Clear",
	"_notificationSendText": "Send a Message",
	"_notificationSendButton": "Send",
	"_bookmarkTitle": "Bookmarks",
	"_bookmarkAdd": "Add",
	"_bookmarkEdit": "Edit",
	"_bookmarkDialogTitle": "Add a Bookmark",
	"_bookmarkCloseDialogTitle": "Close the add bookmark dialog",
	"_textMessageTitle": " send a text message at ",
	"_sendOnEnterTooltip" : "Send the message on Enter",
	"_failedToSendMessage": "Cannot send the message.",
	"_timeoutSendMessage" : "Failed to send message.",
	"_sendMessageSuccessful" : "Message envoyé.",
	"_otherValue" : "Other...",
	"_paletteTitle": "Palette",
	"_showPalette" : "Show the Palette",
	"_moveFeature": "Drag the new '%@' where you want.",
	"_bookmarkDescription": "By %@ at %@"
};

if(KG.lang === 'fr'){
	jQuery.extend(Ember.STRINGS, fr);
}else{
	jQuery.extend(Ember.STRINGS, en);
}