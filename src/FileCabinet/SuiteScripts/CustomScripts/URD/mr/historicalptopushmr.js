/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/https', 'N/record', 'N/file', 'N/query', '../../Helper/sqlmapjson'],
/**
 * @param {https} https
 * @param {record} record
 * @param {file} file
 * @param {query} query
 * custom modules
 * @param {nsmapjson} sqlmapjson
 */
function(https, record, file, query, sqlmapjson) {
   
    /**
     * Marks the beginning of the Map/Reduce process and generates input data.
     *
     * @typedef {Object} ObjectRef
     * @property {number} id - Internal ID of the record instance
     * @property {string} type - Record type id
     *
     * @return {Array|Object|Search|RecordRef} inputSummary
     * @since 2015.1
     */
	getInputData = function () {
	  	
		var arrInput = query.runSuiteQL({
			query: file.load({
				id: '../sql/ptohistorycalendar.sql'
			}).getContents()
		});
	  	
        log.audit({
	        title: 'getInputData',
	        details: 'arrInput: ' + arrInput.length
	    });
        
        
        for (var index in arrInput) {
        	arrInput[index].key = arrInput[index].id;
        }

    };

    /**
     * Executes when the map entry point is triggered and applies to each key/value pair.
     *
     * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
     * @since 2015.1
     */
    
    map = function (context) {
    	
        var objContext = JSON.parse(context.value);
        var mapKey = objContext.id;
        var mapValue = objContext;
        
        context.write({
            key: mapKey,
            value: mapValue
        });
    };

    /**
     * Executes when the reduce entry point is triggered and applies to each group.
     *
     * @param {ReduceSummary} context - Data collection containing the groups to process through the reduce stage
     * @since 2015.1
     */
    reduce = function (context) {

    	
        var objContext = JSON.parse(context.values[0]);
        var reduceData = objContext;
        
        log.audit({
	        title: 'reduce',
	        details: 'reduceData: ' + JSON.stringify(reduceData)
	    });
        
//        var recMapping = record.load({
//            type: 'customrecord_integration_mapping',
//            id: 126 
//        });
//		
//		var objMapping = JSON.parse(recMapping.getValue({
//            fieldId: 'custrecord_intmap_mapping'
//        }));
//		
//		var objPayload = sqlmapjson.generate({
//			mapping: objMapping,
//			sqldata: reduceData
//		});
//		
//		objPayload.event.attendees = [{
//			email: objPayload.user.email
//		}, {
//			email: objData.manageremail
//		}];
//		
//        log.audit({
//            title: 'calendar.create',
//            details: 'payload: ' + JSON.stringify(objPayload)
//        });
//		
//        var resp = https.post({
//            url: 'https://api.servicerocket.org/v1/directory/pto',
//            body: JSON.stringify(objPayload),
//            headers: {
//                'content-type': 'application/json',
//                'x-api-key': '{custsecret_urdapikey}'
//            },
//			credentials : [ 'custsecret_urdapikey' ]
//        });
//		
//		if (resp.code == 200 || resp.code == 201) {
//
//			
//	        log.audit({
//	            title: 'calendar.create',
//	            details: 'response: ' + resp.body
//	        });
//			
//			var objBody = JSON.parse(resp.body);
//			
//			retMe.status = 'SUCCESS';
//			retMe.response = {
//				data: resp.body,
//				message: 'Time-Off Reuest sent to URD'
//			};
//		}
//		else {
//
//			var objBody = {};
//
//			try {
//				objBody = JSON.parse(resp.body);
//			}
//			catch (err) {
//
//				var e = err;
//				objBody.message = resp.body;
//			}
//
//			retMe.status = 'FAILED';
//			retMe.response = {
//				message: resp.code + ': ' + objBody.message
//			};
//		}
//
//        
//        log.audit({
//            title: 'calendar.create',
//            details: 'response: ' + JSON.stringify(retMe)
//        });
        
        
        
        
    	
    };


    /**
     * Executes when the summarize entry point is triggered and applies to the result set.
     *
     * @param {Summary} summary - Holds statistics regarding the execution of a map/reduce script
     * @since 2015.1
     */
    function summarize(summary) {

    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    };
    
});
