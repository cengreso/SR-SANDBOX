define(['N/record', 'N/search', 'N/file', './helper', '../../../Library/handlebars', '../../../Helper/nstojson'],

function(record, search, file, helper, handlebars, nstojson) {
   
	function generate(recPrint) {
		var NAVYITEM = 6328;
		var ENTPACK = 6453;
		var SUBTOTAL = -2;
		var NAVYDISCOUNT = 6443;
		var LOYALTYDISCOUNT = 6447;
		var UPGRADECREDIT = 6448;
		var PRICEADJUSTMENT = 6451;
		
		var recSub = record.load({	type: record.Type.SUBSIDIARY, 
								id: recPrint.getValue({fieldId: 'subsidiary'})});
		var sTemplate = '';
		
		if(recPrint.getValue({fieldId: 'custbody_quote_type'}) == 4){
			sTemplate = file.load(143426);	
		}
		else{
			sTemplate = file.load(101117);	
		}
		
		var nTaxRate = recPrint.getSublistValue({sublistId: 'item', fieldId: 'taxrate1', line : 0});
		
		var objRecPrint = nstojson.get(recPrint);
		var objRecSub = nstojson.get(recSub);
		
		for (var attrname in objRecPrint ) { 
			objRecSub [attrname] = objRecPrint[attrname]; 
		}
		
		objRecSub.haslinediscount = false;
		objRecSub.hasatldiscount = false;
		objRecSub.hassrdiscount = false;
		objRecSub.hasupgradecredit = false;
		objRecSub.atldiscount = 0;
		objRecSub.srdiscount = 0;
		objRecSub.upgradecredit = 0;
		objRecSub.itemcount = 0;
		
		var nHeaderDiscount = recPrint.getValue('discountrate') ? recPrint.getText('discountrate'): undefined;
		
		var idLastItem = 0;
		var idLastDiscount = 0;
			
		for (var nLine1 = 0; nLine1 < objRecSub.item.length; nLine1++) {
			
			if((objRecSub.item[nLine1].item).indexOf('RS') == 0 || objRecSub.item[nLine1].item_id  == ENTPACK){
				
				idLastDiscount = 0;
				objRecSub.itemcount ++;
				objRecSub.item[nLine1].displayonpdf = true;
				objRecSub.item[nLine1].upgradecredit_id = 0;
				objRecSub.item[nLine1].discountdetail = [];
				idLastItem = nLine1;
				idLastDiscount = -1;
			}
			else if(objRecSub.item[nLine1].item_id  == NAVYITEM || objRecSub.item[nLine1].item_id  == ENTPACK){
				
				idLastDiscount = 0;
				objRecSub.itemcount ++;
				objRecSub.item[nLine1].displayonpdf = true;
				objRecSub.item[nLine1].upgradecredit_id = 0;
				objRecSub.item[nLine1].discountdetail = [];
				idLastItem = nLine1;
				idLastDiscount = -1;
			}
			else if(objRecSub.item[nLine1].item_id  == SUBTOTAL){

				
				if(idLastDiscount != UPGRADECREDIT && idLastDiscount != -1){
					objRecSub.item[nLine1].displayonpdf = false;
					objRecSub.item[idLastItem].amount_id = objRecSub.item[nLine1].amount_id;
					objRecSub.item[idLastItem].amount = (objRecSub.item[idLastItem].amount_id).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
				}
			}
			else if(objRecSub.item[nLine1].item_id  == PRICEADJUSTMENT){
				
				idLastDiscount = PRICEADJUSTMENT;
				
				objRecSub.item[nLine1].displayonpdf = false;
				objRecSub.haslinediscount = true;
				objRecSub.hasatldiscount = true;
				
				var objDiscount = {desctription: objRecSub.item[nLine1].description,
						amount : objRecSub.item[nLine1].amount};
				
				objRecSub.item[idLastItem].discountdetail.push(objDiscount);
				
				objRecSub.atldiscount += objRecSub.item[nLine1].amount_id;
				
			}
			else if(objRecSub.item[nLine1].item_id  == LOYALTYDISCOUNT){
				
				idLastDiscount = LOYALTYDISCOUNT;
				
				objRecSub.item[nLine1].displayonpdf = false;
				objRecSub.haslinediscount = true;
				objRecSub.hasatldiscount = true;
				
				var objDiscount = {desctription: objRecSub.item[nLine1].description,
						amount : objRecSub.item[nLine1].amount};
				
				objRecSub.item[idLastItem].discountdetail.push(objDiscount);
				
				objRecSub.atldiscount += objRecSub.item[nLine1].amount_id;
				
			}
			else if(objRecSub.item[nLine1].item_id  == UPGRADECREDIT){
				
				idLastDiscount = UPGRADECREDIT;
				
				objRecSub.item[nLine1].displayonpdf = false;
				objRecSub.hasupgradecredit = true;
				objRecSub.subtotal_id += objRecSub.item[nLine1].amount_id * -1;
				objRecSub.subtotal = (objRecSub.subtotal_id).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
				objRecSub.upgradecredit += objRecSub.item[nLine1].amount_id;
				objRecSub.item[idLastItem].hasupgradecredit = true;
				objRecSub.item[idLastItem].upgradecredit_id += objRecSub.item[nLine1].amount_id;
				
			}
			else if(objRecSub.item[nLine1].item_id  == NAVYDISCOUNT && objRecSub.item[nLine1].description == 'Loyalty Discount.'){
				
				objRecSub.haslinediscount = true;
				objRecSub.hasatldiscount = true;
				objRecSub.item[nLine1].displayonpdf = false;
				
				var objDiscount = {desctription: objRecSub.item[nLine1].description,
						amount : objRecSub.item[nLine1].amount};
				
				objRecSub.item[idLastItem].discountdetail.push(objDiscount);
				
				objRecSub.atldiscount += objRecSub.item[nLine1].amount_id;
				
			}
			else if(objRecSub.item[nLine1].item_id  == NAVYDISCOUNT && objRecSub.item[nLine1].description == 'Upgrade Credit.'){
				
				objRecSub.item[nLine1].displayonpdf = false;
				objRecSub.hasupgradecredit = true;
				objRecSub.upgradecredit += objRecSub.item[nLine1].amount_id;
				
			}
			else if(objRecSub.item[nLine1].item_id  == NAVYDISCOUNT ){
				
				objRecSub.haslinediscount = true;
				objRecSub.hassrdiscount = true;
				objRecSub.item[nLine1].displayonpdf = false;
				
				var objDiscount = {desctription: objRecSub.item[nLine1].description,
						amount : objRecSub.item[nLine1].amount};
				
				objRecSub.item[idLastItem].amount_id += objRecSub.item[nLine1].amount_id;
				objRecSub.item[idLastItem].amount = (objRecSub.item[idLastItem].amount_id).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"); 
				
				
				objRecSub.item[idLastItem].discountdetail.push(objDiscount);
				objRecSub.srdiscount += objRecSub.item[nLine1].amount_id;
			}

		}
		
		if(nHeaderDiscount) {
			
			if (nHeaderDiscount.indexOf('%')  > -1  ){
		
				var nDicountRate = nHeaderDiscount.replace(/-|%/g,'') / 100;
				
				for (var nLine1 = 0; nLine1 < objRecSub.item.length; nLine1++) {
					
					if(objRecSub.item[nLine1].displayonpdf){
						
						
						objRecSub.haslinediscount = true;
						objRecSub.hassrdiscount = true;
						
						var objDiscount = {desctription: 'ServiceRocket Discount.',
								amount : nHeaderDiscount.replace(/-/g,'')};
						
						var nDiscount = (objRecSub.item[nLine1].amount_id - (objRecSub.item[nLine1].amount_id * (1 - nDicountRate))) * -1;
						
						if(objRecSub.item[nLine1].hasupgradecredit){
							
							var nAmount = objRecSub.item[nLine1].amount_id;
							var nLessUpgradeCredit = nAmount + objRecSub.item[nLine1].upgradecredit_id;
							var nDiscounted = nLessUpgradeCredit * (1-nDicountRate);
							var nDiscount = nAmount - nDiscounted;

							objRecSub.item[nLine1].amount_id = nDiscounted;
							objRecSub.item[nLine1].amount = (objRecSub.item[nLine1].amount_id).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"); 
							
							objRecSub.subtotal_id -= nDiscount;
							objRecSub.subtotal = (objRecSub.subtotal_id).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
							

							
						}
						else{
							objRecSub.item[nLine1].amount_id *= 1 - nDicountRate;
							objRecSub.item[nLine1].amount = (objRecSub.item[nLine1].amount_id).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"); 
						}
						
						objRecSub.item[nLine1].discountdetail.push(objDiscount);
						objRecSub.srdiscount += nDiscount;
					}
				}
			}
			else if (nHeaderDiscount.indexOf('%')  == -1  ){
				
				objRecSub.hassrdiscount = true;
				objRecSub.srdiscount += parseFloat(nHeaderDiscount.replace(/[^\d\.\-]/g, ''));
			}
		}
				
		objRecSub.taxtotal_id += objRecSub.tax2total_id || 0.00;
		objRecSub.taxtotal = parseFloat(objRecSub.taxtotal_id).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
		
		if(recPrint.getValue({fieldId: 'subsidiary'}) == 6){
			objRecSub.federalidnumber = 'ABN ' + objRecSub.federalidnumber;
			objRecSub.taxcode = 'GST';
			objRecSub.hastax = true;
		}
		else if(recPrint.getValue({fieldId: 'subsidiary'}) == 10){
			objRecSub.federalidnumber = '';
			objRecSub.taxcode = 'SST';
			objRecSub.hastax = true;
		}
		else if(recPrint.getValue({fieldId: 'subsidiary'}) == 14){
			objRecSub.federalidnumber = '';
			objRecSub.taxcode = 'GST + PST';
			objRecSub.hastax = true;
		}
		else if(recPrint.getValue({fieldId: 'subsidiary'}) == 2){
			objRecSub.federalidnumber = '';
			objRecSub.taxcode = 'VAT';
			objRecSub.hastax = true;
		}
		else{
			objRecSub.federalidnumber = '';
			objRecSub.hastax = false;
		}
		
		objRecSub.billingaddress = objRecSub.billingaddress.replace(/&/g, '&amp;');
        objRecSub.primarycontact = helper.getPrimaryContact({
            record: recPrint
        });
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
