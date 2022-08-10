define(['N/query', 'N/currency'],

    function (query, currency) {
        var libFunctions = {};

        libFunctions.templateId = function () {
            var objTemplateId = {
                invoice: 170811,
                indiaInvoice: 286333,
                atlInvoice: 170916,
            }

            return objTemplateId;
        };

        libFunctions.subsidiaryLibrary = function (recPrint, objRecSub, inTaxRate, inTax) {
            var objRecordFields = recordFields(recPrint);
            var objSubsidiary = convertSubsidiaryValueToString();

            if (objRecordFields.inSubsidiary == objSubsidiary.ServiceRocket_Canada_Ltd) {
                var stTaxDescription = taxDescriptionForCanada(inTax);
            }

            var inExchangeRate = libFunctions.exchangeRate(objRecordFields.dtTranDate, objRecordFields.inSubsidiary, objSubsidiary.ServiceRocket_India_Private_Ltd);
            var objAmountInWords = amountInWords(inExchangeRate, objRecordFields.inSubTotal);

            objRecSub.documentname = 'Tax Invoice';
            if (objRecordFields.inSubsidiary == objSubsidiary.ServiceRocket_Pty_Ltd) {
                objRecSub.federalidnumber = 'ABN ' + objRecSub.federalidnumber;
                objRecSub.taxcode = 'GST ' + (inTaxRate ? inTaxRate : '');
                objRecSub.taxlabel = 'GST';
                objRecSub.hastax = true;
            } else if (objRecordFields.inSubsidiary == objSubsidiary.ServiceRocket_Inc) {
                objRecSub.documentname = 'Invoice';
                objRecSub.federalidnumber = 'EIN ' + objRecSub.federalidnumber;
                objRecSub.taxcode = 'Discount';
                objRecSub.hastax = false;
            } else if (objRecordFields.inSubsidiary == objSubsidiary.ServiceRocket_Sdn_Bhd) {
                objRecSub.federalidnumber = 'SST No: ' + objRecSub.federalidnumber;
                objRecSub.taxcode = 'SST ' + (inTaxRate ? inTaxRate : '');
                objRecSub.taxlabel = 'SST';
                objRecSub.hastax = true;
            } else if (objRecordFields.inSubsidiary == objSubsidiary.ServiceRocket_Canada_Ltd) {
                objRecSub.federalidnumber = 'GST/HST Registration No: ' + objRecSub.federalidnumber;
                // objRecSub.taxcode = 'GST + PST ' + (inTaxRate ? inTaxRate : '');
                objRecSub.taxcode = stTaxDescription;
                objRecSub.taxlabel = 'Tax';
                objRecSub.hastax = true;
            } else if (objRecordFields.inSubsidiary == objSubsidiary.ServiceRocket_Pte_Ltd) {
                objRecSub.federalidnumber = '';
                objRecSub.taxcode = 'GST ' + (inTaxRate ? inTaxRate : '');
                objRecSub.taxlabel = 'GST';
                objRecSub.hastax = true;
            } else if (objRecordFields.inSubsidiary == objSubsidiary.ServiceRocket_SpA) {
                objRecSub.federalidnumber = objRecSub.federalidnumber;
                objRecSub.taxcode = 'GST ' + (inTaxRate ? inTaxRate : '');
                objRecSub.taxlabel = 'GST';
                objRecSub.hastax = true;
            } else if (objRecordFields.inSubsidiary == objSubsidiary.ServiceRocket_Limited) {
                objRecSub.federalidnumber = 'VAT Registration: ' + objRecSub.federalidnumber;
                objRecSub.taxcode = 'VAT ' + (inTaxRate ? inTaxRate : '');
                objRecSub.taxlabel = 'VAT';
                objRecSub.hastax = true;
            } else if (objRecordFields.inSubsidiary == objSubsidiary.ServiceRocket_India_Private_Ltd) {
                objRecSub.exportnote = 'SUPPLY MEANT FOR EXPORT UNDER BOND WITHOUT PAYMENT OF IGST';
                objRecSub.documentname = 'Export invoice';
                objRecSub.federalidnumber = objRecSub.federalidnumber + '<br />' + 'GSTIN: ' + objRecSub.custrecord_sr_gst_number + '<br />' + 'LUT: ' + objRecSub.custrecord_sr_lut_number;
                objRecSub.taxcode = 'GST ' + (inTaxRate ? inTaxRate : '');
                objRecSub.taxlabel = 'GST';
                objRecSub.hastax = true;
                objRecSub.changedTotal = objAmountInWords.changedTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                objRecSub.usdExchangeRate = inExchangeRate;
                objRecSub.wordUS = objAmountInWords.stAmountUS;
                objRecSub.wordRS = objAmountInWords.stAmount;
            } else {
                objRecSub.federalidnumber = '';
                objRecSub.hastax = false;
            }
        }

        function recordFields(recPrint) {
            var objRecordFields = {};

            var inSubsidiary = recPrint.getValue({
                fieldId: 'subsidiary'
            });
            var dtTranDate = recPrint.getValue({
                fieldId: 'trandate'
            });
            var inSubTotal = recPrint.getValue({
                fieldId: 'subtotal'
            });

            objRecordFields = {
                inSubsidiary: inSubsidiary,
                dtTranDate: dtTranDate,
                inSubTotal: inSubTotal
            };

            return objRecordFields;
        }

        function convertSubsidiaryValueToString() {
            var objSubsidiary = {
                ServiceRocket_Pty_Ltd: 6,
                ServiceRocket_Inc: 8,
                ServiceRocket_Sdn_Bhd: 10,
                ServiceRocket_Canada_Ltd: 14,
                ServiceRocket_Pte_Ltd: 12,
                ServiceRocket_SpA: 5,
                ServiceRocket_Limited: 2,
                ServiceRocket_India_Private_Ltd: 15
            };

            return objSubsidiary;
        }

        function taxDescriptionForCanada(inTax) {
            var arrData = query.runSuiteQL({
                query: 'SELECT description FROM taxItemTaxGroup WHERE ID = ?',
                params: [inTax]
            }).asMappedResults();

            return arrData[0].description;
        }

        libFunctions.exchangeRate = function (dtTranDate, inSubsidiary, ServiceRocket_India_Private_Ltd) {
            var rate = 1;
            if (inSubsidiary == ServiceRocket_India_Private_Ltd) {
                rate = currency.exchangeRate({
                    source: 'USD',
                    target: 'INR',
                    date: new Date(dtTranDate)
                });
            }

            return rate;
        }

        function amountInWords(rate, inSubTotal) {
            var objAmountInWords = {};

            if (rate != 1) {
                var changedTotal = (inSubTotal / rate).toFixed(2);
                var splittedNumRS = inSubTotal.toString().split('.');
                var splittedNumUS = changedTotal.toString().split('.');
                var nonDecimal = splittedNumRS[0];
                var decimal = splittedNumRS[1];

                if (decimal == undefined || decimal == 'undefined') {
                    var stAmount = price_in_words(Number(nonDecimal)) + "Only";
                } else {
                    var stAmount = price_in_words(Number(nonDecimal)) + " and " + price_in_words(decimal) + " paise Only";
                }

                var nonDecimalUs = splittedNumUS[0];
                var decimalUS = splittedNumUS[1];

                if (decimalUS == undefined || decimalUS == 'undefined') {
                    var stAmountUS = price_in_words(Number(nonDecimalUs)) + "Only";
                } else {
                    var stAmountUS = price_in_words(Number(nonDecimalUs)) + " And Cents " + price_in_words(decimalUS) + "Only";
                }
            }

            objAmountInWords.stAmount = stAmount;
            objAmountInWords.stAmountUS = stAmountUS;
            objAmountInWords.changedTotal = changedTotal;

            return objAmountInWords;
        }

        function price_in_words(price) {
            var sglDigit = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"],
                dblDigit = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"],
                tensPlace = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"],
                handle_tens = function (dgt, prevDgt) {
                    return 0 == dgt ? "" : " " + (1 == dgt ? dblDigit[prevDgt] : tensPlace[dgt])
                },
                handle_utlc = function (dgt, nxtDgt, denom) {
                    return (0 != dgt && 1 != nxtDgt ? " " + sglDigit[dgt] : "") + (0 != nxtDgt || dgt > 0 ? " " + denom : "")
                };

            var str = "",
                digitIdx = 0,
                digit = 0,
                nxtDigit = 0,
                words = [];
            if (price += "", isNaN(parseInt(price))) str = "";
            else if (parseInt(price) > 0 && price.length <= 10) {
                for (digitIdx = price.length - 1; digitIdx >= 0; digitIdx--) switch (digit = price[digitIdx] - 0, nxtDigit = digitIdx > 0 ? price[digitIdx - 1] - 0 : 0, price.length - digitIdx - 1) {
                    case 0:
                        words.push(handle_utlc(digit, nxtDigit, ""));
                        break;
                    case 1:
                        words.push(handle_tens(digit, price[digitIdx + 1]));
                        break;
                    case 2:
                        words.push(0 != digit ? " " + sglDigit[digit] + " Hundred" + (0 != price[digitIdx + 1] || 0 != price[digitIdx + 2] ? " and" : "") : "");
                        break;
                    case 3:
                        words.push(handle_utlc(digit, nxtDigit, "Thousand"));
                        break;
                    case 4:
                        words.push(handle_tens(digit, price[digitIdx + 1]));
                        break;
                    case 5:
                        words.push(handle_utlc(digit, nxtDigit, "Lakh"));
                        break;
                    case 6:
                        words.push(handle_tens(digit, price[digitIdx + 1]));
                        break;
                    case 7:
                        words.push(handle_utlc(digit, nxtDigit, "Crore"));
                        break;
                    case 8:
                        words.push(handle_tens(digit, price[digitIdx + 1]));
                        break;
                    case 9:
                        words.push(0 != digit ? " " + sglDigit[digit] + " Hundred" + (0 != price[digitIdx + 1] || 0 != price[digitIdx + 2] ? " and" : " Crore") : "")
                }
                str = words.reverse().join("")
            } else str = "";
            return str
        }


        return libFunctions

    });
