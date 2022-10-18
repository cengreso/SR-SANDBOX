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

			} catch (e) {
				log.debug('e UE', e)
			}
		}
		function beforeSubmit(scriptContext) {
		}
		function afterSubmit(scriptContext) {
		}

		return {
			beforeLoad: beforeLoad,
			beforeSubmit: beforeSubmit,
			afterSubmit: afterSubmit
		};

	});
