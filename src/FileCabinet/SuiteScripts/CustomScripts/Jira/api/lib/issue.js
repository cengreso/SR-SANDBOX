define(['N/https'],
/**
 * @param {https} https
 */
function(https) {
	
	get = function(option){
		
		var retMe = option; 
		
		var resp = https.get({
			url : 'https://rocketeers.atlassian.net/rest/api/3/issue/' + option.id,
			headers : {
				'Authorization': 'Basic ' + '{custsecret_jiraapikey}',
				'Content-Type' : 'application/json',
				'Accept' : '*/*'
			},
			credentials : [ 'custsecret_jiraapikey' ]
		});
		
		if (resp.code == 200 || resp.code == 201) {
			
			var objBody = JSON.parse(resp.body);

			retMe.result = {
				status : 'SUCCESS',
				data : objBody
			};

		} 
		else {

			var objBody = {};
			
			try {
				objBody = JSON.parse(resp.body);
			}
			catch (err) {
				
				var e = err;
				objBody.message = resp.body;
			}
			
			retMe.result = {
				status : 'FAILED',
				message : resp.code + ': ' + objBody.message
			};
		}
        
        return retMe;
		
	};
	
	create = function(option){
		
		var resp = https.post({
			url : 'https://rocketeers.atlassian.net/rest/api/3/issue/' + option.issuenum,
			body : JSON.stringify(option.payload),
			headers : {
				'Content-Type' : 'application/json'
			},
			credentials : [ 'custsecret_workplace_dev_apikey' ]
		});
		
		return resp;
	};
	
    return {
    	get: get
    };
    
});
