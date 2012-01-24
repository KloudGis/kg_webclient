//loc helper
Handlebars.registerHelper('loc',
function(property, options) {
    var value = property.loc();
    if (options.hash.id) {
        var tag = options.hash.tagName || 'span';
        return new Handlebars.SafeString('<' + tag + ' id="' + options.hash.id + '">' + value + '</' + tag + '>');
    } else if (options.hash.class) {
        var tag = options.hash.tagName || 'span';
        return new Handlebars.SafeString('<' + tag + ' class="' + options.hash.class + '">' + value + '</' + tag + '>');
    } else if (options.hash.tagName) {
        var tag = options.hash.tagName;
        return new Handlebars.SafeString('<' + tag + '>' + value + '</' + tag + '>');
    }
    return value;
});

//highlight helper
Handlebars.registerHelper('highlight',
function(property) {
    var value = SC.getPath(this, property);
    return new Handlebars.SafeString('<span class="highlight">' + value + '</span>');
});