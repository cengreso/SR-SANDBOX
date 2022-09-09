/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/record', '../api/suitebox', 'N/https'],

	function (record, suitebox, https) {

		/**
		 * Function definition to be triggered before record is loaded.
		 *
		 * @param {Object} scriptContext
		 * @param {Record} scriptContext.newRecord - New record
		 * @param {string} scriptContext.type - Trigger type
		 * @param {Form} scriptContext.form - Current form
		 * @Since 2015.2
		 */
		function beforeLoad(scriptContext) { // will be move to aftersubmit
			var newRec = scriptContext.newRecord;
			try {
				// if (newRec.type == "employee")
					suitebox.createFolder2({id: newRec.id, type: newRec.type, suiteboxtype:'onboarding'});

				var folderId = 169776175563
				// var objCollab = suitebox.addCollab2({
				// 		type: 'folder', // folder
				// 		id: folderId, // target folder id
				// 		userid: 19025149015, // OR userid: '53397',email: emailSalesRep,
				// 		role: 'co-owner',
				// 		usertype: 'group',
				// 		recType:'employee'
				// 	})
				var objCollab = suitebox.addCollab2({ // collab by subsidiary
					subsidiary: newRec.getValue('subsidiary'),
					recType:'employee',
					collabs:true,
					type:'folder',
					folderId:folderId
				});
				log.debug('objCollab',objCollab)

				// { single collab
				// 	type: 'folder', // folder
				// 		id: folderId, // target folder id
				// 	userid: 30912392949, // OR userid: '53397',email: emailSalesRep,
				// 	role: 'co-owner',
				// 	usertype: 'group',
				// 	recType:'employee'
				// }

				//{ // collab by subsidiary
				//	subsidiary: newRec.getValue('subsidiary'),
				//	recType:'employee',
				//	collabs:true,
				//	folderId:folderId
				//}

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
				'parent_20381298784':{ // will be split and get the id
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


