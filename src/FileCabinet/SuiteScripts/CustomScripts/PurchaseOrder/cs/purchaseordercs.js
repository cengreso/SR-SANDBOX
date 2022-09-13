/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define([],

function() {
    
    /**
     * Function to be executed after page is initialized.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
     *
     * @since 2015.2
     */
    function pageInit(scriptContext) {
			// saved only
			// require(["N/currency","N/search", "N/currentRecord","N/record","N/runtime"], (currency, search, currentRecord,record,runtime) => {
			// 	var currRec = currentRecord.get()
			// 	console.log('currency', currRec.getValue('id'))
			// 	var rec = record.load({type: 'purchaseorder',id: currRec.getValue('id')})
			//
			// 	console.log('sublists', rec.getSublist({sublistId:'links'}))
			//
			// 	var bills = []
			// 	var tranID = rec.getSublistValue({
			// 		sublistId: 'links',
			// 		fieldId: 'id',
			// 		line: 0
			// 	});
			// 	bills.push(tranID)
			//
			// 	var currencySearch = search.create({
			// 		type: 'currency',
			// 		filters:[],
			// 		columns: ['name','symbol']
			// 	});
			// 	currencycodes=[]
			// 	currencySearch.run().each((o,i)=>{
			// 		currencycodes.push({
			// 			name:o.getValue('name'),
			// 			symbol:o.getValue('symbol')})
			// 		return true;
			// 	})
			//
			// 	console.log('currencycodes', currencycodes)
			// 	console.log('currRec', tranID)
			// 	var vbsearch = search.create({
			// 		type: 'transaction',
			// 		filters:[
			// 			['createdFrom', 'anyof', tranID],
			// 			"AND",
			// 			["type","anyof","VendPymt"],
			// 		],
			// 		columns: ['createdFrom','trandate', 'internalid','type','currency','total','tranid']
			// 	});
			// 	var currencycode = 'USD';
			// 	var usdAmount = 0;
			// 	var foreignTotalPayment = 0;
			// 	vbsearch.run().each((obj,i) => {
			// 		console.log('tranid', obj.getValue('tranid'))
			// 		usdAmount += obj.getValue('total')
			// 		currencycode = obj.getText('currency')
			// 		for (var i = 0; i < currencycodes.length; i++) {
			// 			if(currencycodes[i].name == currencycode)
			// 				currencycode = currencycodes[i].symbol
			// 		}
			// 		var rate = currency.exchangeRate({
			// 			source: 'USD',
			// 			target: currencycode,
			// 			date: new Date(obj.getValue('trandate'))
			// 		});
			// 		foreignTotalPayment += obj.getValue('total')
			// 		usdAmount = obj.getValue('total') * rate;
			// 		return true;
			// 	})
			// 	console.log('USD rate', usdAmount);
			// 	console.log(currencycode+' rate', foreignTotalPayment);
			// 	console.log('total', rec.getValue('total') + usdAmount);
			// 	var scriptObj = runtime.getCurrentScript();
			// 	console.log({
			// 		title: "Remaining usage units: ",
			// 		details: scriptObj.getRemainingUsage()
			// 	});
			//
			// })
    }

    /**
     * Function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @since 2015.2
     */
    function fieldChanged(scriptContext) {

    }

    /**
     * Function to be executed when field is slaved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     *
     * @since 2015.2
     */
    function postSourcing(scriptContext) {

    }

    /**
     * Function to be executed after sublist is inserted, removed, or edited.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function sublistChanged(scriptContext) {

    }

    /**
     * Function to be executed after line is selected.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @since 2015.2
     */
    function lineInit(scriptContext) {

    }

    /**
     * Validation function to be executed when field is changed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     * @param {string} scriptContext.fieldId - Field name
     * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
     * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
     *
     * @returns {boolean} Return true if field is valid
     *
     * @since 2015.2
     */
    function validateField(scriptContext) {

    }

    /**
     * Validation function to be executed when sublist line is committed.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateLine(scriptContext) {

    }

    /**
     * Validation function to be executed when sublist line is inserted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateInsert(scriptContext) {

    }

    /**
     * Validation function to be executed when record is deleted.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @param {string} scriptContext.sublistId - Sublist name
     *
     * @returns {boolean} Return true if sublist line is valid
     *
     * @since 2015.2
     */
    function validateDelete(scriptContext) {

    }

    /**
     * Validation function to be executed when record is saved.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @returns {boolean} Return true if record is valid
     *
     * @since 2015.2
     */
    function saveRecord(scriptContext) {

    }

    return {
        pageInit: pageInit,
        // fieldChanged: fieldChanged,
        // postSourcing: postSourcing,
        // sublistChanged: sublistChanged,
        // lineInit: lineInit,
        // validateField: validateField,
        // validateLine: validateLine,
        // validateInsert: validateInsert,
        // validateDelete: validateDelete,
        // saveRecord: saveRecord
    };
    
});
