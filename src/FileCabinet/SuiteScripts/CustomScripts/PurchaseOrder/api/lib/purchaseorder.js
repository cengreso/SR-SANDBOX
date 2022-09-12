/**
 * @NApiVersion 2.1
 */
define(['N/record', 'N/search'],
    /**
     * @param{record} record
     * @param{search} search
     */
    (record, search) => {
        const setExpiryDate = (newRecord) => {
            try {

                var inPrId = newRecord.getValue({
                    fieldId: 'createdfrom'
                })

                log.error('inPrId', inPrId);
                if (inPrId) {
                    var objPrExpiry = search.lookupFields({
                        type: search.Type.PURCHASE_REQUISITION,
                        id: inPrId,
                        columns: ['custbody_sr_expiry_date']
                    });
                    log.error('setExpiryDate', objPrExpiry);
                }
            } catch (e) {
                log.error('setExpiryDate', e)
            }

        }
        const setLineTaxCodes = (newRecord) => {
            var isTransform = newRecord.getValue({
                fieldId: 'transform'
            });
            log.debug('isTransform', isTransform);
            if (isTransform) {
                var recPurchaseOrder = record.load({
                    type: newRecord.type,
                    id: newRecord.id,
                    isDynamic: true
                });

                var inLine = recPurchaseOrder.getLineCount({
                    sublistId: 'item'
                });
                for (var indx = 0; indx < inLine; indx++) {
                    var inGSTCode = recPurchaseOrder.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'custcol_gst_taxcode',
                        line: indx
                    });
                    log.debug('inGSTCode', inGSTCode);

                    if (inGSTCode) {
                        recPurchaseOrder.selectLine({
                            sublistId: 'item',
                            line: indx
                        });
                        recPurchaseOrder.setCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'taxcode',
                            value: inGSTCode
                        });
                        recPurchaseOrder.commitLine({
                            sublistId: 'item'
                        });
                    }
                }

                var id = recPurchaseOrder.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: true
                });
                log.debug('End', id);
            }
        }


        return {setLineTaxCodes, setExpiryDate}

    });
