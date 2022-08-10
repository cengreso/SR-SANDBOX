define(['N/record', 'N/query', 'N/task', 'N/file'],
/**
 * @param {record} record
 * @param {query} query
 * @param {query} task
 * @param {query} file
 */
function(record, query, task, file) {
	
	update = function(option){
		
        log.audit({
            title: 'employeetree',
            details: 'update'
        });
		
		var tsk = task.create({
	        taskType: task.TaskType.MAP_REDUCE,
	        scriptId: 'customscript_employeetree_mr',
	        params : {
	                'custscript_employeetreeid' : option.id
	            }
	    });
		
		var idTsk = tsk.submit();
	};
	
	getFamily = function(option) {

		var sSql = file.load({
			id: 'SuiteScripts/CustomScripts/Employee/sql/allemployee.sql'
		}).getContents();
		
    	var arrRocketeer = query.runSuiteQL({
			query: sSql
		}).asMappedResults();
		
        var hashTable = {};
		
        arrRocketeer.forEach(function(rocketeer){
			hashTable[rocketeer.id] = rocketeer;
			hashTable[rocketeer.id].team = [];
			hashTable[rocketeer.id].teamids = [];
			hashTable[rocketeer.id].ids = [];
		});
		
		var retMe = [];

		arrRocketeer.forEach(function(rocketeer){
			
			if (rocketeer.parentid){
				
				try{
	                var idParent = rocketeer.parentid;
	                var idEmployee = rocketeer.id;
	                var team = hashTable[idEmployee];
	                //delete team['parentid'];

                	hashTable[idParent].team.push(team);	
                	hashTable[idParent].ids.push(idEmployee);	
                	hashTable[idParent].teamids.push(idEmployee);
	                hashTable[idParent].ids = hashTable[idParent].ids.concat(team.ids);
				}
				catch (err){
				

	                log.audit({ 
	                	title: 'createDataTree', 
	                	details: 'idParent: ' + idParent  + ' is inactive.'
	                });
				}
			}
			else{
				retMe.push(hashTable[rocketeer.id]);
			}
		});
		
		return retMe;
	};
	
	getDirectReport = function(option){
		
		var retMe;
		
		var arrFamily = getFamily();
		
	    JSON.stringify(arrFamily , function(_, nestedValue){
	    	
			if (nestedValue && nestedValue['id'] === option.id) {
				retMe = nestedValue;
	        }
	        return nestedValue;
		});

	    return retMe.teamids;
	};
	
	getAllReport = function(option){
		
		var retMe;
		
		var arrFamily = getFamily();
		
	    JSON.stringify(arrFamily , function(_, nestedValue){
	    	
			if (nestedValue && nestedValue['id'] === option.id) {
				retMe = nestedValue;
	        }
	        return nestedValue;
		});
	    
	    return retMe.ids;
	};
	
	getManagers = function(option){
		
		var retMe = [];
		
		var arrFamily = getFamily();
        var nLevel = 10;
        var id = option.id;
        
        while (nLevel > 1) {

            JSON.stringify(arrFamily, function (_, nestedValue) {

                try {
                    if (nestedValue && nestedValue['id'] == id) {
                        id = nestedValue['parentid'];
                        nLevel = nestedValue['level'];
                        retMe.push(id);
                    }
                } catch (err) {}

                return nestedValue;
            });
        }
	    
	    return retMe;
	};
	
    return {
    	update: update,
    	getDirectReport: getDirectReport,
    	getAllReport: getAllReport,
    	getManagers: getManagers
    };
    
});
