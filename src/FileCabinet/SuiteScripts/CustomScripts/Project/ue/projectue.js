/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/runtime', 'N/ui/serverWidget', 'N/file', '../../Box/box', '../api/project'],

function(record, runtime, serverWidget, file, box, project) {
   
    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {string} scriptContext.type - Trigger type
     * @param {Form} scriptContext.form - Current form
     * @Since 2015.2
     */
    function beforeLoad(scriptContext) {

    	try{
    		
            //Set the list of projects Templates based on the Project Template Mapping Record
            project.setTemplateListBeforeLoad({
                scriptContext: scriptContext
            })
            
    		 if(scriptContext.type == scriptContext.UserEventType.VIEW || scriptContext.type == scriptContext.UserEventType.EDIT) {

    			 project.getLatestRAG(scriptContext);

                 if(scriptContext.type == scriptContext.UserEventType.VIEW){

                    var form = scriptContext.form;

                    var html = file.load({
                        id: '../btn/btn.html'
                    }).getContents(); //btn.html
    
                    var insertHml = form.addField({
                        id: 'custpage_pa_jquery1',
                        type: serverWidget.FieldType.INLINEHTML,
                        label: 'JQ'
                    });

                    insertHml.defaultValue = html.replace(/{{id}}/g, scriptContext.newRecord.id);

                    form.addButton({
                        id: 'custpage_btn_scopingdoc',
                        label: 'Scoping Document ',
                        functionName: 'printScopingDoc'
                    });
                }
    		 }
    	}
    	catch(err){
    		log.audit({ title: 'beforeLoad', details: 'getLatestRAG: '+ err});
    	}
    	
    }

    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    function beforeSubmit(scriptContext) {
    	
    }

    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    function afterSubmit(scriptContext) {
    	
        try {

        	var isUpdated = false;
            var newRecord = scriptContext.newRecord;
            var oldRecord = scriptContext.oldRecord;
            var newRec = record.load({
            	type: newRecord.type, 
            	id: newRecord.id, 
            	isDynamic : true 
            });
            
            if(scriptContext.type == scriptContext.UserEventType.CREATE || scriptContext.type == scriptContext.UserEventType.EDIT) {
         	
            	if(scriptContext.type == scriptContext.UserEventType.CREATE && runtime.executionContext === runtime.ContextType.USER_INTERFACE){

            		//***updated,deployed 10 Mar 2021 ITSM-666
            		
            		var idParent = newRec.getValue({fieldId: 'parent'});
            		var idCustomer = newRec.getValue({fieldId: 'customer'});
            		
            		if(idParent != idCustomer){
           				var id = project.copyParentFolder(newRec);
           			}
            		else {
            			var objFolder = project.createFolder(newRec);
                	}
            		
            		//***
            		
            		newRec = project.updateHours(newRec);
            		isUpdated = true;
            		
            	}
            	else if(scriptContext.type == scriptContext.UserEventType.EDIT && 
            			runtime.executionContext === runtime.ContextType.USER_INTERFACE){
            		
            		if(newRecord.getValue('custentity4') == 7){
            			
            			if(newRecord.getValue('parent') == newRecord.getValue('customer')){
            				
            				var respNps = project.sendNPS({
            					newrecord: newRecord,
            					oldrecord: oldRecord
            				});	
                		}
            		}

            		newRec = project.updateHours(newRec);
            		isUpdated = true;
            	}
            	else if((newRecord.getValue({fieldId: 'custentity_sr_box_folder_url'}) == '' ||   newRecord.getValue({fieldId: 'custentity_sr_box_folder_url'}) ==null) &&
            			scriptContext.type == scriptContext.UserEventType.EDIT && runtime.executionContext === runtime.ContextType.USER_INTERFACE){
            		
            		var objFolder = project.createFolder(newRec);
            		log.audit({title: 'afterSubmit', details: 'folder:' + JSON.stringify(objFolder)});
            	}
            	
                if(newRecord.id != '') {
                	
                    var intFolderId = box.getBoxFolderId(JSON.stringify(newRecord.id), newRecord.type);

                    if(intFolderId != '') {
                        var objData = {};
                        var stURL = 'https://servicerocket.app.box.com/folder/';
                        newRec.setValue('custentity_sr_box_folder_url', stURL+intFolderId);
                        isUpdated = true;
                    }
                }
            }
            
            if(isUpdated){
            	newRec.save();
            }
            
            
        }
        catch(err) {
        	
        	log.audit({
        		title: 'projectue.afterSubmit', 
        		details: 'error' + err
        	}); 
        }
    }

    return {
        beforeLoad: beforeLoad,
        afterSubmit: afterSubmit
    };
    
});
