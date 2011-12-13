KG.core_date = SC.Object.create({
	
	formatDate: function(timeMillis){
		return this._formatDate(timeMillis, NO);
	},
	
	formatDateSimple: function(timeMillis){
		return this._formatDate(timeMillis, YES);
	},
	
	
	_formatDate: function(timeMillis, simple){
        if (timeMillis) {
			//date from millis
            var d = new Date(timeMillis);
            var day = d.getDate();
            var month = d.getMonth() + 1; //months are zero based
            var year = d.getFullYear();		
			//now	
            var today = new Date();
			var curr_day = today.getDate();
	        var curr_month = today.getMonth() + 1; //months are zero based
	        var curr_year = today.getFullYear();
			//add zeros			
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
				if(month < 10){
					month = '0' + month;
				}
				if(day < 10){
					day = '0' + day;
				}
				if(simple){
					return "%@-%@-%@".fmt(year, month, day);
				}else{
					return "%@-%@-%@ %@:%@".fmt(year, month, day, hour, min);
				}
			}
        }
	}
});