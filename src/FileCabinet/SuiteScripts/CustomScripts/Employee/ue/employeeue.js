/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/runtime', 'N/file', 'N/url', 'N/ui/serverWidget', '../../Library/handlebars', '../api/employee', '../../Box/box', '../../Workplace/api/workplace'],
/**
 * @param {record} record
 * @param {runtime} runtime
 */
function(record, runtime, file, url, serverWidget, handlebars, employee, box, workplace) {
   
    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {string} scriptContext.type - Trigger type
     * @param {Form} scriptContext.form - Current form
     * @Since 2015.2
     */
	beforeLoad = function (scriptContext) {
    	
    	try{
    		
    		if(scriptContext.type == scriptContext.UserEventType.VIEW ){
    			
                var form = scriptContext.form;
                var newRec = scriptContext.newRecord;
                var sTemplate = file.load({
				                    id: '../btn/btnhtml.html'
				                }).getContents(); 

                var insertHml = form.addField({
                    id: 'custpage_pa_jquery1',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: 'JQ'
                });

                var sHandlebar = handlebars.compile(sTemplate);
                var sHtml = sHandlebar({
                				id: newRec.id
                			});

                insertHml.defaultValue = sHtml;

                form.addButton({
                    id: 'custpage_btn_upload',
                    label: 'Print T&Cs',
                    functionName: 'printTandC'
                });
                
                form.addButton({
                    id: 'custpage_btn_upload',
                    label: 'Print Offer',
                    functionName: 'printOffer'
                });
                
        	}	
    	}
    	catch (err){
        	log.audit({title: 'employee.beforeLoad' , details: 'err: ' + err});
        }
    };

    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
	beforeSubmit = function (scriptContext) {
            
    };

    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    afterSubmit = function (scriptContext) {

    	var newRecord = scriptContext.newRecord;
    	var oldRecord = scriptContext.oldRecord;

        var recCurrent = record.load({
            type: newRecord.type,
            id: newRecord.id
        })

        try{
            workplace.updateSkillSet({
                recRecord: recCurrent,
                stWorkplaceId: recCurrent.getValue({fieldId: 'custentity_workplace_id'})
            })
        }catch(err) {
            log.error('an error occured', err)
        }
       

        log.audit({
            title: 'afterSubmit',
            details: 'afterSubmit: ' + scriptContext.type
        });
    	
    	
    	if(runtime.executionContext !== runtime.ContextType.USERINTERFACE){
    		
    		if(scriptContext.type == scriptContext.UserEventType.CREATE ||
        			scriptContext.type == scriptContext.UserEventType.EDIT){
    			employee.updateFuncMapFields(newRecord);
        	}	
    		
    	}
    	
        try {

        	var isUpdated = false;
            var newRec = record.load({type: newRecord.type, id: newRecord.id, isDynamic : true });
            
            if(scriptContext.type == scriptContext.UserEventType.CREATE || scriptContext.type == scriptContext.UserEventType.EDIT) {
            	
            	if( scriptContext.type == scriptContext.UserEventType.CREATE){
            		employee.updateEmployeeTree({
            			id: newRecord.id
            		});
            	}
            	else if ( scriptContext.type == scriptContext.UserEventType.EDIT){
            		
                	if(newRecord.getValue('supervisor') != oldRecord.getValue('supervisor')){
            		
                    log.audit({
                        title: 'afterSubmit',
                        details: 'afterSubmit: editing'
                    });
            		
                		employee.updateEmployeeTree({
                			id: newRecord.id
                		});	
                	}
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
            
            
        } catch(e) { log.debug('ERROR', e); }
    	
    	
    }

    return {
    	beforeLoad: beforeLoad,
        afterSubmit: afterSubmit
    };
    
});
