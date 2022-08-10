define(['N/https'],
/**
 * @param {https} https
 */
function(https) {
	
	create = function(option){

		var objPayload ={
			       'signers': [
			                   {    
			                     'role': 'signer',
			                     'email': 'example_email@box.com'
			                   }
			                 ],
			                'source_files': [
			                   {
			                     'type': 'file',
			                     'id': '123456789'
			                   }
			                ],
			                'parent_folder': 
			                   {
			                     'type': 'folder',
			                     'id': '0987654321'
			                   }
			              };
		
		var resp = https.post({
			url: 'https://api.box.com/2.0/sign_requests', 
			body: JSON.stringify(objPayload), 
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

			retMe.result = {
				status: 'FAILED',
				message: resp.code + ': ' + objBody.message
			};
		}
		
	};
	
	resend = function(option){
		
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

			retMe.result = {
				status: 'SUCCESS',
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

			retMe.result = {
				status: 'FAILED',
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
    	create: create
    };
    
});
