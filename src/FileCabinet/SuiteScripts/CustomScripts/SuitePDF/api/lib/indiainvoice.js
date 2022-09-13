define(['N/record', 'N/search', 'N/file', './helper', '../../../Library/handlebars', '../../../Helper/nstojson', '../../../Library/momentjs/moment', '../../../SuitePDF/api/lib/library'],

    function (record, search, file, helper, handlebars, nstojson, moment, libFunctions) {

        generate = function (recPrint) {

            var SUBTOTAL = -2;
            var DISCOUNT = 65;

            var recSub = record.load({
                type: record.Type.SUBSIDIARY,
                id: recPrint.getValue({
                    fieldId: 'subsidiary'
                })
            });

            var objRecPrint = nstojson.get(recPrint);
            var objRecSub = nstojson.get(recSub);

            for (var attrname in objRecPrint) {
                objRecSub[attrname] = objRecPrint[attrname];
            }

            objRecSub.hassrdiscount = false;
            objRecSub.srdiscount = 0;
            objRecSub.itemcount = 0;

            var nHeaderDiscount = recPrint.getValue('discountrate') ? recPrint.getText('discountrate') : undefined;
            var idLastItem = 0;
            var idLastDiscount = 0;

            var inExchangeRate = libFunctions.exchangeRate(recPrint.getValue('trandate'), recPrint.getValue('subsidiary'), 15);

            for (var nLine1 = 0; nLine1 < objRecSub.item.length; nLine1++) {
                var inTaxRate = objRecSub.item[0].taxrate1;
                var inTax = recPrint.getSublistValue({sublistId: 'item', fieldId: 'taxcode', line: 0});

                if (objRecSub.item[nLine1].item_id == SUBTOTAL) {

                    if(idLastDiscount != -1) {
                        objRecSub.item[nLine1].displayonpdf = false;
                        objRecSub.item[idLastItem].amount_id = objRecSub.item[nLine1].amount_id;
                        objRecSub.item[idLastItem].amount = (objRecSub.item[idLastItem].amount_id).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                    }
                }
                else if (objRecSub.item[nLine1].item_id == DISCOUNT) {

                    objRecSub.haslinediscount = true;
                    objRecSub.hassrdiscount = true;
                    objRecSub.item[nLine1].displayonpdf = false;

                    var objDiscount = {
                        desctription: '',
                        amount: objRecSub.item[nLine1].amount
                    };

                    objRecSub.item[idLastItem].amount_id += objRecSub.item[nLine1].amount_id;
                    objRecSub.item[idLastItem].amount = (objRecSub.item[idLastItem].amount_id).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

                    objRecSub.item[idLastItem].discountdetail.push(objDiscount);
                    objRecSub.srdiscount += objRecSub.item[nLine1].amount_id;
                }
                else {

                    idLastDiscount = 0;

                    objRecSub.itemcount++;
                    objRecSub.item[nLine1].no = objRecSub.itemcount;
                    objRecSub.item[nLine1].displayonpdf = true;
                    objRecSub.item[nLine1].discountdetail = [];

                    if(recPrint.getValue('custbody_unittype') == 2){

                        objRecSub.item[nLine1].quantity = (objRecSub.item[nLine1].quantity * 0.125).toFixed(3).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "1,");
                        objRecSub.item[nLine1].rate_id = objRecSub.item[nLine1].rate_id * 8;
                        objRecSub.item[nLine1].rate = (objRecSub.item[nLine1].rate_id).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                    }
                    objRecSub.item[nLine1].amount = (recPrint.getSublistValue({sublistId: 'item', fieldId: 'amount', line: nLine1}) /  inExchangeRate).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                    objRecSub.item[nLine1].grossamt = (recPrint.getSublistValue({sublistId: 'item', fieldId: 'grossamt', line: nLine1}) /  inExchangeRate).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                    objRecSub.item[nLine1].description = recPrint.getSublistValue({sublistId: 'item', fieldId: 'description', line: nLine1}).replace(/(?:\r\n|\r|\n)/g, '<br />').replace('&', '&amp;');

                    idLastItem = nLine1;
                    idLastDiscount = -1;
                }
            }

            if (nHeaderDiscount) {

                if (nHeaderDiscount.indexOf('%') > -1) {

                    var nDicountRate = nHeaderDiscount.replace(/-|%/g, '') / 100;

                    for (var nLine1 = 0; nLine1 < objRecSub.item.length; nLine1++) {

                        if (objRecSub.item[nLine1].displayonpdf) {

                            objRecSub.haslinediscount = true;
                            objRecSub.hassrdiscount = true;

                            var objDiscount = {
                                desctription: 'ServiceRocket Discount.',
                                amount: nHeaderDiscount.replace(/-/g, '')
                            };

                            var nDiscount = (objRecSub.item[nLine1].amount_id - (objRecSub.item[nLine1].amount_id * (1 - nDicountRate))) * -1;
                            objRecSub.item[nLine1].amount_id *= 1 - nDicountRate;
                            objRecSub.item[nLine1].amount = (objRecSub.item[nLine1].amount_id).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                            objRecSub.item[nLine1].discountdetail.push(objDiscount);
                            objRecSub.srdiscount += nDiscount;
                        }
                    }
                }
                else if (nHeaderDiscount.indexOf('%') == -1) {

                    objRecSub.hassrdiscount = true;
                    objRecSub.srdiscount += parseFloat(nHeaderDiscount.replace(/[^\d\.\-]/g, ''));
                }
            }

            var inJob = recPrint.getValue('job');
            var charges = '';

            if (inJob){
                var srch = search.load({
                    id: 'customsearch_invoice_charges' //**DO NOT EDIT/DELETE** Invoice Charges
                });

                srch.filters = [new search.createFilter({
                    name: 'internalid',
                    join: 'job',
                    operator: 'anyof',
                    values: inJob
                }),
                    new search.createFilter({
                        name: 'internalid',
                        join: 'invoice',
                        operator: 'anyof',
                        values: recPrint.id
                    })];

                charges = getAllResults(srch);
            }

            objRecSub.totalhours_id = 0.0;
            objRecSub.totalamount_id = 0.0;

            if(charges.length > 0){

                objRecSub.hascharges = true;
                objRecSub.charges = [];
                charges.forEach(function (charge) {


                    var objCharge = {};
                    objCharge.date = charge.getValue('chargedate');
                    objCharge.employee = charge.getValue('chargeemployee');

                    if (charge.getValue({
                        name: 'displayname',
                        join: 'item'
                    }) != '' && !charge.getValue({
                        name: 'displayname',
                        join: 'item'
                    })) {
                        objCharge.item = charge.getValue({
                            name: 'displayname',
                            join: 'item'
                        });
                    }
                    else {
                        objCharge.item = charge.getText('billingitem');
                    }

                    objCharge.memo = charge.getValue('memo');
                    objCharge.time = charge.getValue({
                        name: 'durationdecimal',
                        join: 'time'
                    });

                    objCharge.rate_id = charge.getValue('rate');

                    if(recPrint.getValue('custbody_unittype') == 2){

                        objCharge.time = objCharge.time * 0.125;
                        objCharge.rate_id = objCharge.rate_id * 8;
                        objCharge.rate = (objCharge.rate_id).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                    }



                    objCharge.amount = charge.getValue('amount');
                    objRecSub.totalhours_id += parseFloat(objCharge.time);
                    objRecSub.totalamount_id += parseFloat(objCharge.amount);
                    objRecSub.charges.push(objCharge);
                });

                objRecSub.totalhours = (objRecSub.totalhours_id).toFixed(3).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                objRecSub.totalamount = (objRecSub.totalamount_id).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

            }
            else{
                objRecSub.hascharges = false;
            }

            objRecSub.taxtotal_id += objRecSub.tax2total_id || 0.00;
            objRecSub.taxtotal = parseFloat(objRecSub.taxtotal_id).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

            objRecSub.custrecord_sr_addresss = objRecSub.custrecord_sr_address.replace(/<BR>/g, '<br />')
            libFunctions.subsidiaryLibrary(recPrint, objRecSub, inTaxRate, inTax);
            // objRecSub.documentname = 'Tax Invoice';
            //
            // if (recPrint.getValue('subsidiary') == 8) {
            //     objRecSub.documentname = 'Invoice';
            // }
            //
            // objRecSub.taxlabel = 'GST';
            //
            // if (recPrint.getValue('subsidiary') == 5) {
            //     objRecSub.taxlabel = 'GST';
            // }
            // else if (recPrint.getValue('subsidiary') == 2) {
            //     objRecSub.taxlabel = 'VAT';
            // }
            // else if (recPrint.getValue('subsidiary') == 8) {
            //     objRecSub.taxlabel = '';
            // } else if (recPrint.getValue('subsidiary') == 14) {
            //     objRecSub.federalidnumber = 'GST/HST Registration No: ' + objRecSub.federalidnumber;
            //     // objRecSub.taxcode = 'GST + PST ' + (inTaxRate ? inTaxRate : '');
            //     objRecSub.taxlabel = 'GST';
            //     objRecSub.hastax = true;
            // }
            //
            // if (recPrint.getValue('currency') == 1 && recPrint.getValue('subsidiary') == 6) {
            //
            // 	if (recPrint.getValue('custentity_is_australian_usd')) {
            // 		objRecSub.displayfxrate == true;
            // 	}
            // }
            //
            // if (recPrint.getValue('currencysymbol') == 'INR') {
            //    objRecSub.federalidnumber = recSub.getValue('federalidnumber');
            // }
            // else if (recPrint.getValue('currencysymbol') == 'MYR') {
            // 	objRecSub.federalidnumber = 'SST No: ' + recSub.getValue('federalidnumber');
            // }
            // else if (recPrint.getValue('currencysymbol') == 'CAD') {
            // 	objRecSub.federalidnumber = 'GST / HST Registration No: ' + recSub.getValue('federalidnumber');
            // }
            // else {
            // 	if (recPrint.getValue('subsidiary') == 2) {
            // 		objRecSub.federalidnumber = 'VAT Registration: ' + recSub.getValue('federalidnumber');
            // 	}
            // 	else {
            // 			objRecSub.federalidnumber = recSub.getValue('federalidnumber');
            // 	}
            // }
            //
            // objRecSub.hastax = true;
            //
            // if ( recPrint.getValue('subsidiary') == 8) {
            // 	objRecSub.hastax = false;
            // }

            if (recPrint.getValue('startdate') &&  recPrint.getValue('enddate')) {
                objRecSub.startdate = moment(recPrint.getValue('startdate')).format('D-MMM-YY');
                objRecSub.enddate = moment(recPrint.getValue('enddate')).format('D-MMM-YY');
            }
            else{

                var dStart = moment(recPrint.getValue('trandate')).startOf('month').format('D-MMM-YY');
                var dEnd = moment(recPrint.getValue('trandate')).endOf('month').format('D-MMM-YY');

                objRecSub.startdate = dStart;
                objRecSub.enddate = dEnd;
            }

            objRecSub.billingaddress = objRecSub.billingaddress.replace(/&/g, '&amp;');
            objRecSub.primarycontact = helper.getPrimaryContact({
                record: recPrint
            });
            objRecSub.paymentinstruction = helper.getPaymentInstruction({
                record: recPrint
            });
            objRecSub.paymentinstruction = objRecSub.paymentinstruction.replace(/<BR>/g, '<br />');

            var sTemplate = file.load(libFunctions.templateId().indiaInvoice);
            var sHandlebar = handlebars.compile(sTemplate.getContents());

            handlebars = helper.registerHelpers(handlebars);

            var sPdfTemplate = sHandlebar(objRecSub);

            return sPdfTemplate;
        };

        getAllResults = function(s) {
            var results = s.run();
            var searchResults = [];
            var searchid = 0;
            do {
                var resultslice = results.getRange({start:searchid,end:searchid+1000});
                resultslice.forEach(function(slice) {
                        searchResults.push(slice);
                        searchid++;
                    }
                );
            } while (resultslice.length >=1000);
            return searchResults;
        };

        return {
            generate: generate
        };

    });
