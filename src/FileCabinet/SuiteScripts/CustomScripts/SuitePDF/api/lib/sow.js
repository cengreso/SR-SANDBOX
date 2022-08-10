define(['N/runtime', 'N/record', 'N/search', 'N/file', '../../../Library/handlebars', '../../../Helper/nstojson'],

    function (runtime, record, search, file, handlebars, nstojson) {

	generate = function(recPrint) {

        var DISCOUNT = 65;
        var SUBTOTAL = -2;

        var recSub = record.load({
            type: record.Type.SUBSIDIARY,
            id: recPrint.getValue({
                fieldId: 'subsidiary'
            })
        });

        var sTemplate = file.load(168338);
        
        if(recPrint.getValue('custbody_unittype') == null){
        	recPrint.setValue({fieldId: 'custbody_unittype', value : 1});
        }

        var objRecPrint = nstojson.get(recPrint);
        var objRecSub = nstojson.get(recSub);
        	objRecSub.billingschedule = '';

        for (var attrname in objRecPrint) {
            objRecSub[attrname] = objRecPrint[attrname];
        }
        
        if(recPrint.getValue('job')){
        	
            var recProject = record.load({
                type: record.Type.JOB,
                id: recPrint.getValue('job')
            });
         
            objRecSub.billingschedule = recProject.getText('billingschedule');

        }
        

	        objRecSub.hasatldiscount = false;
	        objRecSub.hassrdiscount = false;
	        objRecSub.atldiscount = 0;
	        objRecSub.srdiscount = 0;
	        objRecSub.itemcount = 0;

        var nHeaderDiscount = recPrint.getValue('discountrate') ? recPrint.getText('discountrate') : undefined;

        var idLastItem = 0;
        var idLastDiscount = 0;

        for (var nLine1 = 0; nLine1 < objRecSub.item.length; nLine1++) {

            if (objRecSub.item[nLine1].item_id != DISCOUNT && objRecSub.item[nLine1].item_id != SUBTOTAL) {

                if(recPrint.getValue('custbody_unittype') == 2){
                	
                	objRecSub.item[nLine1].quantity_id = objRecSub.item[nLine1].quantity_id * 0.125;
                	objRecSub.item[nLine1].quantity = (objRecSub.item[nLine1].quantity_id).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                	objRecSub.item[nLine1].rate_id = objRecSub.item[nLine1].rate_id * 8;
                	objRecSub.item[nLine1].rate = (objRecSub.item[nLine1].rate_id).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                }
            	
            	idLastDiscount = 0;
                objRecSub.itemcount++;
                objRecSub.item[nLine1].displayonpdf = true;
                objRecSub.item[nLine1].discountdetail = [];
                idLastItem = nLine1;
                idLastDiscount = -1;
            } 
            else if (objRecSub.item[nLine1].item_id == SUBTOTAL) {

                if (idLastDiscount != -1) {
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
                    desctription: objRecSub.item[nLine1].description,
                    amount: objRecSub.item[nLine1].amount
                };

                objRecSub.item[idLastItem].amount_id += objRecSub.item[nLine1].amount_id;
                objRecSub.item[idLastItem].amount = (objRecSub.item[idLastItem].amount_id).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

                objRecSub.item[idLastItem].discountdetail.push(objDiscount);
                objRecSub.srdiscount += objRecSub.item[nLine1].amount_id;
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
                            desctription: '',
                            amount: nHeaderDiscount.replace(/-/g, '')
                        };

                        var nDiscount = (objRecSub.item[nLine1].amount_id - (objRecSub.item[nLine1].amount_id * (1 - nDicountRate))) * -1;

                        objRecSub.item[nLine1].amount_id *= 1 - nDicountRate;
                        objRecSub.item[nLine1].amount = (objRecSub.item[nLine1].amount_id).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                        objRecSub.item[nLine1].discountdetail.push(objDiscount);
                        objRecSub.srdiscount += nDiscount;
                    }
                }
            } else if (nHeaderDiscount.indexOf('%') == -1) {

                objRecSub.hassrdiscount = true;
                objRecSub.srdiscount += parseFloat(nHeaderDiscount.replace(/[^\d\.\-]/g, ''));
            }
        }
        
        var result = [];
        
        objRecSub.item.reduce(function (res, value) {
        	
            if (!res[value.custcol_item_displayname]) {
            	
                res[value.custcol_item_displayname] = {
                	displayonpdf: value.displayonpdf,
        			custcol_item_displayname: value.custcol_item_displayname,
        			description: value.description,
        			rate_id: value.rate_id,
        			quantity_id: 0,
        			amount_id: 0,
    				rate: value.rate,
        			quantity: '0.00',
        			amount: '0.00'
                };
                result.push(res[value.custcol_item_displayname]);
            }
            
            if(value.class_id == '85' || value.class_id == '86'){
            	
                res[value.custcol_item_displayname].quantity_id += value.quantity_id;
            	res[value.custcol_item_displayname].amount_id += value.amount_id;
            	//res[value.custcol_item_displayname].quantity = (res[value.custcol_item_displayname].quantity_id).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
            	
            	if( value.item_id != DISCOUNT){
            		res[value.custcol_item_displayname].quantity = (res[value.custcol_item_displayname].quantity_id).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");	
            	}
            	
            	res[value.custcol_item_displayname].amount = (res[value.custcol_item_displayname].amount_id).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
            }

            return res;
        }, {});
        
        objRecSub.item = result;

        objRecSub.taxtotal_id += objRecSub.tax2total_id || 0.00;
        objRecSub.taxtotal = parseFloat(objRecSub.taxtotal_id).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

        if (recPrint.getValue({
                fieldId: 'subsidiary'
            }) == 6) {
            objRecSub.federalidnumber = 'ABN ' + objRecSub.federalidnumber;
            objRecSub.taxcode = 'GST';
            objRecSub.hastax = true;
        } else if (recPrint.getValue({
                fieldId: 'subsidiary'
            }) == 10) {
            objRecSub.federalidnumber = '';
            objRecSub.taxcode = 'SST';
            objRecSub.hastax = true;
        } else if (recPrint.getValue({
                fieldId: 'subsidiary'
            }) == 14) {
            objRecSub.federalidnumber = '';
            objRecSub.taxcode = 'GST + PST';
            objRecSub.hastax = true;
        } else if (recPrint.getValue({
                fieldId: 'subsidiary'
            }) == 2) {
            objRecSub.federalidnumber = '';
            objRecSub.taxcode = 'VAT';
            objRecSub.hastax = true;
        } else {
            objRecSub.federalidnumber = '';
            objRecSub.hastax = false;
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

        objRecSub.paymentinstruction = '';

        var srch = search.create({
            type: 'customrecord_paymentinstructions'
        });
        srch.columns = [new search.createColumn({
                name: 'custrecord_payinst_instruction'
            })];
        srch.filters = [new search.createFilter({
                name: 'custrecord_payinst_subsidiary',
                operator: 'anyof',
                values: recPrint.getValue({
                    fieldId: 'subsidiary'
                })
            }),
            new search.createFilter({
                name: 'custrecord_payinst_currency',
                operator: 'anyof',
                values: recPrint.getValue({
                    fieldId: 'currency'
                })
            })];

        var srcResult = srch.run().getRange({
            start: 0,
            end: 1
        });

        if (srcResult.length > 0) {
            objRecSub.paymentinstruction = srcResult[0].getValue({
                name: 'custrecord_payinst_instruction'
            });
        }

        var sHandlebar = handlebars.compile(sTemplate.getContents());
        handlebars.registerHelper('if_even',
            function (conditional) {

            if ((conditional % 2) == 0) {
                return '#FFFFFF';
            } else {
                return '#F0F0F0';
            }
        });

        handlebars.registerHelper('nohierarchy', function (value) {
            var arrValue = value.split(':');
            return arrValue[arrValue.length - 1];
        });

        handlebars.registerHelper('replace', function (find, replace, options) {
            var string = options.fn(this);
            return string.replace(find, replace);
        });

        handlebars.registerHelper('currency', function (value) {
            return value.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
        });

        var sPdfTemplate = sHandlebar(objRecSub);

        return sPdfTemplate;
    };

    return {
        generate: generate
    };

});
