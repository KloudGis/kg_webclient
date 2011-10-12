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

    dateValue: function() {
        var date = this.getPath('content.date');
        if (date) {
            var d = new Date(date);
            var curr_day = d.getDate();
            var curr_month = d.getMonth() + 1; //months are zero based
            var curr_year = d.getFullYear();
            return curr_day + "/" + curr_month + "/" + curr_year;
        }
        return '';
    }.property('content.date'),

    authorValue: function() {
        var a = this.getPath('content.author_descriptor');
        if (a) {
            return "_author".loc(a);
        }
        return '';
    }.property('content.author_descriptor'),

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

    commentsLabel: '?',

    hideCommentsLabel: function() {
        return "_hideComment".loc();
    }.property(),

    contentDidChange: function() {
        this.refreshCommentsLabel();
    }.observes('content'),

    activeCommentsDidChange: function() {
		this.refreshCommentsLabel();
	}.observes('KG.activeCommentsController*content.length'),

    refreshCommentsLabel: function() {
        var len;
        if (KG.activeCommentsController.getPath('content.length') > 0) {
            len = KG.activeCommentsController.getPath('content.length');
        } else {
            len = this.getPath('content.comments.length');
        }
        if (len === 0) {
            this.set('commentsLabel', "_comment".loc());
        } else {
            this.set('commentsLabel', "_comments".loc(len));
        }
    }

});
