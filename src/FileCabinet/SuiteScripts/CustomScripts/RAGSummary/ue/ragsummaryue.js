/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */

define(['N/record', '../../Project-Eve/Eve.js'],
	/**
	 * @param {record} record
	 */
	function (record, Eve) {

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
			var projectId = scriptContext.newRecord.getValue('custrecord_rgs_project')
			// Eve.remind({
			// 	"event":"rag",
			// 	"recipient":["100086059662703"],
			// 	"message-type":"reminder",
			// 	"project":{
			// 		"name":"EVENT-23",
			// 		"project-manager":"Cornello Engreso",
			// 		"url":"google.com"
			// 	},
			// 	"projectid":projectId
			// })
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
			afterSubmit: afterSubmit
		};

	});
