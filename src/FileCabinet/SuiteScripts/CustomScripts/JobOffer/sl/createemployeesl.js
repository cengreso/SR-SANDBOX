/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/redirect', 'N/record'],

function(redirect) {
   
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
        var idJoboffer = paramReq.joboffer;
    	
    	redirect.toRecord({
            type: 'customrecord_joboffer',
            id: idJoboffer
        });
    }

    return {
        onRequest: onRequest
    };
    
});
