define(['N/record', 'N/search', 'N/file', './helper', '../../../Library/handlebars', '../../../Helper/nstojson', '../../../Library/momentjs/moment', '../../../SuitePDF/api/lib/library'],

    function (record, search, file, helper, handlebars, nstojson, moment, libFunctions) {

        function generate(recPrint) {

            var SUBTOTAL = -2;
            var DISCOUNT = 65;
            var NAVYDISCOUNT = 6443;
            var LOYALTYDISCOUNT = 6447;
            var UPGRADECREDIT = 6448;
            var PRICEADJUSTMENT = 6451;

            var recSub = record.load({
                type: record.Type.SUBSIDIARY,
                id: recPrint.getValue({
                    fieldId: 'subsidiary'
                })
            });

            var sTemplate = file.load(libFunctions.templateId().atlInvoice);

            var nTaxRate = recPrint.getSublistValue({
                sublistId: 'item',
                fieldId: 'taxrate1',
                line: 0
            });

            var objRecPrint = nstojson.get(recPrint);
            var objRecSub = nstojson.get(recSub);
            var objPercentDicount = {};

            for (var attrname in objRecPrint) {
                objRecSub[attrname] = objRecPrint[attrname];
            }

            objRecSub.hasatldiscount = false;
            objRecSub.hassrdiscount = false;
            objRecSub.hasupgradecredit = false;

            //objRecSub.subtotal_id = 0;
            objRecSub.atldiscount = 0;
            objRecSub.srdiscount = 0;
            objRecSub.upgradecredit = 0;
            objRecSub.itemcount = 0;

            var nHeaderDiscount = recPrint.getValue('discountrate') ? recPrint.getText('discountrate') : undefined;

            var idLastItem = 0;
            var idLastDiscount = 0;

            for (var nLine1 = 0; nLine1 < objRecSub.item.length; nLine1++) {
                var inTaxRate = objRecSub.item[0].taxrate1;
                // var inTax = objRecSub.item[0].taxcode;
                var inTax = recPrint.getSublistValue({sublistId: 'item', fieldId: 'taxcode', line: 0});

                if (objRecSub.item[nLine1].item_id == SUBTOTAL) {

                    if (idLastDiscount != UPGRADECREDIT && idLastDiscount != -1) {
                        objRecSub.item[nLine1].displayonpdf = false;
                        objRecSub.item[idLastItem].amount_id = objRecSub.item[nLine1].amount_id;
                        objRecSub.item[idLastItem].amount = (objRecSub.item[idLastItem].amount_id).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                    }

                    objRecSub.item[idLastItem].tax1amt = objRecSub.item[nLine1].tax1amt;
                } else if (objRecSub.item[nLine1].item_id == PRICEADJUSTMENT) {

                    idLastDiscount = PRICEADJUSTMENT;

                    objRecSub.item[nLine1].displayonpdf = false;
                    objRecSub.haslinediscount = true;
                    objRecSub.hasatldiscount = true;

                    var objDiscount = {
                        desctription: objRecSub.item[nLine1].description,
                        amount: objRecSub.item[nLine1].amount
                    };

                    objRecSub.item[idLastItem].discountdetail.push(objDiscount);

                    objRecSub.atldiscount += objRecSub.item[nLine1].amount_id;

                } else if (objRecSub.item[nLine1].item_id == LOYALTYDISCOUNT) {

                    idLastDiscount = LOYALTYDISCOUNT;

                    objRecSub.item[nLine1].displayonpdf = false;
                    objRecSub.haslinediscount = true;
                    objRecSub.hasatldiscount = true;

                    var objDiscount = {
                        desctription: objRecSub.item[nLine1].description,
                        amount: objRecSub.item[nLine1].amount
                    };

                    objRecSub.item[idLastItem].discountdetail.push(objDiscount);

                    objRecSub.atldiscount += objRecSub.item[nLine1].amount_id;

                } else if (objRecSub.item[nLine1].item_id == UPGRADECREDIT) {

                    idLastDiscount = UPGRADECREDIT;

                    objRecSub.haslinediscount = true;
                    objRecSub.item[nLine1].displayonpdf = false;
                    objRecSub.hasupgradecredit = true;
                    objRecSub.subtotal_id += objRecSub.item[nLine1].amount_id * -1;
                    objRecSub.subtotal = (objRecSub.subtotal_id).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                    objRecSub.upgradecredit += objRecSub.item[nLine1].amount_id;
                    objRecSub.item[idLastItem].hasupgradecredit = true;
                    objRecSub.item[idLastItem].upgradecredit_id += objRecSub.item[nLine1].amount_id;

                } else if (objRecSub.item[nLine1].item_id == NAVYDISCOUNT && objRecSub.item[nLine1].description == 'Loyalty Discount.') {

                    objRecSub.haslinediscount = true;
                    objRecSub.hasatldiscount = true;
                    objRecSub.item[nLine1].displayonpdf = false;

                    var objDiscount = {
                        desctription: objRecSub.item[nLine1].description,
                        amount: objRecSub.item[nLine1].amount
                    };

                    objRecSub.item[idLastItem].discountdetail.push(objDiscount);

                    objRecSub.atldiscount += objRecSub.item[nLine1].amount_id;

                } else if (objRecSub.item[nLine1].item_id == NAVYDISCOUNT && objRecSub.item[nLine1].description == 'Upgrade Credit.') {

                    objRecSub.item[nLine1].displayonpdf = false;
                    objRecSub.hasupgradecredit = true;
                    objRecSub.upgradecredit += objRecSub.item[nLine1].amount_id;

                } else if (objRecSub.item[nLine1].item_id == NAVYDISCOUNT) {

                    objRecSub.haslinediscount = true;
                    objRecSub.hassrdiscount = true;
                    objRecSub.item[nLine1].displayonpdf = false;

                    var objDiscount = {
                        desctription: objRecSub.item[nLine1].description,
                        amount: objRecSub.item[nLine1].amount
                    };

                    objRecSub.item[idLastItem].amount_id += objRecSub.item[nLine1].amount_id;
                    objRecSub.item[idLastItem].amount = (objRecSub.item[idLastItem].amount_id).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

                    objRecSub.item[idLastItem].discountdetail.push(objDiscount);
                    objRecSub.srdiscount += objRecSub.item[nLine1].amount_id;
                } else if (objRecSub.item[nLine1].item_id == DISCOUNT) {

                    objRecSub.haslinediscount = true;
                    objRecSub.hassrdiscount = true;
                    objRecSub.item[nLine1].displayonpdf = false;

                    var objDiscount = {
                        desctription: objRecSub.item[nLine1].description,
                        amount: objRecSub.item[nLine1].amount
                    };

                    objRecSub.item[idLastItem].amount_id += objRecSub.item[nLine1].amount_id;
                    objRecSub.item[idLastItem].amount = (objRecSub.item[idLastItem].amount_id).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

                    objRecSub.item[idLastItem].discountdetail.push(objDiscount);
                    objRecSub.srdiscount += objRecSub.item[nLine1].amount_id;
                } else {

                    idLastDiscount = 0;

                    objRecSub.itemcount++;
                    objRecSub.item[nLine1].no = objRecSub.itemcount;
                    objRecSub.item[nLine1].displayonpdf = true;
                    objRecSub.item[nLine1].upgradecredit_id = 0;
                    objRecSub.item[nLine1].discountdetail = [];
                    objRecSub.item[nLine1].description = recPrint.getSublistValue({sublistId: 'item', fieldId: 'description', line: nLine1}).replace(/(?:\r\n|\r|\n)/g, '<br />').replace('&', '&amp;');
                    idLastItem = nLine1;
                    idLastDiscount = -1;

                    if (recPrint.getValue('subsidiary') == 14) {
                        objRecSub.item[nLine1].tax1amt = Number(objRecSub.item[nLine1].amount.replace(/,/g, '') * (parseFloat(objRecSub.item[nLine1].taxrate1)/100)).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                    }
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

                            if (objRecSub.item[nLine1].hasupgradecredit) {

                                var nAmount = objRecSub.item[nLine1].amount_id;
                                var nLessUpgradeCredit = nAmount + objRecSub.item[nLine1].upgradecredit_id;
                                var nDiscounted = nLessUpgradeCredit * (1 - nDicountRate);
                                var nDiscount = nAmount - nDiscounted;

                                objRecSub.item[nLine1].amount_id = nDiscounted;
                                objRecSub.item[nLine1].amount = (objRecSub.item[nLine1].amount_id).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

                                objRecSub.subtotal_id -= nDiscount;
                                objRecSub.subtotal = (objRecSub.subtotal_id).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

                            } else {
                                objRecSub.item[nLine1].amount_id *= 1 - nDicountRate;
                                objRecSub.item[nLine1].amount = (objRecSub.item[nLine1].amount_id).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                            }

                            objRecSub.item[nLine1].discountdetail.push(objDiscount);
                            objRecSub.srdiscount += nDiscount;
                        }
                    }
                } else if (nHeaderDiscount.indexOf('%') == -1) {

                    objRecSub.hassrdiscount = true;
                    objRecSub.srdiscount += parseFloat(nHeaderDiscount.replace(/[^\d\.\-]/g, ''));
                }
            }

            objRecSub.taxtotal_id += objRecSub.tax2total_id || 0.00;
            objRecSub.taxtotal = parseFloat(objRecSub.taxtotal_id).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

            if (recPrint.getValue({
                fieldId: 'subsidiary'
            }) == 14) {
                objRecSub.exportnote = "SUPPLY MEANT FOR EXPORT UNDER BOND WITHOUT PAYMENT OF  IGST";
            }

            libFunctions.subsidiaryLibrary(recPrint, objRecSub, inTaxRate, inTax);
            // libFunctions.taxCode(inTax);
            // var objSubsidiary = convertSubsidiaryValueToString();
            // var inSubsidiary = recPrint.getValue({
            //     fieldId: 'subsidiary'
            // });
            //
            // //documentname
            // objRecSub.documentname = 'Tax Invoice';
            // if (inSubsidiary == objSubsidiary.ServiceRocket_Pty_Ltd) {
            //     objRecSub.federalidnumber = 'ABN ' + objRecSub.federalidnumber;
            //     objRecSub.taxcode = 'GST ' + (inTaxRate ? inTaxRate : '');
            //     objRecSub.taxlabel = 'GST';
            //     objRecSub.hastax = true;
            // } else if (inSubsidiary == objSubsidiary.ServiceRocket_Inc) {
            //     objRecSub.documentname = 'Invoice';
            //     objRecSub.federalidnumber = 'EIN ' + objRecSub.federalidnumber;
            //     objRecSub.taxcode = 'Discount';
            //     objRecSub.hastax = false;
            // } else if (inSubsidiary == objSubsidiary.ServiceRocket_Sdn_Bhd) {
            //     objRecSub.federalidnumber = 'SST No: ' + objRecSub.federalidnumber;
            //     objRecSub.taxcode = 'SST ' + (inTaxRate ? inTaxRate : '');
            //     objRecSub.taxlabel = 'SST';
            //     objRecSub.hastax = true;
            // } else if (inSubsidiary == objSubsidiary.ServiceRocket_Canada_Ltd) {
            //     objRecSub.federalidnumber = 'GST/HST Registration No: ' + objRecSub.federalidnumber;
            //     objRecSub.taxcode = 'GST + PST ' + (inTaxRate ? inTaxRate : '');
            //     objRecSub.taxlabel = 'GST';
            //     objRecSub.hastax = true;
            // } else if (inSubsidiary == objSubsidiary.ServiceRocket_Pte_Ltd) {
            //     objRecSub.federalidnumber = '';
            //     objRecSub.taxcode = 'GST ' + (inTaxRate ? inTaxRate : '');
            //     objRecSub.hastax = true;
            // } else if (inSubsidiary == objSubsidiary.ServiceRocket_SpA) {
            //     objRecSub.federalidnumber = objRecSub.federalidnumber;
            //     objRecSub.taxcode = 'GST ' + (inTaxRate ? inTaxRate : '');
            //     objRecSub.hastax = true;
            // } else if (inSubsidiary == objSubsidiary.ServiceRocket_Limited) {
            //     objRecSub.federalidnumber = 'VAT Registration: ' + objRecSub.federalidnumber;
            //     objRecSub.taxcode = 'VAT ' + (inTaxRate ? inTaxRate : '');
            //     objRecSub.hastax = true;
            // } else {
            //     objRecSub.federalidnumber = '';
            //     objRecSub.hastax = false;
            // }

            if (recPrint.getValue('startdate') && recPrint.getValue('enddate')) {
                objRecSub.startdate = moment(recPrint.getValue('startdate')).format('D-MMM-YY');
                objRecSub.enddate = moment(recPrint.getValue('startdate')).format('D-MMM-YY');
            } else {

                var dStart = moment(recPrint.getValue('trandate')).startOf('month').format('D-MMM-YY');
                var dEnd = moment(recPrint.getValue('trandate')).endOf('month').format('D-MMM-YY');

                objRecSub.startdate = dStart;
                objRecSub.enddate = dEnd;
            }

            objRecSub.primarycontact = '';
            objRecSub.billingaddress = objRecSub.billingaddress.replace(/&/g, '&amp;');

            var srch = search.create({
                type: record.Type.ESTIMATE
            });
            srch.columns = [new search.createColumn({
                name: 'entityid',
                join: 'contactprimary'
            })];
            srch.filters = [new search.createFilter({
                name: 'internalid',
                operator: 'anyof',
                values: recPrint.id
            }),
                new search.createFilter({
                    name: 'mainline',
                    operator: 'is',
                    values: true
                })];

            var srcResult = srch.run().getRange({
                start: 0,
                end: 1
            });

            if (srcResult.length > 0) {
                objRecSub.primarycontact = srcResult[0].getValue({
                    name: 'entityid',
                    join: 'contactprimary'
                });
            }

            objRecSub.paymentinstruction = helper.getPaymentInstruction({
                record: recPrint
            });

            var sHandlebar = handlebars.compile(sTemplate.getContents());
            handlebars = helper.registerHelpers(handlebars);
            var sPdfTemplate = sHandlebar(objRecSub);

            return sPdfTemplate;
        }

        return {
            generate: generate
        };

    });
