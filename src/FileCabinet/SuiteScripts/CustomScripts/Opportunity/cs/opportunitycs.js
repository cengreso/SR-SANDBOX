/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/ui/message'],

function(message) {
    
    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */
    function pageInit(scriptContext) {
    	

    }

    /**
     * Function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @since 2015.2
     */
    function fieldChanged(scriptContext) {
    	
    	var currRec = scriptContext.currentRecord;
    	
    	if(scriptContext.sublistId == 'salesteam'){
    		
    		if( scriptContext.fieldId == 'isprimary'){

    			if(currRec.getCurrentSublistValue({sublistId: scriptContext.sublistId, fieldId: scriptContext.fieldId }) == true){
    				
    				currRec.setCurrentSublistValue({sublistId: scriptContext.sublistId, fieldId: 'contribution', value: 100});
    				
    				for (var nLine = 0; nLine < currRec.getLineCount({sublistId: scriptContext.sublistId}); nLine++) {
    					
    					if(currRec.getSublistValue({sublistId: scriptContext.sublistId, fieldId: 'isprimary', line: nLine }) != true &&
    							currRec.getSublistValue({sublistId: scriptContext.sublistId, fieldId: 'contribution', line: nLine }) != 0){
    						
    						currRec.selectLine({sublistId: scriptContext.sublistId, line: nLine});
    						currRec.setCurrentSublistValue({sublistId: scriptContext.sublistId, fieldId: 'contribution', value: 0});	
    					}
					}
    				
    			}
    			else{
    				currRec.setCurrentSublistValue({sublistId: scriptContext.sublistId, fieldId: 'contribution', value: 0});
    			}
    		}
    	}
    	
    }

    /**
     * Function to be executed when field is slaved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     *
     * @since 2015.2
     */
    function postSourcing(scriptContext) {

    }

    /**
     * Function to be executed after sublist is inserted, removed, or edited.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function sublistChanged(scriptContext) {

    }

    /**
     * Function to be executed after line is selected.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function lineInit(scriptContext) {

    }

    /**
     * Validation function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @returns {boolean} Return true if field is valid
     *
     * @since 2015.2
     */
    function validateField(scriptContext) {
   	
    }

    /**
     * Validation function to be executed when sublist line is committed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateLine(scriptContext) {

    }

    /**
     * Validation function to be executed when sublist line is inserted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateInsert(scriptContext) {

    }

    /**
     * Validation function to be executed when record is deleted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateDelete(scriptContext) {

    }

    /**
     * Validation function to be executed when record is saved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @returns {boolean} Return true if record is valid
     *
     * @since 2015.2
     */
    function saveRecord(scriptContext) {
    	
    	var currRec = scriptContext.currentRecord;
    	
		if(currRec.getValue({fieldId: 'subsidiary'}) == 1){
    		
			try{
				
    			var messSubsidiary = message.create({
    	            title: 'SUBSIDIARY_ERROR',
    	            message: 'We are not allowed to create transactions under the Service Rocket Global Inc. Please select the right Subsidiary.',
    	            type: message.Type.ERROR
    	        });
    			
    			messSubsidiary.show();
    			
    			return false;
			}
			catch(err){
				console.log(err);
				return false;
			}
		}
		
		return true;
		
    }

    return {
//    	  pageInit: pageInit,
          fieldChanged: fieldChanged,
//        postSourcing: postSourcing,
//        sublistChanged: sublistChanged,
//        lineInit: lineInit,
//        validateField: validateField,
//        validateLine: validateLine,
//        validateInsert: validateInsert,
//        validateDelete: validateDelete,
          saveRecord: saveRecord
    };
    
});
