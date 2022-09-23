define(['N/record'],
/**
 * @param {record} record
 */
function(record) {
   
	log = function (data){
		
		var recLog = record.create({
			type : 'customrecord_integration_logs',
			isDynamic : true
		});
		
		recLog.setValue({
		    fieldId: 'custrecord_integlogs_module',
		    value: data.module
		});
		recLog.setValue({
		    fieldId: 'custrecord_integlogs_logs',
		    value: data.logs
		});

		var id = recLogs.save();
		
	};
    return {
        log: log
    };
    
});
