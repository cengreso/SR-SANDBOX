/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/runtime', 'N/url', 'N/ui/serverWidget', 'N/file', '../../Box/box', '../api/opportunity', '../../NetSpot/api/netspot'],

    function (record, runtime, url, serverWidget, file, box, opportunity, netspot) {

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

        try {

            if (scriptContext.type == scriptContext.UserEventType.VIEW) {

                var form = scriptContext.form;
                var newRec = scriptContext.newRecord;
                var html = file.load({
                    id: 96299
                }).getContents(); //btnhtml.html
                
                var insertHml = form.addField({
                    id: 'custpage_pa_jquery1',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: 'Opportunity ID'
                });

                //uploadjson
                var sURL = url.resolveScript({
                    scriptId: 'customscript_nvy_jsonupload_sl',
                    deploymentId: 'customdeploy_nvy_jsonupload_sl'
                });
                sURL = sURL + '&custpage_opportunity=' + newRec.id;
                html = html.replace('{surl1}', sURL);

                //createtask
                var sURL = url.resolveScript({
                    scriptId: 'customscript_tsk_task_opp_sl',
                    deploymentId: 'customdeploy_tsk_task_opp_sl'
                });
                sURL = sURL + '&opportunity=' + newRec.id;
                html = html.replace('{surl2}', sURL);

                //update margin
                var sURL = url.resolveScript({
                    scriptId: 'customscript_opps_margin_selector_sl',
                    deploymentId: 'customdeploy_opps_margin_selector_sl'
                });
                
                sURL = sURL + '&custpage_opportunity=' + newRec.id;
                html = html.replace('{surl3}', sURL);
                html = html.replace('{hsid}', newRec.getValue({
                	fieldId: 'custbody_hubspot_id'
                }));

                insertHml.defaultValue = html;
                form.addButton({
                    id: 'custpage_btn_jsonupload',
                    label: 'Upload Estimate JSON',
                    functionName: 'popUpload'
                });
                form.addButton({
                    id: 'custpage_btn_createtask',
                    label: 'Create Closing Plan',
                    functionName: 'popTask'
                });
                form.addButton({
                    id: 'custpage_btn_createtask',
                    label: 'Update Margin',
                    functionName: 'popMargin'
                });
                
                if(newRec.getValue({
                	fieldId: 'custbody_hubspot_id'
                }) > 0){
                	
                    form.addButton({
                        id: 'custpage_btn_openhubspot',
                        label: 'Open in HubSpot',
                        functionName: 'openHubspot'
                    });                	
                }
            }
        } 
		catch (err) {

            log.audit({
                title: 'beforeLoad',
                details: 'beforeLoad error: ' + err
            });

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

        if (scriptContext.type == scriptContext.UserEventType.CREATE || scriptContext.type == scriptContext.UserEventType.EDIT) {

            try {
                var newRec = scriptContext.newRecord;
                newRec.setValue({
                    fieldId: 'custbody_related_project',
                    value: newRec.getValue({
                        fieldId: 'job'
                    })
                });

            } 
			catch (err) {
                log.audit({
                    title: 'beforeSubmit',
                    details: 'err: ' + err
                });
            }
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
    afterSubmit = function (scriptContext) {

        try {

            var isUpdated = false;
            var newRecord = scriptContext.newRecord;
            var newRec = record.load({
                type: newRecord.type,
                id: newRecord.id,
                isDynamic: true
            });

            if (scriptContext.type == scriptContext.UserEventType.CREATE || scriptContext.type == scriptContext.UserEventType.EDIT) {

                if (scriptContext.type == scriptContext.UserEventType.CREATE 
                		&& (runtime.executionContext === runtime.ContextType.USER_INTERFACE ||
                		runtime.executionContext === runtime.ContextType.RESTLET) ) {

                    var objFolder = opportunity.createFolder(newRec);
                    
                    log.audit({
                        title: 'afterSubmit',
                        details: 'folder:' + JSON.stringify(objFolder)
                    });
                }
                else if (scriptContext.type == scriptContext.UserEventType.EDIT 
                		&& runtime.executionContext === runtime.ContextType.USER_INTERFACE 
                		&& (newRec.getValue('custbody_box_url') == '' || !newRec.getValue('custbody_box_url'))) {

                    var objFolder = opportunity.createFolder(newRec);
                    
                    log.audit({
                        title: 'afterSubmit',
                        details: 'folder:' + JSON.stringify(objFolder)
                    });
                }

                if (newRecord.id != '') {

                    var intFolderId = box.getBoxFolderId(JSON.stringify(newRecord.id), newRecord.type);

                    if (intFolderId != '') {
                        var objData = {};
                        var stURL = 'https://servicerocket.app.box.com/folder/';
                        newRec.setValue('custbody_box_url', stURL + intFolderId);
                        isUpdated = true;
                    }
                }
            }

            if (isUpdated) {
                newRec.save();
            }

        } 
		catch (e) {
            log.debug('ERROR', e);
        }
    }

    return {
        beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    };

});
