/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/https', 'N/record', 'N/file', 'N/redirect', 'N/task', 'N/render', '../api/estimate', '../api/estimatetest', '../api/invoice', '../api/letter', '../api/lib/promotionletter','../api/jobdescription'],

function(https, record, file, redirect, task, render, estimate, estimatetest, invoice, letter, promotionletter,jobDesc) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
	
	
    function onRequest(context) {
    	
     	var paramReq = context.request.parameters;
    	var idRec = paramReq.id;
    	var sType = paramReq.type;
    	var sPdfTemplate = '';
    	
    	if(sType == 'estimate'){
    		
    		recPrint = record.load({	type: sType, 
										id: idRec, 
										isDynamic: true});
    		sPdfTemplate = estimate.generate(recPrint);
    		
    		context.response.setHeader({
          		name: 'Content-disposition',
          		value: 'filename="' + recPrint.getValue({fieldId: 'tranid'}) + '_'+  recPrint.getValue({fieldId: 'custbody_atl_quote_number'}) + '.pdf"',
        	});
    		context.response.renderPdf(sPdfTemplate);
    	}
    	else if(sType == 'estimatetest'){
    		
    		recPrint = record.load({	type: 'estimate', 
										id: idRec, 
										isDynamic: true});
    		sPdfTemplate = estimatetest.generate(recPrint);
    		
    		context.response.setHeader({
          		name: 'Content-disposition',
          		value: 'filename="' + recPrint.getValue({fieldId: 'tranid'}) + '_'+  recPrint.getValue({fieldId: 'custbody_atl_quote_number'}) + '.pdf"',
        	});
    		context.response.renderPdf(sPdfTemplate);
    	}
    	else if(sType == 'invoice'){
    		
    		recPrint = record.load({	type: sType, 
							id: idRec, 
							isDynamic: true});
			sPdfTemplate = invoice.generate(recPrint);
			
			context.response.setHeader({
			name: 'Content-disposition',
			value: 'filename="' + recPrint.getValue({fieldId: 'tranid'}) + '_'+  recPrint.getText({fieldId: 'entity'}) + '.pdf"',
			});
			context.response.renderPdf(sPdfTemplate);
    	}
    	else if(sType == 'promotionletter'){
    		
			var objFile = promotionletter.generate({id: idRec});
			
			context.response.setHeader({
			name: 'Content-disposition',
			value: 'filename='+objFile.name+'.pdf',
			});
			
			sPdfTemplate = objFile.file;
			context.response.renderPdf(sPdfTemplate);
    	}
    	else if(sType == 'promotioncycle'){
    		
    		var tskPromoCycle = task.create({
    	        taskType: task.TaskType.MAP_REDUCE,
    	        scriptId: 'customscript_cust_promocycleupload_mr',
    	        deploymentId: 'customdeploy_cust_promocycleupload_mr',
    	        params : {
    	                'custscript_promocycleid' : idRec
    	            }
    	    });
    		
    		var tskIdPromoCycle = tskPromoCycle.submit();
    		 
    		redirect.toRecord({
                type: 'customrecord_sr_promocycle',
                id: idRec
            });
    	}
    	else if(sType == 'salaryadjustmentletter'){
    		
			var objFile = letter.generateSalaryAdjustment({id: idRec});
			
			context.response.setHeader({
			name: 'Content-disposition',
			value: 'filename='+objFile.name+'.pdf',
			});
			
			sPdfTemplate = objFile.file;
			context.response.renderPdf(sPdfTemplate); 
    	}
    	else if(sType == 'adjustmentcycle'){
    		
    		var tskAdjustmentCycle = task.create({
    	        taskType: task.TaskType.MAP_REDUCE,
    	        scriptId: 'customscript_adjustmentcycleupload_mr',
    	        deploymentId: 'customdeploy_adjustmentcycleupload_mr',
    	        params : {
    	                'custscript_addjustmentcycleid' : idRec
    	            }
    	    });
    		
    		var tskIdAdjustmentCycle = tskAdjustmentCycle.submit();
    		 
    		redirect.toRecord({
                type: 'customrecord_sr_adjustmentcycle',
                id: idRec
            });
    	}
    	else if(sType == 'termsconditions'){
    		
			var objFile = letter.generateTermsCondition({id: idRec});
			
			context.response.setHeader({
			name: 'Content-disposition',
			value: 'filename='+objFile.name+'.pdf',
			});
			
			sPdfTemplate = objFile.file;
			context.response.renderPdf(sPdfTemplate); 
    	}
    	else if(sType == 'offerletter'){
    		
			var objFile = letter.generateOffer({id: idRec});
			
			context.response.setHeader({
			name: 'Content-disposition',
			value: 'filename='+objFile.name+'.pdf',
			});
			
			sPdfTemplate = objFile.file;
			context.response.renderPdf(sPdfTemplate); 
    	}
    	else if(sType == 'offerletter'){
    		
			var objFile = letter.generateOffer({id: idRec});
			
			context.response.setHeader({
			name: 'Content-disposition',
			value: 'filename='+objFile.name+'.pdf',
			});
			
			sPdfTemplate = objFile.file;
			context.response.renderPdf(sPdfTemplate); 
    	}
    	else if(sType == 'subsidiaryallowance'){
    		
			var objFile = letter.generateSubsidiaryAllowance({});
			
			context.response.setHeader({
			name: 'Content-disposition',
			value: 'filename='+objFile.name+'.pdf',
			});
			
			sPdfTemplate = objFile.file;
			context.response.renderPdf(sPdfTemplate); 
    	}
    	else if(sType == 'upload'){
    		
    		
    		//try{
        		recPrint = record.load({	type: 'estimate', 
    				id: idRec, 
    				isDynamic: true});
    			sPdfTemplate = estimate.generate(recPrint);
    			
    			var pdfFile = render.xmlToPdf({
    			    xmlString: sPdfTemplate
    			});
    			
    			var objPayload = {
        				'file': {
        					'name':  recPrint.getValue({fieldId: 'tranid'}) + '.pdf"',
        					'content': pdfFile.getContents(),
        					'folder' : recPrint.getValue({fieldId: 'custbody_rbx_folderid'})
        				}
        			}
    			
    			var resp = https.post({
    				url: 'https://us-central1-itsm-932-infraops.cloudfunctions.net/idea-4-hw-rocketbox-test-main-2', 
    				body: JSON.stringify(objPayload),
    				headers: {
    					'Content-Type': 'application/json' 
    				}
    			});
    			
        		redirect.toRecord({
                    type: recPrint.type,
                    id: recPrint.id
                });
    		//}
    		//catch(err){
        	//	redirect.toRecord({
             //       type: recPrint.type,
             //       id: recPrint.id
             //   });
    		//}
    	}
      else if(sType == 'jobdescription'){
        try{
          context.response.writeFile({
            file : jobDesc.generate({jobid:idRec}),
            isInline : true
          });
        }catch(e){
          log.debug('Error creating job description PDF', e)
        }
      }
		//}	
		
		//context.response.write(JSON.stringify(objRecSub));
    }

    return {
        onRequest: onRequest
    };
    

});
