define(['N/record', 'N/search'], function (record, search) {
    const MODULE = 'bankinformation.js'
    const BANK_FORM_SUBSIDIARY_MAPPING = [
        {
            subsidiary: [14], //[Canada]
            bankForm: 'Canada Bank Information Form',
            bankFormId: 143
        },
       {
            subsidiary: [6], //[Australia]
            bankForm: 'Australia Bank Information Form',
            bankFormId: 144
       },
       {
            subsidiary: [2], //[United Kingdom]
            bankForm: 'UK Bank Information Form',
            bankFormId: 145
       },
       {
            subsidiary: [12], //[Singapore]
            bankForm: 'SG Bank Information Form',
            bankFormId: 146
       },
       {
            subsidiary: [10], //[malaysia]
            bankForm: 'Malaysia Bank Information Form',
            bankFormId: 147
       },
       {
            subsidiary: [15], //[India]
            bankForm: 'India Bank Information Form',
            bankFormId: 148
       },
       {
            subsidiary: [5], //[Chile]
            bankForm: 'Chile Bank Information Form',
            bankFormId: 149
       }
    ]

    createBankForm = function(option) {
        const title = 'createBankInformation log'
        const stEmployeeId = option.employeeId
        const objBankForm = {
            module: MODULE,
            employeeId: stEmployeeId
        }
        
        try{
            if(!stEmployeeId) {
                objBankForm['message'] = 'Invalid employee'
                log.error(title, objBankForm)
                return
            }
    
            const objEmployeeLookUp = search.lookupFields({
                type: 'employee',
                id: stEmployeeId,
                columns: ['subsidiary']
            })
            
            //to be changed
            if(objEmployeeLookUp.subsidiary.length == 0) {
                objBankForm['message'] = 'Invalid employee subsidiary'
                log.error(title, objBankForm)
                return
            }
            const stLocationId = objEmployeeLookUp.subsidiary[0].value
            
            for(var idxBf=0; idxBf<BANK_FORM_SUBSIDIARY_MAPPING.length; idxBf++) {
                if(BANK_FORM_SUBSIDIARY_MAPPING[idxBf].subsidiary.indexOf(Number(stLocationId)) != -1) {
                    objBankForm['bankFormId'] = BANK_FORM_SUBSIDIARY_MAPPING[idxBf].bankFormId
                    break;
                }
            }
            
            if(!objBankForm.hasOwnProperty('bankFormId')) {
                objBankForm['message'] = 'bankFormId not found'
                log.error(title, objBankForm)
                return
            }
            const existingBankForm = checkExistingBankForm({employeeId: stEmployeeId})
            if(existingBankForm.length > 0) {
                objBankForm['message'] = 'Bank Form already exist with an internalid '+existingBankForm[0].id
                log.error(title, objBankForm)
                return
            }
            

            const stBankInfoId = record.create({type: 'customrecord_bankinformation'})
            stBankInfoId.setValue({fieldId: 'customform', value: objBankForm.bankFormId})
            stBankInfoId.setValue({fieldId: 'custrecord_bi_employee', value: objBankForm.employeeId})
            objBankForm['createdBankInformation'] = stBankInfoId.save()

            log.audit(title, objBankForm)

        }catch(objError) {
            log.error(title, {
                module: MODULE,
                employeeId:stEmployeeId,
                message: objError.message
            })
        }
    }

    function checkExistingBankForm(option) {
        const stEmployeeId = option.employeeId
        
        const srBankForm = search.create({
            type: 'customrecord_bankinformation',
            filters: [
                ['isinactive', 'is', 'F'], 'AND',
                ['custrecord_bi_employee', 'is', stEmployeeId]
            ]
        }).run().getRange({start: 0, end: 1})
        return srBankForm
    }

    //createBankForm({employeeId: 7130})
    return { createBankForm: createBankForm }
})