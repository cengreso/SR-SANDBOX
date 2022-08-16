/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/ui/serverWidget'],
/**
 * @param {record} record
 * @param {serverWidget} serverWidget 
 */
function(record, serverWidget) {
   
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {
    	
    	try{
    		
    		if (context.request.method === 'GET') {
    			
            	var paramReq = context.request.parameters;
            	var idOpportunity = paramReq.opportunity;
        		var form = serverWidget.createForm({title: 'Closing Plan', hideNavBar: true});
        		
        		var fldOppId = form.addField({
                    id: 'custpage_fld_oppid',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Opp ID'
                });
        		
        		fldOppId.updateDisplayType({displayType: 'HIDDEN'});
        		fldOppId.defaultValue = idOpportunity;
        		
                form.addField({
                    id: 'custpage_fld_tasktemplate',
                    type: serverWidget.FieldType.SELECT,
                    source: 'customrecord_closing_plan_template',
                    label: 'Closing Plan Template'
                }).isMandatory = true; 
                
                form.addSubmitButton({label: 'Create Closing Plan'});
                context.response.writePage(form);
    		}
    	}
    	catch(err){
			context.response.write('Unable to render Closing Plan Form. ' + err);
		}
    	
    	try{
    		
			if (context.request.method === 'POST') {
				
				var paramReq = context.request.parameters;
            	var idOpportunity = paramReq.custpage_fld_oppid;
            	var idTemplate = paramReq.custpage_fld_tasktemplate;
	            
            	var recPlanTemplate = record.load({type: 'customrecord_closing_plan_template', id: idTemplate});
            	
            	for (var nLine0 = 0; nLine0 < recPlanTemplate.getLineCount({sublistId: 'recmachcustrecord_closing_plan_template'}); nLine0++) {
            		
            		var idTask = recPlanTemplate.getSublistValue({sublistId: 'recmachcustrecord_closing_plan_template', fieldId: 'custrecord_closing_plan_task', line : nLine0});
            		
                	var recTemplate = record.load({type: 'customrecord_task_template', id: idTask});
                	var recOpp = record.load({type: 'opportunity', id: idOpportunity});
    	        	var recTask = record.create({type: 'task', isDynamic: true});
    	        		recTask.setValue({fieldId: 'company', value: recOpp.getValue({fieldId: 'entity'})});
                    	recTask.setValue({fieldId: 'transaction', value: idOpportunity});
                  		recTask.setValue({fieldId: 'custevent_sr_closing_plan_task', value: true});
                  
            		for (var nLine = 0; nLine < recTemplate.getLineCount({sublistId: 'recmachcustrecord_task_template'}); nLine++) {
    					
            			var sField = recTemplate.getSublistValue({sublistId: 'recmachcustrecord_task_template', fieldId: 'custrecord_task_fieldid', line : nLine});
            			var sValue = recTemplate.getSublistValue({sublistId: 'recmachcustrecord_task_template', fieldId: 'custrecord_task_value', line : nLine});
            			
            			
            			if(sValue.substring(0, 7) == 'DATEADD'){
            				
            				sValue = sValue.replace(/\(|\)|DATEADD/g,'');
            				var aValues = sValue.split(',');
            				var sValue0 = aValues[0].replace(/{|}/g,'');
            				var dDate = recOpp.getValue({fieldId: sValue0});
            				dDate = dDate.setDate(dDate.getDate() + parseInt(aValues[1]));
                			var dValue= new Date(dDate);
                			recTask.setValue({fieldId: sField, value: new Date(dDate)});
            			}
            			else if(sValue.charAt(0) == '{' && sValue.charAt(sValue.length -1) == '}'){
            				sValue = sValue.replace(/{|}/g,'');
            				recTask.setValue({fieldId: sField, value: recOpp.getValue({fieldId: sValue})});	
            			}
            			else{
            				recTask.setValue({fieldId: sField, value: sValue});	
            			}
    				}
    	        		
    	        	var id = recTask.save();
            		
            		
            	}
	        	
	        	context.response.write('Closing Plan for ' + recOpp.getValue({fieldId: 'tranid'}) + ' has been created.');
	        }
    	}
    	catch(err){
			context.response.write('Unable to create Closing Plan. ' + err);
		}
    }

    return {
        onRequest: onRequest
    };
    
});
