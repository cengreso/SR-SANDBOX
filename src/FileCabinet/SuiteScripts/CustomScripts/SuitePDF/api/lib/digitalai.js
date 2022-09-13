define(['N/record', 'N/search', 'N/file', '../../../Library/handlebars', '../../../Helper/nstojson'],

function(record, search, file, handlebars, nstojson) {
   
	
	function generate(recPrint) {
		
		var recSub = record.load({	type: record.Type.SUBSIDIARY, 
								id: recPrint.getValue({fieldId: 'subsidiary'})});
		var sTemplate = file.load(143426);	
	
		var objRecPrint = nstojson.get(recPrint);
		var objRecSub = nstojson.get(recSub);
		var objPercentDicount = {};
		
		for (var attrname in objRecPrint ) { 
			objRecSub [attrname] = objRecPrint[attrname]; 
		}

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
		
		
		if( recPrint.getValue({fieldId: 'currencysymbol'}) == "NZD" ){
			//objRecSub.paymentinstruction = recSub.getValue({fieldId: 'custrecord_sr_payment_inst_nzd'});
			objRecSub.currencysign = '&#36;';
		}
		else if( recPrint.getValue({fieldId: 'currencysymbol'}) == "MYR" ){
			//objRecSub.paymentinstruction = recSub.getValue({fieldId: 'custrecord_sr_payment_inst_myr'});
			objRecSub.currencysign = 'RM';
		}
		else if( recPrint.getValue({fieldId: 'currencysymbol'}) == "GBP" ){
			//objRecSub.paymentinstruction = recSub.getValue({fieldId: 'custrecord_sr_payment_inst_gbp'});
			objRecSub.currencysign = '&#163;';
		}
		else if( recPrint.getValue({fieldId: 'currencysymbol'}) == "AUD" ){
			//objRecSub.paymentinstruction = recSub.getValue({fieldId: 'custrecord_sr_payment_inst_aud'});
			objRecSub.currencysign = '&#36;';
		}
		else{
			//objRecSub.paymentinstruction = recSub.getValue({fieldId: 'custrecord_sr_payment_inst_usd'});
			objRecSub.currencysign = '&#36;';
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

    	var sPdfTemplate = sHandlebar(objRecSub);

		return sPdfTemplate;
	}

    return {
    	generate: generate
    };
    
});
