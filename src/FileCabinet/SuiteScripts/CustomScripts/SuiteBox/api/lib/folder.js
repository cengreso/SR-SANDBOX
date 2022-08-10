define(['N/https','../suitebox.js'],

function(https,suiteBoxMain) {
   
	create = function(option){ // createFolder v2
		try{

			// var retMe = {
			// 	status: '',
			// 	request : option
			// };
			// var objSuiteBox = suiteBoxMain.getSuiteBoxConfig(option.record);

			var objSuiteBox = getSuiteBoxConfig(objRecord.record);

			if(objSuiteBox.status == 'bad'){
				objSuiteBox.status = 'failed';
				return objSuiteBox;
			}
			else if(objSuiteBox.status == 'ok') {

				var sParent = '';

				if(objFolder.parent != null && objFolder.parent != ''){
					sParent = objFolder.parent;
				}
				else if (objSuiteBox.parent != null && objSuiteBox.parent != '') {
					sParent = objSuiteBox.parent;
				}

				var objPayload ={	name: objSuiteBox.prefix + objFolder.name,
					parent: {id : objSuiteBox.parent}};
				var objHeader =	{	'Content-Type': 'application/json',
					Authorization: 'Bearer ' + objSuiteBox.accesstoken};

				log.audit({title: 'createFolder', details: 'request: ' + JSON.stringify(objPayload)});

				var objResp = https.post({url: 'https://api.box.com/2.0/folders', body: JSON.stringify(objPayload), headers: objHeader});

				log.audit({title: 'createFolder', details: 'response: ' + objResp.code + ' ' + objResp.body});

				if (objResp.code == 201) {

					var objFolder = JSON.parse(objResp.body);

					var recFolder = record.create({type: 'customrecord_box_record_folder'});
					recFolder.setValue({fieldId: 'custrecord_ns_record_id', value: objRecord.id.toString()});
					recFolder.setValue({fieldId: 'custrecord_box_record_folder_id', value: objFolder.id});
					recFolder.setValue({fieldId: 'custrecord_netsuite_record_type', value: objRecord.record});
					var id = recFolder.save();
					objFolder.status = 'success';
					return objFolder;
				}
				else{
					return {status: 'failed',
						message: objResp.code  + ':' + objResp.body};
				}
			}
		}
		catch (err){
			log.audit({title: 'createFolder', details: 'err:' + err});
			return {status: 'failed',
				message: 'ERROR: ' + err};
		}
	};
	
	update = function(option){

		var retMe = {
			request : option
		};
		
		var resp = https.put({
			url: 'https://api.box.com/2.0/folders/' + option.data.id, 
			body: JSON.stringify(option.data), 
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
	
	items = function(option){
		
		var retMe = {
			status : '',
			request : option
		};
			
		var resp = https.get({
			url: 'https://api.box.com/2.0/folders/'+ option.data.folder+'//items', 
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
				data: objBody.entries
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
    	create: create,
        update: update,
        items: items
    };
    
});
