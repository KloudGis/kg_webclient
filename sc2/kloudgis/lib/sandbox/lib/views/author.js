/**
* View to show the author descriptor in a collectionview.
**/
KG.AuthorView = SC.View.extend({

    authorLabel: function() {
        var content = this.getPath('itemView.content');
        if (SC.none(content)) {
            return '';
        }
        if (content.get('author') === KG.core_auth.activeUser.id) {
            return '_me'.loc();
        } else {
            var auth = content.get('author_descriptor');
            if (auth) {
                return auth;
            } else {
                return '?';
            }
        }
    }.property('itemView.content')
});
