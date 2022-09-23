define(['./lib/ptocalendar'],

function(ptocalendar) {
	
	createCalendar = function(option){
		
		return ptocalendar.create(option);		
	};
	
	updateCalendar = function(option){
		
		return ptocalendar.update(option);		
	};
	
    return {
    	createCalendar: createCalendar,
    	updateCalendar: updateCalendar
    };
    
});