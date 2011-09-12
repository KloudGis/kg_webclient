KG.core_sandbox = SC.Object.create({
	
	
	
	authenticate: function(){		
		KG.core_auth.load(this, this.authenticateCallback);
	},
	
	authenticateCallback: function(message){
		if(message === "_success"){
			KG.statechart.sendAction('authenticationSucceeded', this);
		}else{
			KG.statechart.sendAction('authenficationFailed', this);
		}
	},
	   
	addMap: function(){
		KG.core_leaflet.addToDocument();
	}
	
	//add a view to the body
	/* 
	test: function(){
		var view = SC.View.create({
		  templateName: 'say-hello',
		  name: "Bob"
		});
		view.append();
	}
	//in the header part of the html
	<script type="text/x-handlebars" data-template-name="say-hello">
	    Hello, <b>{{name}}</b>
	</script>	
	
	*/
	
});


$(document).ready(function() {
    KG.statechart.initStatechart();
});
