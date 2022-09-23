define(['N/record'],
/**
 * @param {record} record
 */
function(record) {
   
	log = function (data){
		
		var recLogs = record.create({
			type : 'customrecord_integration_logs',
			isDynamic : true
		});
		
		recLogs.setValue({
		    fieldId: 'custrecord_integlogs_module',
		    value: data.module
		});
		recLogs.setValue({
		    fieldId: 'custrecord_integlogs_logs',
		    value: data.logs
		});

		var id = recLogs.save();
		
	};
    return {
        log: log
    };
    
});
