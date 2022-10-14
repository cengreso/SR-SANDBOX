/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', '../api/suitebox', 'N/https','N/runtime'],

	function (record, suitebox, https, runtime) {
		function beforeLoad(scriptContext) {
			var newRec = scriptContext.newRecord;
			try {
				if (newRec.id == 1060646) {
					var foldercreation = suitebox.createFolder2({id: newRec.id, type: newRec.type, suiteboxtype: 'onboarding'});
					log.debug('createFolder', foldercreation);

					var objCollab = suitebox.addCollab2({
						subsidiary: newRec.getValue('subsidiary'),
						recType: 'employee',
						collabs: true,
						type: 'folder',
						folderId: foldercreation.rootFolder,
					});
				}
			} catch (e) {
				log.debug('e UE', e)
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

			var testOBJ = {
				'parent_20381298784':{
					'subFolder':{

					}
				}
			}
		}

		return {
			beforeLoad: beforeLoad,
			beforeSubmit: beforeSubmit,
			afterSubmit: afterSubmit
		};

	});
