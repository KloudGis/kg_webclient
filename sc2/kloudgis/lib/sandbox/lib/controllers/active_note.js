//active note -  selected
KG.activeNoteController = SC.Object.create({
    content: null,

    titleLabel: function() {
        return "_noteTitle".loc();
    }.property(),

    descriptionLabel: function() {
        return "_noteDescription".loc();
    }.property(),

    isOldRecord: function() {
        if (this.getPath('content.status') === SC.Record.READY_NEW) {
            return NO;
        }
        return YES;
    }.property('content.status'),

    confirmLabel: function() {
        if (this.get('isOldRecord')) {
            return "_noteUpdate".loc();
        } else {
            return "_noteConfirm".loc();
        }
    }.property('isOldRecord'),

    deleteLabel: function() {
        return "_Delete".loc();
    }.property('content.status'),

    titleValue: function(key, value) {
        if (value != undefined) {
            this.get('content').set('title', value);
        }
        var val = this.getPath('content.title');
        if (!val) {
            val = '';
        }
        return val;
    }.property('content.title'),

    isDisabled: function() {
        if (this.getPath('content.status') & SC.Record.BUSY) {
            return YES;
        }
        var auth = this.getPath('content.author');
        if (!auth || auth === KG.core_auth.get('activeUser').id) {
            return NO;
        }
        return YES;
    }.property('content.status', 'content.author'),

    isUpdateVisible: function() {
        return ! this.get('isDisabled');
    }.property('isDisabled'),

    isDeleteVisible: function() {
        var auth = this.getPath('content.author');
        if (this.getPath('content.status') !== SC.Record.READY_NEW && (!auth || auth === KG.core_auth.get('activeUser').id || KG.core_sandbox.get('isSandboxOwner'))) {
            return YES;
        }
        return NO;
    }.property('content.status', 'content.author', 'KG.core_sandbox.isSandboxOwner'),

    commentsLabel: function() {
        var len = this.getPath('content.comments.length');
        if (len === 0) {
            return "_0comment".loc();
        } else if (len === 1) {
            return "_1comment".loc();
        } else {
            return "_comments".loc(len);
        }
    }.property('content.comments.length'),

    hideCommentsLabel: function() {
        var len = this.getPath('content.comments.length');
        if (len === 0) {
            return "_0hideComment".loc();
        } else if (len === 1) {
            return "_1hideComment".loc();
        } else {
            return "_hideComments".loc(len);
        }
    }.property('content.comments.length'),

});
