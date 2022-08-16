/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/ui/serverWidget', '../../Estimate/api/estimate'],
    /**
     * @param {record} record
     * @param {serverWidget} serverWidget
     */
    function (record, serverWidget, estimate) {

    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {

        var objForm;
        var paramReq = context.request.parameters;
        var idOpportunity = paramReq.custpage_opportunity;
        var idEstimate = paramReq.custpage_estimate;

        objForm = serverWidget.createForm({
            title: 'Margin'
        });
        
        
        if (context.request.method === 'POST') {

            var recEstimate = record.load({
                type: record.Type.ESTIMATE,
                id: idEstimate,
                isDynamic: true
            });
            
            recEstimate = estimate.computeMargin(recEstimate);

            var fldMessage = objForm.addField({
                id: 'custpage_message',
                type: serverWidget.FieldType.INLINEHTML,
                label: 'Message'
            });
            
            fldMessage.defaultValue = '<b>Opportunity has been updated.</b>';
    		
        }
        
            var fldOpportunity = objForm.addField({
                id: 'custpage_opportunity',
                type: serverWidget.FieldType.TEXT,
                label: 'Opportunity ID'
            });
            
            fldOpportunity.updateDisplayType({
                displayType: 'HIDDEN'
            });
            fldOpportunity.defaultValue = idOpportunity;
            var fldEstimate = objForm.addField({
                id: 'custpage_estimate',
                type: serverWidget.FieldType.SELECT,
                label: 'Estimate'
            });

            var recOpp = record.load({
                type: record.Type.OPPORTUNITY,
                id: idOpportunity
            });

            if (recOpp.getLineCount({
                    sublistId: 'estimates'
                }) > 0) {

                for (var nLine = 0; nLine < recOpp.getLineCount({
                        sublistId: 'estimates'
                    }); nLine++) {

                    fldEstimate.addSelectOption({
                        value: recOpp.getSublistValue({
                            sublistId: 'estimates',
                            fieldId: 'id',
                            line: nLine
                        }),
                        text: recOpp.getSublistValue({
                            sublistId: 'estimates',
                            fieldId: 'tranid',
                            line: nLine
                        })
                    });

                }

                fldEstimate.isMandatory = true;
            } else {
                fldEstimate.updateDisplayType({
                    displayType: 'HIDDEN'
                });
            }

            objForm.addSubmitButton({
                label: 'Select'
            });
            context.response.writePage(objForm);
    }

    return {
        onRequest: onRequest
    };

});
