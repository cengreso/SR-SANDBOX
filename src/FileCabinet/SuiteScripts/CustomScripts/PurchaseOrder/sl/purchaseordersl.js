/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

/*
Purpose             : Build PDF File with custom filename
Created On          : February 14, 2022
Author              : Ceana Technology
Saved Searches      : N/A
*/

define(['N/record','N/search','N/render','N/file'],
    (record, search, render, file) => {

    const onRequest = (scriptContext) => {
        var tranid = scriptContext.request.parameters.custscript_param_transaction_id;
        var recPurchaseOrder = record.load({type: record.Type.PURCHASE_ORDER, id: tranid, isDynamic: true});
        var transactionFile = render.transaction({
            entityId: parseInt(tranid),
            printMode: render.PrintMode.PDF,
            inCustLocale: true
        });
        transactionFile.name = recPurchaseOrder.getValue("tranid")+".pdf";

        log.debug("transactionFile Content", transactionFile.getContents());
        //scriptContext.response.writeFile({ file: transactionFile, isInline: false });
         scriptContext.response.writeFile({ file: transactionFile, isInline: true });
    }


    return { onRequest }

});