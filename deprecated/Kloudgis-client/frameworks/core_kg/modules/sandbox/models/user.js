CoreKG.User = SC.Record.extend(
/** @scope CoreKG.User.prototype */
{

    fullName: SC.Record.attr(String),
    email: SC.Record.attr(String),
    location: SC.Record.attr(String),
    compagny: SC.Record.attr(String),
    accountType: SC.Record.attr(String),
    accountExpire: SC.Record.attr(String),

	label: function(){
		if(SC.none(this.get('fullName'))){
			return this.get('email');
		}
		return this.get('fullName');
	}.property('fullName', 'email').cacheable(),
	
	image: function(){
		return 'sc-icon-user-24';
	}.property().cacheable()

});
