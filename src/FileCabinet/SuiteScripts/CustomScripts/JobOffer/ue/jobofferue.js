/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/file', 'N/ui/serverWidget'],
/**
 * @param {file} file
 * @param {serverWidget} serverWidget
 */
function(file, serverWidget) {
   
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
			var html = file.load({id: 186635}).getContents();//btnhtml.html
			var insertHml = form.addField({
			    id: 'custpage_pa_jquery1',
			    type: serverWidget.FieldType.INLINEHTML,
			    label: 'JQ'
			});

			html = html.replace('{jrid}', newRec.getValue('custrecord_jo_jobrequisition'));
			insertHml.defaultValue = html;
			
			html = html.replace('{jobofferid}', newRec.id);
			insertHml.defaultValue = html;
			
			form.addButton({
			    id: 'custpage_btn_openjr',
			    label: 'Job Requisition',
			    functionName: 'openRequisition'
			});

			form.addButton({
			    id: 'custpage_btn_createemployee',
			    label: 'Create Employee',
			    functionName: 'createEmployee'
			});
			
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
		//NS : HS
		GLOBAL_MAPPING = {
			'custrecord_jo_fullname':'name',
			'custrecord_jo_firstname':"first_name",
			'custrecord_jo_lastname':'last_name',
			'custrecord_jo_email':'email',
			'custrecord_jo_title':'job_title',
			'custrecord_jo_team':'division',
			'custrecord_jo_team':'department',
			'custrecord_jo_team':'cost_center',
			'custrecord_jo_location':'office',
			'custrecord_jo_expected_startdate':'custrecord_jo_expected_startdate',

		}
    function afterSubmit(scriptContext) {
			var objNewrecord = scriptContext.newRecord;
    }

    return {
        beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    };
    
});
