/**
 * @NApiVersion 2.1
 */
define(['./lib/purchaseorder'],

    (purchaseorder) => {

        const createPOfromPR = (newRecord) => {
            return purchaseorder.setLineTaxCodes(newRecord);
        }

        const updatePOExpiryDate=(newRecord)=>{
            return purchaseorder.setExpiryDate(newRecord);
        }

        return {createPOfromPR,updatePOExpiryDate}

    });
