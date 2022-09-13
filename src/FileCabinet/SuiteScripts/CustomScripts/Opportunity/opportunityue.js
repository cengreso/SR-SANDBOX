/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/url', 'N/ui/serverWidget', '../Box/box'],

function(record, url, serverWidget, box) {
   
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
    	
    	if(scriptContext.type == 'view'){
    		
    		var form = scriptContext.form;
    		var newRec = scriptContext.newRecord;
    		
			var insertHml = form.addField({ id: 'custpage_pa_jquery1', type: serverWidget.FieldType.INLINEHTML, label: 'Opportunity ID'});
			var sParam = '&custpage_opportunity=' + newRec.id;
			var sURL = url.resolveScript({ scriptId: 'customscript_nvy_jsonupload_sl', deploymentId: 'customdeploy_nvy_jsonupload_sl'});
			var sButton = '$( \'.x-tool\' ).click(function() { location.reload();});';
			var html = '<script type="text/javascript"> function popUpload(){{popup} {button}} </script>';
			sURL = sURL + sParam;
			
			var sScript = 'nlExtOpenWindow(\''	+ sURL + '\', \'upload_estimate\', 300, 200, null, false, \'Upload Estimate JSON\', null);';
				html = html.replace('{popup}', sScript);
				html = html.replace('{button}', sButton);
			
			insertHml.defaultValue = html;
			form.addButton({id : 'custpage_btn_jsonupload', label : 'Upload Estimate JSON', functionName: 'popUpload' });
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
            var newRec = record.load({type: newRecord.type, id: newRecord.id, isDynamic : true });
            
            if(scriptContext.type == scriptContext.UserEventType.CREATE || scriptContext.type == scriptContext.UserEventType.EDIT) {
            	
                if(newRecord.id != '') {
                	
                    var intFolderId = box.getBoxFolderId(JSON.stringify(newRecord.id), newRecord.type);

                    if(intFolderId != '') {
                        var objData = {};
                        var stURL = 'https://servicerocket.app.box.com/folder/';
                        newRec.setValue('custbody_box_url', stURL+intFolderId);
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
        beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    };
    
});
