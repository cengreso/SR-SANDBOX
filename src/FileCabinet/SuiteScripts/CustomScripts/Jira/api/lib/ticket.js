define(['N/https'],
/**
 * @param {https} https
 */
function(https) {
	
	create = function(option){
		
		var resp = https.post({
			url : "https://gcf.com/{custsecret_workplace_dev_apikey}",
			body : JSON.stringify(option.payload),
			headers : {
				'Content-Type' : 'application/json'
			},
			credentials : [ 'custsecret_workplace_dev_apikey' ]
		});
		
		return resp;
	};
	
    return {
    	create: create
    };
    
});
