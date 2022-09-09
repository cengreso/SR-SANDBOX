/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/ui/serverWidget', 'N/file', 'N/query'],

function(record, serverWidget, file, query) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
	onRequest = function (context) {

		var paramReq = context.request.parameters;
		var sFrame = paramReq.frame;
		var idJob = paramReq.custpage_fld_job;
        var nTcc = paramReq.custpage_fld_tcc;
        var objForm;
        
        if(sFrame == 'T'){
        	objForm = serverWidget.createForm({
                title: 'Job Offer Calculator',
                hideNavBar: true
            });	
        }
        else{
        	objForm = serverWidget.createForm({
                title: 'Job Offer Calculator',
            });
        }
		
		var fldJob = objForm.addField({
            id: 'custpage_fld_job',
            label: 'Job',
            type: serverWidget.FieldType.SELECT,
            source: 'hcmjob'
        });
		
		var fldTcc = objForm.addField({
            id: 'custpage_fld_tcc',
            label: 'Total Cash Compensation',
            type: serverWidget.FieldType.CURRENCY,
        });
		
		var fldFrame = objForm.addField({
            id: 'frame',
            label: 'Frame',
            type: serverWidget.FieldType.TEXT,
        });
		
		fldFrame.updateDisplayType({
            displayType: 'HIDDEN'
        });
		
		fldFrame.defaultValue = sFrame;
		
		if(context.request.method === 'POST'){

            fldJob.defaultValue = idJob;
            fldTcc.defaultValue = nTcc;

            var fldBaseWage = objForm.addField({
                id: 'custpage_fld_bases',
                label: 'Base Wage',
                type: serverWidget.FieldType.CURRENCY
            });

            fldBaseWage.updateDisplayType({
                displayType: 'INLINE'
            });
            
            var fldStf = objForm.addField({
                id: 'custpage_fld_stf',
                label: 'Variable (STF)',
                type: serverWidget.FieldType.CURRENCY
            });
            
            fldStf.updateDisplayType({
                displayType: 'INLINE'
            });
            
            var arrSql = file.load(212466).getContents().split('{{}}');
            var objJSON = query.runSuiteQL(arrSql[0].replace('{{id}}', idJob)).asMappedResults()[0];
            
            var nStf = nTcc * objJSON.stf;
            
            fldBaseWage.defaultValue = nTcc-nStf;
            fldStf.defaultValue = nStf;
            
		}
		
		objForm.addSubmitButton({
            label: 'Compute'
        });
		
		
		context.response.writePage(objForm);
		
    };

    return {
        onRequest: onRequest
    };
    
});
