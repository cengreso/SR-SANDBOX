/**
 * @NApiVersion 2.1
 */
define(['N/url', 'N/search'], function(url, search) {
    /**
     *
     * @param {Object} option
     * @param {string} option.lineofbusiness - line of business field text value
     * @param {Array} option.projecttype -
     *
     * @returns {Object}  Return the template from the arrProject based on the filter including other properties for logger
     */
    filter = function(option) {
        const objModuleLog = {
            module: 'template.js',
            function: 'filter',
            template: null
        }

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
            log.audit('filter', objModuleLog)

        }catch(objError) {
            objModuleLog.message = objError
            objModuleLog.status = "Failed"
            log.error('filter', objModuleLog)
        }

        return objModuleLog
    }

    set = function(option) {
        const objModuleLog = {
            module: 'template.js',
            function: 'set',
        }
        try{
            const scriptContext = option.scriptContext

            if(scriptContext.fieldId == 'custpage_hiddenprojecttemplate') {
                const stHiddenProjFieldId = scriptContext.currentRecord.getValue({fieldId: 'custpage_hiddenprojecttemplate'})
                if(stHiddenProjFieldId) {
                    scriptContext.currentRecord.setValue({fieldId: 'projecttemplate', value: stHiddenProjFieldId})
                    scriptContext.currentRecord.setValue({fieldId: 'custpage_hiddenprojecttemplate', value: ""})
                }
            }
            
            if(scriptContext.fieldId != 'custentity4' && scriptContext.fieldId != 'jobtype') return

            const objTemplate = filter({
                lineofbusiness: scriptContext.currentRecord.getText({fieldId: 'custentity4'}),
                projecttype: scriptContext.currentRecord.getText({fieldId: 'jobtype'}),
            })
            if(objTemplate.template == null) {
                scriptContext.currentRecord.setValue({fieldId: 'projecttemplate', value: ""})
                objModuleLog.message = 'Template unset'
            }else {
                scriptContext.currentRecord.setText({fieldId: 'projecttemplate', text: objTemplate.template})
                objModuleLog.message = 'Template set'
            }
            objModuleLog.status = 'Success'
            log.audit('set', objModuleLog)

        }catch(objError) {
            objModuleLog.message = objError
            objModuleLog.status = 'Failed'
            log.error('set', objModuleLog)
        }
    }

    getList = function(option) {
        try
        {
            const stProjectTypeId = option.projecttype
            const stLineOfBusinessId = option.lineofbusiness
            const arrResult = [];
            const srProjectTemplateMapping = search.create({
                type: 'customrecord_sr_projecttemplatemapping',
                columns: [
                    search.createColumn({name: 'custrecord_ptm_lineofbusiness'}),
                    search.createColumn({name: 'custrecord_ptm_projectype'}),
                    search.createColumn({name: 'custrecord_ptm_projecttemplate'})
                ]
            }).run().getRange({start: 0, end: 999})
        
            for(var idx = 0; idx <srProjectTemplateMapping.length; idx++) {
                arrResult.push({
                    lineofbusiness: srProjectTemplateMapping[idx].getValue({name: 'custrecord_ptm_lineofbusiness'}),
                    projectype: srProjectTemplateMapping[idx].getValue({name: 'custrecord_ptm_projectype'}),
                    templatesids: srProjectTemplateMapping[idx].getValue({name: 'custrecord_ptm_projecttemplate'}),
                    templatestexts: srProjectTemplateMapping[idx].getText({name: 'custrecord_ptm_projecttemplate'})
                })
            }
            log.audit('srProjectTemplateMapping', srProjectTemplateMapping)
            log.audit('arrResult', arrResult)
            log.audit('option', {
                stProjectTypeId: stProjectTypeId,
                stLineOfBusinessId: stLineOfBusinessId
            })

            var objTemplate = arrResult.filter(function(result) {
                if(result.lineofbusiness == stLineOfBusinessId) {
                    if(result.projectype == "" && result.projectype == stProjectTypeId) {
                        return true
                    }else if(result.projectype != ""){
                        if(result.projectype.split(',').indexOf(stProjectTypeId) != -1) {
                            return true
                        }else {
                            return false
                        }
                    }
                }
            })
            log.audit('objTemplate', objTemplate)

            const arrProjectTemplates = []
            if(objTemplate.length > 0) {
                const srProjectTemplate = search.create({
                    type: 'projecttemplate',
                    filters: [
                        ['isinactive', 'is', 'F'], 'AND',
                        ['internalid', 'anyof', objTemplate[0].templatesids.split(',')]
                    ],
                    columns: [
                        search.createColumn({name: 'entityid'})
                    ]
                }).run().getRange({start: 0, end: 999})

                
                for(var idxPt=0; idxPt<srProjectTemplate.length; idxPt++) {
                    arrProjectTemplates.push({
                        value: srProjectTemplate[idxPt].id,
                        text: srProjectTemplate[idxPt].getValue({name: 'entityid'})
                    })
                }  

            }
          
            return arrProjectTemplates
        }catch(objError) {
            log.error('getList', objError)
            return []
        }
        
    }

    setListBeforeLoad = function(option) {

        const objModuleLog = {
            module: 'template.js',
            function: 'setList',
        }

        try {
            if(option.scriptContext.type == 'edit' || option.scriptContext.type == 'create') {
                const objForm = option.scriptContext.form

                //disable project standard project template field
                // const fldStandardProjTemplate = objForm.getField({id: 'projecttemplate'})
                // fldStandardProjTemplate.updateDisplayType({
                //     displayType : 'disabled'
                // });
                
                //get data
                const arrProjectTemplates = getList({
                    lineofbusiness: option.scriptContext.newRecord.getValue({fieldId: 'custentity4'}),
                    projecttype: option.scriptContext.newRecord.getValue({fieldId: 'jobtype'})
                })

                //Set list of custom project template field
                const fldHiddenTemplate = objForm.addField({
                    id: 'custpage_hiddenprojecttemplate',
                    label: 'Project Template Selector',
                    type: 'select'
                })
                fldHiddenTemplate.setHelpText({
                    help : "This field is used to select a project template. The list is based on the line of business and project type. You can refer to this mapping custom record: "+"<a href=/app/common/custom/custrecordentrylist.nl?rectype=1491>Project Template Mapping</a>"
                });
                objForm.insertField({
                    field: fldHiddenTemplate,
                    nextfield: 'projecttemplate'
                })

                fldHiddenTemplate.addSelectOption({
                    value : '',
                    text : ''
                });
                arrProjectTemplates.forEach(function(result) {
                    fldHiddenTemplate.addSelectOption({
                        value : result.value,
                        text : result.text
                    });
                })
            }

        }catch(objError) {
            objModuleLog.status = 'Failed'
            objModuleLog.message = objError
            log.error('setList', objModuleLog)
        }
    }

    setListOnFieldChange = function (option) {
        
        if(option.scriptContext.fieldId != 'custentity4' && option.scriptContext.fieldId != 'jobtype') return
        const fldHiddenProjTemplate = option.scriptContext.currentRecord.getField({fieldId: 'custpage_hiddenprojecttemplate'})
        log.audit('fldHiddenProjTemplate', fldHiddenProjTemplate)
        fldHiddenProjTemplate.removeSelectOption({
            value: null,
        });

        const arrProjectTemplates = getList({
            lineofbusiness: option.scriptContext.currentRecord.getValue({fieldId: 'custentity4'}),
            projecttype: option.scriptContext.currentRecord.getValue({fieldId: 'jobtype'})
        })

        log.audit('arrProjectTemplates', arrProjectTemplates)
        fldHiddenProjTemplate.insertSelectOption({
            value : '',
            text : ''
        });
        arrProjectTemplates.forEach(function(result) {
            fldHiddenProjTemplate.insertSelectOption({
                value : result.value,
                text : result.text
            });
        })
    }

    return { 
        set: set, 
        setListBeforeLoad: setListBeforeLoad,
        setListOnFieldChange: setListOnFieldChange
    }
})