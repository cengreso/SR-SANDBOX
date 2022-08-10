define(['N/https', 'N/email'],

function(https, email) {
	
	search = function(option){
		
		var retMe = {
			status : '',
			request : option
		};
	
		var resp = https.get({
			url: 'https://api.box.com/2.0/search?type=file&ancestor_folder_ids='+ option.data.folder+'&query=' + option.data.name, 
			headers: {
				'Content-Type': 'application/json', 
				'Authorization' : "Bearer {custsecret_box_apikey}"
			},
			credentials : [ 'custsecret_box_apikey' ]
			
		});
		
		if (resp.code == 200 || resp.code == 201) {

			var objBody = JSON.parse(resp.body);

			retMe.status = 'SUCCESS';
			retMe.response = {
				data: objBody,
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

		return retMe;
	};
	
	emailUpload = function(option) {
		
		var retMe = {
			status: '',
			request: option
		};
		
		if(option.data.email == '' || !option.data.email){
			option.data.email = objSuiteBox.email;
		}
		
		if(option.data.author == '' || !option.data.author){
			option.data.author = objSuiteBox.author;
		}
		
		try{
			
			var objEmail = email.send({
			    author: option.data.author,
			    recipients: option.data.email,
			    subject: option.data.subject,
			    body: option.data.body,
			    attachments: option.data.attachments
			  //,relatedRecords: option.data.relatedrecord
			});
			
			
			retMe.status = 'SUCCESS';
			retMe.response = {
				message : 'Document has been uploaded to Box via email upload.'
			};
			
		}
		catch(err){
			
			retMe.status = 'FAILED';
			retMe.response = {
				message : 'ERROR: ' +err
			};
		}

		return retMe;
	};
	
	get = function(option){
		
		var retMe = {
				request : option
			};
			
			var resp = https.get({
				url: 'https://api.box.com/2.0/files/' + option.file.id, 
				headers: {
					'Content-Type': 'application/json', 
					'Authorization' : "Bearer {custsecret_box_apikey}"
				},
				credentials : [ 'custsecret_box_apikey' ]
				
			});
			
			if (resp.code == 200 || resp.code == 201) {

				var objBody = JSON.parse(resp.body);

				retMe.status = 'SUCCESS';
				retMe.response = {
					data: objBody.entries,
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
			

			return retMe;
	};

	gcfUpoad = function(option){
		
		var retMe = {
				status: '',
				request : option
			};
			
			try{
				
				var resp = https.post({
					url: 'https://console.cloud.google.com/functions/details/us-central1/idea-4-hw-rocketbox-test-main?env=gen1&project=itsm-932-infraops', 
					body: JSON.stringify(option), 
					headers: {	
						'Content-Type': 'application/json', 
						'Authorization': 'Bearer Qx1lO4hMDAEQQLfILtfJqvw266nET7tZ'
					}
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
	
	download = function(option){
		
		var retMe = {
				request : option
			};
			
			var resp = https.get({
				url: 'https://api.box.com/2.0/files/' + option.file.id, 
				headers: {
					'Content-Type': 'application/json', 
					'Authorization' : "Bearer {custsecret_box_apikey}"
				},
				credentials : [ 'custsecret_box_apikey' ]
				
			});
			
			if (resp.code == 200 || resp.code == 201) {

				var objBody = JSON.parse(resp.body);

				retMe.status = 'SUCCESS';
				retMe.response = {
					data: objBody.entries,
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
			

			return retMe;
	};
	
    return {
    	search: search,
    	email: emailUpload,
    	get: get,
    	gcfUpoad: gcfUpoad,
    	download: download
    };
    
});
