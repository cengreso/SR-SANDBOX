define(['N/record', './lib/employeetree'],

function(record, employeetree) {
	
	updateFuncMapFields = function(newRec) {
		
		try{
			var recEmployee = record.load({type: newRec.type, id: newRec.id, isDynamic: true});
			
			var recHcm = record.load({type: 'hcmjob', id: recEmployee.getValue({fieldId: 'job'}), isDynamic: true});
			recHcm = hcmfmupdate.updateFuncMapFields(newRec);
			recHcm.save();	
		}
		catch(e) { log.debug('ERROR', e); }
	};
	
	updateEmployeeTree = function(option){
		
		return  employeetree.update(option);
	};
	
	getDirectReport = function(option){
		
		return employeetree.getDirectReport(option);
	};
	
	getAllReport = function(option){
		
		return employeetree.getAllReport(option);
	};
	
	
    return {
		updateFuncMapFields: updateFuncMapFields,
		updateEmployeeTree: updateEmployeeTree,
		getDirectReport: getDirectReport,
		getAllReport: getAllReport
    };
    
});
