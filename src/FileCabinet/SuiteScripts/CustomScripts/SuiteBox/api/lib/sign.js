define(['N/https'],
/**
 * @param {https} https
 */
function(https) {
	
	create = function(option){

		var retMe = {
			status: '',
			request : option
		};
		
		try{
			
			var resp = https.post({
				url: 'https://api.box.com/2.0/sign_requests', 
				body: JSON.stringify(option.data), 
				headers: {	
					'Content-Type': 'application/json', 
					'Authorization': 'Bearer {custsecret_box_apikey}'
				},
				credentials: ['custsecret_box_apikey']
			});
			
			if (resp.code == 200 || resp.code == 201) {
				
				var dDate = new Date();
				var objBody = JSON.parse(resp.body);
				
				retMe.status = 'SUCCESS';
				retMe.response = {
					message: 'BoxSign request sent. ' + (new Date()).toString()
				};
				
				return retMe;
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

				retMe.status = 'FAILED';
				retMe.response = {
					message: resp.code + ': ' + objBody.message
				};
				
				return retMe;
			}
		}
		catch(err){
			
			retMe.status = 'FAILED';
			retMe.response = {
				message: 'ERROR: ' + err
			};
			
			return retMe;
		}
	};
	
	resend = function(option){
		
		var retMe = {
			status: '',
			request : option
		};
		
		var resp = https.post({
			url: 'https://api.box.com/2.0/sign_requests/'+ option.signrequestid + '/resend', 
			headers: {	
				'Content-Type': 'application/json', 
				'Authorization': 'Bearer {custsecret_box_apikey}'
			},
			credentials: ['custsecret_box_apikey']
		});
		
		if (resp.code == 200 || resp.code == 201) {

			var dDate = new Date();
			var objBody = JSON.parse(resp.body);

			retMe.status = 'SUCCESS';
			retMe.response = {
				message: 'BoxSign request sent. ' + (new Date()).toString()
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

			retMe.status = 'FAILED';
			
			retMe.response = {
				message: resp.code + ': ' + objBody.message
			};
		}
		
	};
	
	get = function(option){
		
		var resp = https.get({
			url: 'https://api.box.com/2.0/sign_requests/'+ option.signrequestid, 
			headers: {	
				'Content-Type': 'application/json', 
				'Authorization': 'Bearer {custsecret_box_apikey}'
			},
			credentials: ['custsecret_box_apikey']
		});
		
		if (resp.code == 200 || resp.code == 201) {

			var dDate = new Date();
			var objBody = JSON.parse(resp.body);

			retMe.result = {
				status: 'SUCCESS',
				message: 'BoxSign retrieved. ' + (new Date()).toString()
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
				status: 'FAILED',
				message: resp.code + ': ' + objBody.message
			};
		}
		
	};
	
	cancel = function(option){
		
		var resp = https.post({
			url: 'https://api.box.com/2.0/sign_requests/'+ option.signrequestid +'/cancel', 
			headers: {	
				'Content-Type': 'application/json', 
				'Authorization': 'Bearer {custsecret_box_apikey}'
			},
			credentials: ['custsecret_box_apikey']
		});
		
		if (resp.code == 200 || resp.code == 201) {

			var dDate = new Date();
			var objBody = JSON.parse(resp.body);

			retMe.result = {
				status: 'SUCCESS',
				message: 'BoxSign Cancelled. ' + (new Date()).toString()
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
				status: 'FAILED',
				message: resp.code + ': ' + objBody.message
			};
		}
		
	};
	
	
    return {
    	create: create,
    	resend: resend,
    	get: get,
    	cancel: cancel
    };
    
});
