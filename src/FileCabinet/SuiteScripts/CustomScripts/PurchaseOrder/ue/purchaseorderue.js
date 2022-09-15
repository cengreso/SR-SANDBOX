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

define(['N/record', 'N/search', 'N/url', '../api/purchaseorder','N/ui/serverWidget', "N/currency","N/runtime", 'N/query'],
	(record, search, url, purchaseorder, serverWidget, currency, runtime, query) => {
    const beforeLoad = (scriptContext) => {
			var newRecord = scriptContext.newRecord;
			try {
				var relatedRecordCount = newRecord.getLineCount({sublistId:'links'})
				var bills = []
				for (var ctr = 0; ctr < relatedRecordCount; ctr++) {
					var tranID = newRecord.getSublistValue({sublistId: 'links', fieldId: 'id', line: ctr});
					bills.push(tranID)
				}
				var currencycodes = getCurrencies();
				var gst = gettotalGST({newRecord,currencycodes});
				log.debug('gst',gst);
				//
				var totalAmount = getConvertedTotalAmount({tranID,currencycodes,newRecord});
				var poTotal = getPOtotal({currencycodes,newRecord});
				var totalForeign = (poTotal.totalforeignPO + gst.totalGSTForeign) + parseFloat(totalAmount.foreignTotalPayment);
				var totalUSD = (poTotal.totalUSDPO + gst.totalGSTUSD) + parseFloat(totalAmount.usdAmount);
				var scriptObj = runtime.getCurrentScript();
				log.debug({
					title: "Remaining usage units: ",
					details: scriptObj.getRemainingUsage()
				});
				var total = totalForeign
				// var total = totalUSD
				log.debug('totalForeign',totalForeign)
				log.debug('totalUSD',totalUSD)
				newRecord.setValue({fieldId:'custbody3',value:total.toFixed(2)});


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
			}catch (e) {
				log.debug('e',e)
			}
    }



		function getPOtotal({currencycodes,newRecord}){
			var currencycode = getCurrencySymbol({currencycodes, currencycode:newRecord.getText('currency') || 'USD'})
			var rate = currency.exchangeRate({
				source: 'USD',
				target: currencycode,
				date: newRecord.getValue('trandate')
			});
			return {totalUSDPO: parseFloat(newRecord.getValue('subtotal')) / rate, totalforeignPO: parseFloat(newRecord.getValue('subtotal'))}
		}
		function getCurrencies() {
			var currencySearch = search.create({
				type: 'currency',
				filters:[],
				columns: ['name','symbol']
			});
			var currencycodes = []
			currencySearch.run().each((o,i)=>{
				currencycodes.push({
					name:o.getValue('name'),
					symbol:o.getValue('symbol')})
				return true;
			})
			return currencycodes
		}
		function gettotalGST({newRecord,currencycodes}) {
			var arrItem = []
			var arrItemId = []
			var ItemCount = newRecord.getLineCount({sublistId:'item'})
			for (var ctr = 0; ctr < ItemCount; ctr++) {
				arrItem.push({
					gst:newRecord.getSublistValue({sublistId: 'item', fieldId: 'tax1amt', line: ctr}),
					id:newRecord.getSublistValue({sublistId: 'item', fieldId: 'linkedorder', line: ctr})[0]
				});
				arrItemId.push(newRecord.getSublistValue({sublistId: 'item', fieldId: 'linkedorder', line: ctr}));
			}
			var currencycode = 'USD';
			var sql = `SELECT createddate, id, BUILTIN.DF(custbody_req_currency) as currency, FROM Transaction WHERE Transaction.id IN (${arrItemId.toString()})`;
			var ressql = query.runSuiteQL({
				query: sql,
			}).asMappedResults()
			var totalGSTUSD = 0
			var totalGSTForeign = 0
			for (var resctr = 0; resctr < ressql.length; resctr++){
				for (var arrItemCtr = 0; arrItemCtr < arrItem.length; arrItemCtr++) {
					if(ressql[resctr].id == arrItem[arrItemCtr].id) {
						arrItem[arrItemCtr]['createddate'] = ressql[resctr].createddate
						currencycode = getCurrencySymbol({currencycodes, currencycode:ressql[resctr].currency}) || 'USD'
						var rate = currency.exchangeRate({
							source: currencycode,
							target: 'USD',
							// date: new Date(ressql[resctr].createddate),
							date: new Date(newRecord.getValue('trandate'))
						});
						totalGSTUSD += arrItem[arrItemCtr].gst * rate
						totalGSTForeign += arrItem[arrItemCtr].gst
					}
				}
			}
			return {totalGSTUSD, totalGSTForeign}
		}
		function getCurrencySymbol({currencycodes, currencycode}){
			for (var i = 0; i < currencycodes.length; i++){
				if(currencycodes[i].name == currencycode)
					return currencycodes[i].symbol;
			}
		}
		function getConvertedTotalAmount({tranID,currencycodes}){
			var vbsearch = search.create({
				type: 'transaction',
				filters:[
					['createdFrom', 'anyof', tranID],
					"AND",
					["type","anyof","VendPymt"],
				],
				columns: ['createdFrom','trandate', 'internalid','type','currency','total','tranid']
			});
			var currencycode = 'USD';
			var usdAmount = 0;
			var foreignTotalPayment = 0;
			vbsearch.run().each((obj) => {
				log.debug("obj.getValue('total')",obj.getValue('total'));
				log.debug("obj.getValue('trandate')",obj.getValue('trandate'));
				currencycode = getCurrencySymbol({currencycodes, currencycode:obj.getText('currency')});
				var rate = currency.exchangeRate({
					source: currencycode,
					target: 'USD',
					date: new Date(obj.getValue('trandate'))
				});
				foreignTotalPayment += parseFloat(obj.getValue('total')) / rate;
				usdAmount += parseFloat(obj.getValue('total'));
				return true;
			});
			return {
				usdAmount:usdAmount,
				foreignTotalPayment:foreignTotalPayment,
				currencycode:currencycode
			}
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

    return {
			beforeLoad,
			afterSubmit
		}

});