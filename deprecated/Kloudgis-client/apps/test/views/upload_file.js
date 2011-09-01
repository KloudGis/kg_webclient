
// TODO: send warnings if the protocol isn't supported and try not to just hang
Test.UploadFileView = SC.View.extend(SC.DelegateSupport,
/** @scope SC.FileFieldView.prototype */
{
	
    classNames: 'sc-file-field-view'.w(),

    buttonTitle: 'Choose File',

    buttonTheme: 'normal',

    fileSelectedButtonTitle: "Change",

    inputName: 'files[]',

    autoSubmit: YES,

    isMultiple: NO,

    _input: null,

    _button: null,

    value: null,

    delegate: null,

    submitForm: function() {
        console.log('submit!!');
        var fd = new FormData();
        var files = this.get('value');
        if (SC.none(files)) {
            return;
        }
        for (var i = 0; i < files.length; i++) {
            fd.append("fileToUpload", files[i]);
        }
		console.log(files.length + ' files.');
        var xhr = new XMLHttpRequest();
        var del = this.get('delegate') ? this.get('delegate') : this;
        xhr.upload.addEventListener("progress", del.fileFieldViewUploadProgress, false);
        xhr.addEventListener("load", del.fileFieldViewDidComplete, false);
        xhr.addEventListener("error", del.fileFieldViewUploadFailed, false);
        xhr.addEventListener("abort", del.fileFieldViewUploadCanceled, false);
        xhr.open("POST", "/kg_server/upload");
        xhr.send(fd);
		this._button.set('title', this.get('buttonTitle'));
    },

    didCreateLayer: function() {
        this._createForm();
    },

    willDestroyLayer: function() {
        var input = this._input;
        SC.Event.remove(input, 'mousedown', this, this._mouseDownInInput);
        SC.Event.remove(input, 'mouseup', this, this._mouseUpInInput);
        SC.Event.remove(input, 'mouseout', this, this._mouseOutOfInput);
        this.removeAllChildren();
    },

    _inputChange: function(evt) {
        SC.Logger.warn('input changed!');
        var input = this._input;
        button = this._button;
        value = this.get('value');

        // Store the value
        var nvalue = input.$()[0].files;
        previousValue = value;

        this.set('value', nvalue);

        var del = this.get('delegate') ? this.get('delegate') : this;
        this.invokeDelegateMethod(del, 'fileFieldValueDidChange', this, value, previousValue);

        SC.RunLoop.begin();
        if (this.get('fileSelectedButtonTitle')) button.set('title', this.get('fileSelectedButtonTitle'));
        SC.RunLoop.end();
        if (this.get('autoSubmit')) {
            if (this.invokeDelegateMethod(del, 'fileFieldViewShouldSubmit', this)) {
                this.submitForm();
            }
        }
    },

    _mouseDownInInput: function(evt) {
        SC.Logger.warn('mouse down input');
        var input = this._input;

        SC.Event.add(input.$()[0], "mouseup", this, this._mouseUpInInput);
        SC.Event.add(input.$()[0], "mouseout", this, this._mouseOutOfInput);

        var button = this._button;
        button.set('isActive', YES);
    },

    _mouseUpInInput: function(evt) {
        SC.Logger.warn('mouse up input');
        var input = this._input;
        SC.Event.remove(input.$()[0], 'mouseup', this, this._mouseUpInInput);
        SC.Event.remove(input.$()[0], 'mouseout', this, this._mouseOutOfInput);

        var button = this._button;
        button.set('isActive', NO);
    },

    _mouseOutOfInput: function(evt) {
        SC.Logger.warn('mouse out input');
        var input = this._input;
        SC.Event.remove(input.$()[0], 'mouseup', this, this._mouseUpInInput);
        SC.Event.remove(input.$()[0], 'mouseout', this, this._mouseOutOfInput);

        var button = this._button;
        button.set('isActive', NO);
    },

    _createForm: function() {
        SC.Logger.warn('create the form');
        var form;
        form = SC.View.create({
            tagName: 'div',

            classNames: 'sc-file-field-form'.w(),

            render: function(context, firstTime) {
                sc_super();
            },

            willDestroyLayer: function() {
                this.removeAllChildren();
            }

        });

        this.appendChild(form);
        this["_form"] = form;
        this._createInput();
    },

    _createInput: function() {
        SC.Logger.warn('create the input');
        this._button = SC.ButtonView.create({
            layout: {
                top: 0,
                height: 24,
                width: 110
            },
            classNames: 'sc-file-field-button-view'.w(),
            title: this.get('buttonTitle'),
            theme: this.get('buttonTheme'),
            isEnabledBinding: SC.Binding.oneWay('*parentView.isEnabled')
        });
        var form = this["_form"];
        this.insertBefore(this._button, form);
        this._input = SC.View.create(SC.Control, {
            tagName: 'input',
            name: this.get('inputName'),
            layout: {
                left: 0,
                right: -10,
                top: 0,
                height: 24
            },
            classNames: 'sc-file-field-input-view'.w(),
            isEnabledBinding: SC.Binding.oneWay('*parentView.parentView.isEnabled'),

            acceptsFirstResponder: function() {
                return YES;
            },

            render: function(context, firstTime) {
                if (firstTime) {
                    context.attr('type', 'file').attr('name', this.get('name')).end();
					if(this.getPath('parentView.parentView.isMultiple')){
						context.attr('multiple', true);
					}
                } 
            },

            // This helper gets us isEnabled functionality from the SC.Control mixin
            $input: function() {
                return this.$();
            }
        });
        form.appendChild(this._input);

        SC.RunLoop.begin().end();

        // Register for mousedown so that we can visually activate our button
        var input = this._input;
        SC.Event.add(input.$()[0], "mousedown", this, this._mouseDownInInput);
        SC.Event.add(input.$()[0], "change", this, this._inputChange);
    },

    acceptsFirstResponder: function() {
        return this.get('isEnabled');
    }.property('isEnabled'),



	//delegate functions

    fileFieldValueDidChange: function(fileFieldView, value, previousValue) {
	},

    fileFieldViewShouldSubmit: function(fileFieldView) {
        return YES;
    },

    fileFieldViewDidComplete: function(evt) {
        console.log('upload complete');
    },

    fileFieldViewUploadProgress: function(evt) {
        if (evt.lengthComputable) {
            var percentComplete = Math.round(evt.loaded * 100 / evt.total);
            console.log(percentComplete.toString() + '%');
        }
    },

    fileFieldViewUploadFailed: function(evt) {
        console.log("There was an error attempting to upload the file." + evt);
    },

    fileFieldViewUploadCanceled: function(evt) {
        console.log("The upload has been canceled by the user or the browser dropped the connection.");
    },
});
