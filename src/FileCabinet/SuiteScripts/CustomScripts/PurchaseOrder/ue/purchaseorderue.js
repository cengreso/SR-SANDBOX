/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */

/*
Purpose             : Render a Custom Button for Printing Transaction
Created On          : February 14, 2022
Author              : Ceana Technology
Saved Searches      : N/A
*/

define(['N/record', 'N/search', 'N/url', '../api/purchaseorder'], (record, search, url, purchaseorder) => {

    const beforeLoad = (scriptContext) => {
        var newRecord = scriptContext.newRecord;
        //purchaseorder.updatePOExpiryDate(newRecord);
        /*var form = scriptContext.form;
        var urlLink = getURL('customscript_sr_sl_print_purchaseorder', 'customdeploy_sr_sl_print_purchaseorder');
        urlLink += '&custscript_param_transaction_id=' + newRecord.id;
        var stOnCall = "window.open('" + urlLink + "')";
        form.addButton({
            id: 'custpage_print',
            label: "Print",
            functionName: stOnCall
        });*/

    }

    function getURL(stScript, stDeployment) {
        var urlLink = url.resolveScript({
            scriptId: stScript,
            deploymentId: stDeployment,
            returnExternalUrl: false
        });

        return urlLink;
    }

    const afterSubmit = (scriptContext) => {
        var newRecord = scriptContext.newRecord;
        log.debug('Start', 'newRecord.type: ' + newRecord.type + ' & newRecord.id: ' + newRecord.id)
        purchaseorder.createPOfromPR(newRecord);
    }

    return {afterSubmit}

});