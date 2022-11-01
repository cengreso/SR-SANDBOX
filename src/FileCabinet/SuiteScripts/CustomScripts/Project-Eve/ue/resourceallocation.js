/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record'],
    /**
 * @param{record} record
 */
    (record) => {
			var origproj;
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {
					try {
						log.debug('type', scriptContext.type)
					}catch (e){
						log.debug('e',e)
					}
        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {

					var curNewRec = scriptContext.newRecord,
						curOldRec = scriptContext.oldRecord;
					log.debug('type before submit',scriptContext.type)
					if(scriptContext.type != scriptContext.UserEventType.EDIT)
						return;
					log.debug('curNewRec.id',curNewRec.getValue('project'))
					log.debug('curOldRec.id',curOldRec.getValue('project'))
					try{
						if (curNewRec.getValue('project'))
							var newid = record.copy({
								type: record.Type.RESOURCE_ALLOCATION,
								id: curNewRec.id,
								defaultValues: {
									project: curNewRec.getValue('project')
								}
							}).save()
						log.debug('newallocation', newid)
					}catch(e){
						log.debug('e',e)
					}
					if(curOldRec.getValue('project') && (curOldRec.getValue('project') != curNewRec.getValue('project')))
						record.delete({type:record.Type.RESOURCE_ALLOCATION, id:curOldRec.id})
					log.debug('end of beforesubmit')
        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {
					log.debug('afterSubmit')
        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });
