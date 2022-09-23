define(['N/https', 'N/record', 'N/file', 'N/query', '../../../Helper/sqlmapjson'],
/**
 * @param {https} https
 * @param {record} record
 * @param {file} file
 * @param {query} query
 * custom modules
 * @param {nsmapjson} sqlmapjson
 */
function(https, record, file, query, sqlmapjson) {
	
	
	create = function(option){

		var retMe = option;

		var objData = query.runSuiteQL({
			query: file.load({
				id: '../../sql/ptocreatecalendar.sql'
			}).getContents(),
			params: [option.id]
		}).asMappedResults()[0];
		
        var recMapping = record.load({
            type: 'customrecord_integration_mapping',
            id: 126 
        });
		
		var objMapping = JSON.parse(recMapping.getValue({
            fieldId: 'custrecord_intmap_mapping'
        }));
		
		var objPayload = sqlmapjson.generate({
			mapping: objMapping,
			sqldata: objData
		});
		
		objPayload.event.attendees = [{
			email: objPayload.user.email
		}, {
			email: objData.manageremail
		}];
		
        log.audit({
            title: 'calendar.create',
            details: 'payload: ' + JSON.stringify(objPayload)
        });
		
        var resp = https.post({
            url: 'https://api.servicerocket.org/v1/directory/pto',
            body: JSON.stringify(objPayload),
            headers: {
                'content-type': 'application/json',
                'x-api-key': '{custsecret_urdapikey}'
            },
			credentials : [ 'custsecret_urdapikey' ]
        });
		
		if (resp.code == 200 || resp.code == 201) {

			
	        log.audit({
	            title: 'calendar.create',
	            details: 'response: ' + resp.body
	        });
			
			var objBody = JSON.parse(resp.body);
			
			retMe.status = 'SUCCESS';
			retMe.response = {
				data: resp.body,
				message: 'Time-Off Reuest sent to URD'
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

        
        log.audit({
            title: 'calendar.create',
            details: 'response: ' + JSON.stringify(retMe)
        });
        
        return retMe;
	};
	
	update = function(option){
		
		var retMe = option;

		var objData = query.runSuiteQL({
			query: file.load({
				id: '../../sql/ptoupdatecalendar.sql'
			}).getContents(),
			params: [option.id]
		}).asMappedResults()[0];
		
        var recMapping = record.load({
            type: 'customrecord_integration_mapping',
            id: 126 //gsuite calendar create mapping
        });
		
		var objMapping = JSON.parse(recMapping.getValue({
            fieldId: 'custrecord_intmap_mapping'
        }));
		
		var objPayload = sqlmapjson.generate({
			mapping: objMapping,
			sqldata: objData
		});
		
		objPayload.event.attendees = [{
			email: objPayload.user.email
		}, {
			email: objData.manageremail
		}];
		
        log.audit({
            title: 'calendar.update',
            details: 'payload: ' + JSON.stringify(objPayload)
        });
		
        var resp = https.post({
            url: 'https://api.servicerocket.org/v1/directory/pto',
            body: JSON.stringify(objPayload),
            headers: {
                'content-type': 'application/json',
                'x-api-key': '{custsecret_urdapikey}'
            },
			credentials : [ 'custsecret_urdapikey' ]
        });
       
		if (resp.code == 200 || resp.code == 201) {

			var objBody = JSON.parse(resp.body);

			retMe.status = 'SUCCESS';
			
			retMe.response = {
				data: objBody,
				message: 'Time-Off Reuest sent to URD'
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

        
        log.audit({
            title: 'calendar.update',
            details: 'response: ' + JSON.stringify(retMe)
        });
        
        return retMe;
		
	};
	
	remove = function(option) {
		
		var rec = record.load({
		    type: option.type,
		    id: option.id,
		    isDynamic: true
		});
		
        var recMapping = record.load({
            type: 'customrecord_integration_mapping',
            id: xxx //gsuite calendar remove mapping
        });
		
		var objMapping = JSON.parse(recMapping.getValue({
            fieldId: 'custrecord_intmap_mapping'
        }));
		
		var objPayload = nsmapjson.generate({
		    record: rec,
		    mapping: objMapping
		});
		
		
        var response = https.post({
            url: '',
            body: objPayload,
            headers: {
                'content-type': 'application/json'
            },
            credentials: ["custsecret_googlecalendar_apikey"]
        });
	};
	
    return {
    	create: create,
    	update: update,
    	remove: remove
    };
    
});
