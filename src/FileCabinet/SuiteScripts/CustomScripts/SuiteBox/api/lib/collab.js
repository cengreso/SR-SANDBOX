/**
 * @NApiVersion 2.1
 */
define(['N/https','N/search','../../../Helper/jsonmapns','N/record', 'N/runtime'],
function(https,search, jsonmapns,record, runtime){


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

			log.debug({title: 'suitebox.addCollab', details: options});

			if (options.email != undefined){
				objAccessibleBy.login = options.objCollab.email;
				// options.email = options.objCollab.email;
			} else if (options.userid != undefined){
				objAccessibleBy.id = options.userid;
			}

			var recMapping = record.load({type:'customrecord_integration_mapping',id:132});
			var jsonMap = JSON.parse(recMapping.getValue('custrecord_intmap_mapping'));
			log.debug('jsonMap',jsonMap)
			log.debug('options',options)
			var payload;

			// for (const key of jsonMap) {
			// 	log.debug(key)
			// 	log.debug(jsonMap)
			// }

			for (var key = 0; key < Object.keys(jsonMap).length; key++) {
				payload = jsonmapns.jsonGetValue({
					mapping: jsonMap,
					data: options,
					key: Object.keys(jsonMap)[key]
				});
				log.debug('payload', payload)
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
			log.error('error', 'ERROR: ' + err);
		}
	}

	return {
		addCollab:addCollab,
	}

});
