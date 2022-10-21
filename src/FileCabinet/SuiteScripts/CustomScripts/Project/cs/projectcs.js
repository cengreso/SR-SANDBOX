/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/ui/message', 'N/runtime', '../api/project'],

function(message, runtime, project) {
    
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
        project.setTemplate({
            scriptContext: scriptContext
        })

        project.setTemplateListOnFieldChange({
            scriptContext: scriptContext
        })
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
    	
    	var recCurr = scriptContext.currentRecord;
    	var idJenniferSzuszan = 8754;
    	
    	if(recCurr.getValue({fieldId: 'subsidiary'}) == 1){
    		
			if(runtime.getCurrentUser().id != idJenniferSzuszan){
				
				try{
					
	    			var messSubsidiary = message.create({
	    	            title: 'SUBSIDIARY_ERROR',
	    	            message: 'We are not allowed to create projects under the Service Rocket Global Inc. Please select the right Subsidiary.',
	    	            type: message.Type.ERROR
	    	        });
	    			
	    			messSubsidiary.show();
	    			
	    			return false;
				}
				catch(err){

					return false;
				}
			}
		}
		else if(recCurr.getValue('custentity4') == 7){ //PS
			
            if(recCurr.getValue('jobtype') == 112 || 
                recCurr.getValue('jobtype') == 119 ||
                recCurr.getValue('jobtype') == 110 ||
                recCurr.getValue('jobtype') == 116 ||
                recCurr.getValue('jobtype') == 117 ||
                recCurr.getValue('jobtype') == 118){

                return true;
            }

			if(scriptContext.currentRecord.id){
				
				if(recCurr.getValue('entitystatus') == 1 ||
						recCurr.getValue('entitystatus') == 2){
					
                    if(recCurr.getValue('parent') == recCurr.getValue('customer')){

                        var hasNPS = false;
					
                        hasNPS = project.checkNPSContact({
                            record: recCurr
                        });
                        
                        if(!hasNPS){
                            
                            var messNps = message.create({
                                title: 'NPS_SURVEY',
                                message: "This Project doesn't have an NPS Survey Contact. Please add an NPS Survey Contact under Relationships tab.",
                                type: message.Type.ERROR
                            });
    
                            messNps.show();
                            
                            return false;
                        }
                        else{

                            if(hasNPS.hubspotid == null && hasNPS.hubspotid == ''){

                                var messNps = message.create({
                                    title: 'NPS_SURVEY',
                                    message: "The NPS Survey Contact does not contain HubSpot ID. Please check if the contact exists in HubSpot, get the HubSpot ID and update the NPS Survey Contact.",
                                    type: message.Type.ERROR
                                });

                                    
                                messNps.show();
                                
                                return false;
                            }
                        }
                    }
				}
			}
			else{
				
				if(recCurr.getValue('entitystatus') == 1 || 
						recCurr.getValue('entitystatus') == 2){
					
					recCurr.setValue({
						fieldId: 'entitystatus',
						value: 4 //To Be Setup
					});
				}

			}
		}
		
		return true;
    }

    return {
//        pageInit: pageInit,
        fieldChanged: fieldChanged,
//        postSourcing: postSourcing,
//        sublistChanged: sublistChanged,
//        lineInit: lineInit,
//        validateField: validateField,
//        validateLine: validateLine,
//        validateInsert: validateInsert,
//        validateDelete: validateDelete,
//        saveRecord: saveRecord
    };
    
});
