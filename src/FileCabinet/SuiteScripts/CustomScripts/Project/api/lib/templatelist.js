/**
 * @NApiVersion 2.1
*/
define([], function() {


    const create = function(option) {
        const objModuleLog = {
            module: 'template.js',
            function: 'setList',
        }

        try {
            log.audit('option.scriptContext', option.scriptContext)
            const objForm = option.scriptContext.form
            objForm.addField({
                id: 'custpage_hiddenprojecttemplate',
                label: 'Project Template',
                type: 'select',
                source: 'projecttemplate'
            })
        }catch(objError) {
            objModuleLog.status = 'Failed'
            objModuleLog.message = objError
            log.error('setList', objModuleLog)
        }
    }

    const set = function(option) {
        log.debug('template list set', true)
    }

    return {
        create: create,
        set: set
    }
})