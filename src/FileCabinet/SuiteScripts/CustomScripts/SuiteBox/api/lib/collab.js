
define(['N/https','N/search'],
function(https,search){


	/* ORIGINAL
		//add sales rep
		var objCollab = suitebox.addCollab({type: 'folder',
			id: objFolder.id ,
			email: emailSalesRep, // OR userid: '53397',
			role: 'co-owner',
			usertype: 'user'}, 'opportunity');
	*/
	/* MODIFIED
		var objCollab = suitebox.addCollab({
			type: 'folder',
			id: objFolder.id ,
			email: emailSalesRep, // OR userid: '53397',
			role: 'co-owner',
			usertype: 'user',
			recType:'opportunity'
		});
	*/


	addCollab = function (options){ // options.objCollab, options.recType

		try {
			var objAccessibleBy = { type : options.usertype }

			log.debug({title: 'suitebox.addCollab', details: 'options.objCollab: ' + JSON.stringify(options)});

			if (options.email != undefined){
				objAccessibleBy.login = options.objCollab.email;
			} else if (options.userid != undefined){
				objAccessibleBy.id = options.userid;
			}

			var objPayload = {
				item: {
					type: options.type,
					id: options.id
				},
				accessible_by: objAccessibleBy,
				role: options.role
			};

			log.debug({title: 'suitebox.addCollab', details: 'request: ' + JSON.stringify(objPayload)});
			log.debug('objAccessibleBy', objPayload)
			var objResp = https.post({
				url: 'https://api.box.com/2.0/collaborations',
				body: JSON.stringify(objPayload),
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer {custsecret_box_apikey}',
				},
				credentials: ['custsecret_box_apikey']
			});



			log.debug({title: 'suitebox.addCollab', details: 'response: ' + objResp.code + ' ' + objResp.body});

			if (objResp.code == 201) {

				var objFolder = JSON.parse(objResp.body);
				objFolder.status = 'success';
				return objFolder;
			}
			else{
				return {status: 'failed',
					message: objResp.code  + ':' + objResp.body};
			}
		}
		catch (err){
			return {status: 'failed',
				message: 'ERROR: ' + err};
		}
	}

	return {
		addCollab:addCollab,
	}

});
