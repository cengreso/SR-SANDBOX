/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */

define(['N/record', 'N/ui/serverWidget','../../Project-Eve/Eve.js'],
	/**
	 * @param {record} record
	 */
	function (record, serverWidget, eve) {

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
				var form = scriptContext.form;
				var workpalceidholder = form.addField({id:'custpage_workplaceid', label:'workplaceid', type:serverWidget.FieldType.TEXT});
				// workpalceidholder.updateDisplayType({displayType:'hidden'});
			}catch(e){
				log.debug('e',e)
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
			try{
				if(scriptContext.newRecord.getValue('custpage_workplaceid')){
					var workplaceid = scriptContext.newRecord.getValue('custpage_workplaceid');
					var employeeid = eve.getempbywpid(workplaceid).id;
					scriptContext.newRecord.setValue('custrecord_rgs_author', employeeid);
				}
			}catch(e){
				log.debug('e',e)
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
		function afterSubmit(scriptContext) {

			if (scriptContext.type == 'create') {

				try {
					var newRec = scriptContext.newRecord;
					record.submitFields({
						type: record.Type.JOB,
						id: newRec.getValue({fieldId: 'custrecord_rgs_project'}),
						values: {
							custentity_rag_summary: newRec.id
						}
					});
				} catch (err) {
					log.audit({title: 'afterSubmit', details: 'afterSubmit: ' + err});
				}

			}
		}

		return {
			beforeLoad: beforeLoad,
			beforeSubmit:beforeSubmit,
			afterSubmit: afterSubmit
		};

	});
