define(['N/record', 'N/search', 'N/file', '../../../Library/handlebars', '../../../Helper/nstojson'],

function(record, search, file, handlebars, nstojson) {
   
	function generate(recPrint) {
		
		var NAVYITEM = 6328;
		var NAVYDISCOUNT = 6443;
		var ATLDISCOUNT = 6398;
		
		
		var recSub = record.load({	type: record.Type.SUBSIDIARY, 
								id: recPrint.getValue({fieldId: 'subsidiary'})});
		var sTemplate = '';
		
		if(recPrint.getValue({fieldId: 'custbody_quote_type'}) == 4){
			sTemplate = file.load(143426);	
		}
		else{
			sTemplate = file.load(146984);	
		}
		
		var nTaxRate = recPrint.getSublistValue({sublistId: 'item', fieldId: 'taxrate1', line : 0});
		log.audit({title: 'navy', details: 'nTaxRate ' + nTaxRate});
		
		var objRecPrint = nstojson.get(recPrint);
		var objRecSub = nstojson.get(recSub);
		var objPercentDicount = {};
		
		for (var attrname in objRecPrint ) { 
			objRecSub [attrname] = objRecPrint[attrname]; 
		}

		objRecSub.atldiscount = 0;
		objRecSub.srdiscount = 0;
		objRecSub.upgradecredit = 0;
		objRecSub.itemcount = 0;
		
		var nHeaderDiscount = recPrint.getValue('discountrate') ? recPrint.getText('discountrate'): undefined;
		
		var idLastItem = 0;
			
		for (var nLine1 = 0; nLine1 < objRecSub.item.length; nLine1++) {
			
			if(objRecSub.item[nLine1].item_id  == NAVYITEM){
				objRecSub.itemcount ++;
				objRecSub.item[nLine1].displayonpdf = true;
				objRecSub.hasatldiscount = false;
				objRecSub.hassrdiscount = false;
				objRecSub.item[nLine1].discountdetail = [];
				idLastItem = nLine1;
			}
			else if(objRecSub.item[nLine1].item_id  == NAVYDISCOUNT && objRecSub.item[nLine1].description == 'Loyalty Discount.'){
				
				objRecSub.haslinediscount = true;
				objRecSub.hasatldiscount = true;
				objRecSub.item[nLine1].displayonpdf = false;
				
				var objDiscount = {desctription: objRecSub.item[nLine1].description,
						amount : objRecSub.item[nLine1].amount};
				
				objRecSub.item[idLastItem].amount_id += objRecSub.item[nLine1].amount_id;
				objRecSub.item[idLastItem].amount = (objRecSub.item[idLastItem].amount_id).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"); 
				
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
						
						objRecSub.item[nLine1].amount_id *= 1 - nDicountRate;
						objRecSub.item[nLine1].amount = (objRecSub.item[nLine1].amount_id).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,"); 
						
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
		
		objRecSub.subtotal_id += Math.abs(objRecSub.srdiscount);
		objRecSub.subtotal = objRecSub.subtotal_id;
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
		else{
			objRecSub.federalidnumber = '';
			objRecSub.hastax = false;
		}
		
		objRecSub.primarycontact = '';
		objRecSub.billingaddress = objRecSub.billingaddress.replace(/&/g, '&amp;');
		
		var srch = search.create({type: record.Type.ESTIMATE});
		srch.columns = [new search.createColumn({ 	name: 'entityid',
													join: 'contactprimary'})];
		srch.filters = [new search.createFilter({ 	name: 'internalid', 
		                							operator: 'anyof', values: recPrint.id}),
		                new search.createFilter({ 	name: 'mainline', 
		                							operator: 'is', 
		                							values: true})];
		
		
		var srcResult = srch.run().getRange({start: 0, end: 1 });
		
		if(srcResult.length > 0){
			objRecSub.primarycontact = srcResult[0].getValue({ 	name: 'entityid',
																join: 'contactprimary'});
		}
		
		objRecSub.paymentinstruction = '';
		
		var srch = search.create({type: 'customrecord_paymentinstructions'});
		srch.columns = [new search.createColumn({ 	name: 'custrecord_payinst_instruction'})];
		srch.filters = [new search.createFilter({ 	name: 'custrecord_payinst_subsidiary', 
		                							operator: 'anyof', values: recPrint.getValue({fieldId: 'subsidiary'})}),
		                new search.createFilter({ 	name: 'custrecord_payinst_currency', 
		                							operator: 'anyof', 
		                							values: recPrint.getValue({fieldId: 'currency'})})];
		
		var srcResult = srch.run().getRange({start: 0, end: 1 });
		
		if(srcResult.length > 0){
			objRecSub.paymentinstruction = srcResult[0].getValue({name: 'custrecord_payinst_instruction'});
		}
		
    	var sHandlebar = handlebars.compile(sTemplate.getContents());
    	handlebars.registerHelper('if_even', 
    										function(conditional) {
    		
			  									if((conditional % 2) == 0) {
			  										return '#FFFFFF';
			  									} 
			  									else {
			  										return '#F0F0F0';
			  									}
			  								});

    	handlebars.registerHelper('replace', function( find, replace, options) {
    	    var string = options.fn(this);
    	    return string.replace( find, replace );
    	});
    	
    	handlebars.registerHelper('currency', function(value) {
    	    return value.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    	});

    	var sPdfTemplate = sHandlebar(objRecSub);

		return sPdfTemplate;
	}

    return {
    	generate: generate
    };
    
});
