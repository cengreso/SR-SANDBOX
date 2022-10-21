/**
 * @NApiVersion 2.1
 */
define(['N/record'], function(record) {
    /**
     *
     * @param {Object} option
     * @param {string} option.lineofbusiness - line of business field text value
     * @param {Array} option.projecttype -
     *
     * @returns {string}   Return the template from the arrProject based on the filter
     */
    filter = function(option) {
        const objModuleLog = {
            module: 'projecttemplate.js',
            template: null
        }
       /* console.log(option)*/

        try{

            if(!option.hasOwnProperty('lineofbusiness') && !option.hasOwnProperty('projecttype')) {
                objModuleLog.params = option
                objModuleLog.message = 'Missing value in the parameter'
                return
            }

            const arrProjectCriteria = [
                {
                    template: 'PSTEMPLATE01-General Subproject', //assuming this is the template for professional services
                    filters: [
                        {
                            custentity4: "Professional Services",
                            jobtype: ["Customer Projects : Consulting", "Customer Projects : Training"
                            ]
                        }
                    ]
                }
            ]

            const findTemplate = function(arrProjectCriteria) {
                const objTemplate = arrProjectCriteria.find(function(objProject) {
                    const stLob = objProject.filters.find(function(filter) {
                        return filter.custentity4 == option.lineofbusiness
                    })
                    return stLob !== undefined && stLob.jobtype.includes(option.projecttype)? true: false
                })
                return objTemplate
            }
            const objTemplateFound = findTemplate(arrProjectCriteria)
            objModuleLog.template = objTemplateFound !== undefined? objTemplateFound.template: null
            objModuleLog.status = "Success"
            objModuleLog.message = objModuleLog.template != null? "Template found": "Template not found"
            log.audit('objModuleLog', objModuleLog)

        }catch(objError) {
            objModuleLog.message = objError
            objModuleLog.status = "Failed"
            log.error('objModuleLog', objModuleLog)
        }

        return objModuleLog
    }

    set = function(option) {
        const scriptContext = option.scriptContext
        if(scriptContext.fieldId == 'custentity4' || scriptContext.fieldId == 'jobtype') {
            const objTemplate = filter({
                lineofbusiness: scriptContext.currentRecord.getText({fieldId: 'custentity4'}),
                projecttype: scriptContext.currentRecord.getText({fieldId: 'jobtype'}),
            })
            if(objTemplate.template != null) {
                scriptContext.currentRecord.setText({fieldId: 'projecttemplate', value: objTemplate.template})
            }
        }
    }
    return { set:set  }
   /* const result = filter({
        lineofbusiness: "Professional Services",
        projecttype: "Customer Projects : Training",
    })

    log.debug('result', result)*/
    /*console.log(result)*/
})