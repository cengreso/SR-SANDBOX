/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define([],

function() {
   
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
    	log.audit({ title: 'onRequest', details: 'param: ' + JSON.stringify(paramReq)});
    	
    }

    return {
        onRequest: onRequest
    };
    
});
