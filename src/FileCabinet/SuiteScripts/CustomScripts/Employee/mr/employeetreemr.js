/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/runtime', 'N/file', 'N/query'],
/**
 * @param {record} record
 * @param {runtime} runtime
 * @param {file} file
 * @param {file} query
 */
function(record, runtime, file, query) {
   
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
    function getInputData() {
    	
    	var arrInput;
    	var idEmployee = runtime.getCurrentScript().getParameter({
            name: 'custscript_employeetreeid'
        });

    	var arrSupervisor = query.runSuiteQL({
			query: 'SELECT supervisor.custentity_employeetree + 1 AS employeetree '+
				   'FROM employee ' + 
			   	   'INNER JOIN employee supervisor ' +
				   'ON employee.supervisor = supervisor.id ' +
				   'WHERE employee.id =  ' + idEmployee
		}).asMappedResults();
    	
        var recEmployee = record.load({
            type: 'employee',
            id: idEmployee
        });
        
        recEmployee.setValue({fieldId: 'custentity_employeetree',
        	value: arrSupervisor[0].employeetree});
        
        var id = recEmployee.save();
    	
    	
		var sSqlRaw = file.load({
			id: 'SuiteScripts/CustomScripts/Employee/sql/employeetree.sql'
		}).getContents();
		
		sSql = sSqlRaw.replace('{ids}', idEmployee);
		
		arrInput = query.runSuiteQL({
			query: sSql
		}).asMappedResults();
		
		var ids = arrInput.map( function(a) {
			return a.employeeid;
		});
		
		var arrConcat = ids.length;
		
    	while (arrConcat.length > 0) {

    		sSql = sSqlRaw.replace('{ids}', ids.toString());
    		arrConcat = query.runSuiteQL({
    			query: sSql
    		}).asMappedResults();
    		
    		arrInput = arrInput.concat(arrConcat);
    		
    		ids = arrConcat.map( function(a) {
    			return a.employeeid;
    		});
    		
    	}
        
    	log.audit({
            title: 'getInputData',
            details: 'arrInput: ' + arrInput.length
        });
    	
        return arrInput;
    }

    /**
     * Executes when the map entry point is triggered and applies to each key/value pair.
     *
     * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
     * @since 2015.1
     */
    function map(context) {

        var objContext = JSON.parse(context.value);
        
        context.write({
            key: objContext.employeeid,
            value: objContext
        });
    }

    /**
     * Executes when the reduce entry point is triggered and applies to each group.
     *
     * @param {ReduceSummary} context - Data collection containing the groups to process through the reduce stage
     * @since 2015.1
     */
    function reduce(context) {

        var reduceData = JSON.parse(context.values[0]);
        
        var rec = record.load({
            type: 'employee',
            id: reduceData.employeeid
        });
        
        rec.setValue({fieldId: 'custentity_employeetree',
        	value: reduceData.employeetree});
        
        var id = rec.save();
        
    }


    /**
     * Executes when the summarize entry point is triggered and applies to the result set.
     *
     * @param {Summary} summary - Holds statistics regarding the execution of a map/reduce script
     * @since 2015.1
     */
    function summarize(summary) {

        var reduceSummary = summary.reduceSummary;
        
        reduceSummary.errors.iterator().each(function(key, value){
        	
            log.audit({
                title: 'summarize',
                details: 'Process id: ' + key + '. Error was: ' + JSON.parse(value).message 
            });
            
            return true;
        });
   	
    }
   
    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    };
    
});
