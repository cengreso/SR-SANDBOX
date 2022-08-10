/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search'],
/**
 * @param {record} record
 * @param {search} search
 */
function(record, search) {
   
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
    	
    	var src = search.create({
    	    type: 'employee',
    	    columns: ['internalid']
    	});

    	var res;

    	src.filters = [];
    	src.filters.push(search.createFilter({
    	        name: 'custentity_employeetree',
    	        operator: search.Operator.EQUALTO,
    	        values: 0
    	    }));

    	src.filters.push(search.createFilter({
    	        name: 'isinactive',
    	        operator: search.Operator.IS,
    	        values: false
    	    }));

    	res = getAllResults(src);
    	var ids = [res[0].id];

    	src.filters = [];
    	src.filters.push(search.createFilter({
    	        name: 'supervisor',
    	        operator: search.Operator.ANYOF,
    	        values: ids
    	    }));

    	var nTree = 0;
    	var arrInput = [];
    	
    	while (res.length > 0) {
    	//while (nTree < 1) {

    	    nTree++;

    	    res = getAllResults(src);
    	    ids = [];

    	    res.forEach(function (result) {
    	    	
    	        arrInput.push({
    	        	employee: result.id,
    	            tree: nTree
    	        });
    	        
    	        ids.push(result.id);
    	    });

    	    src.filters = [];
    	    src.filters.push(search.createFilter({
    	            name: 'supervisor',
    	            operator: search.Operator.ANYOF,
    	            values: ids
    	        }));

    	    src.filters.push(search.createFilter({
    	        name: 'isinactive',
    	        operator: search.Operator.IS,
    	        values: false
    	    }));
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
            key: objContext.employee,
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
            id: reduceData.employee
        });
        
        rec.setValue({fieldId: 'custentity_employeetree',
        	value: reduceData.tree});
        
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

    getAllResults = function (s) {
		
        var results = s.run();
        var searchResults = [];
        var searchid = 0;
        do {
            var resultslice = results.getRange({start:searchid,end:searchid+1000});
            resultslice.forEach(function(slice) {
                searchResults.push(slice);
                searchid++;
                }
            );
        } while (resultslice.length >=1000);
        return searchResults;
    };
    
    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    };
    
});
