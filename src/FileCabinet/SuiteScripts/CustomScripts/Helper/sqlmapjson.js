define([],

function() {
   
	sqlMap = 
		
		function(option){

	        var mapping = option.mapping; //Mapping
	        var key = option.key; //Key to Map
	        var sqldata = option.sqldata; //NetSuite SQL object
	        var data = option.data; //Object that will be returned
	        	data = updateData(data, key, sqldata[mapping[key]]);
	        	
	        return data;
	        
		};
	
	
	generate = /**
		 * @param data
		 * @returns objPayload
		 */
			
		function(option) {
			
			var objPayload = {};
			
	        for (var key in option.mapping) {

	        	objPayload = sqlMap({
	                mapping: option.mapping,
	                sqldata: option.sqldata,
	                data: objPayload,
	                key: key
	            });
	        }
	        
	        return objPayload;
		};
	
	updateData = /**
		 * @param object
		 * @param property
		 * @param value
		 * @returns object
		 */
			
		function (object, property, value) {

	        var path =  property.split(".");
	        var val = value; 

	        for (var i = 0, tmp = object; i < path.length - 1; i++) {
				
				if(!tmp.hasOwnProperty(path[i])){
					tmp = tmp[path[i]] = {};		
				}
				else{
					tmp = tmp[path[i]]
				}
	        }
	        
	       	tmp[path[i]] = val;

	        return object;
	    };
		
		
    return {
    	generate: generate
    };
    
});
