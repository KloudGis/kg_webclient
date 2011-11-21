KG.core_date = SC.Object.create({
	
	formatDate: function(timeMillis){
        if (timeMillis) {
            var d = new Date(timeMillis);
            var day = d.getDate();
            var month = d.getMonth() + 1; //months are zero based
            var year = d.getFullYear();			
            var today = new Date();
			var curr_day = today.getDate();
	        var curr_month = today.getMonth() + 1; //months are zero based
	        var curr_year = today.getFullYear();
			//today
			var hour = d.getHours();
			if(hour < 10){
				hour = '0' + hour;
			}
			var min = d.getMinutes();
			if(min < 10){
				min = '0' + min;
			}
			if(curr_day === day && curr_month === month && curr_year == year){			
				return "%@:%@".fmt(hour, min);
			}else{
				return "%@-%@-%@ %@:%@".fmt(year, month, day, hour, min);
			}
        }
	}
});