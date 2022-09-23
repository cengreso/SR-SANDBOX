define([],

function() {
	
	NStoJSON = function(objRecord){
		
		var objJSON = {};
		
		var aFields = objRecord.getFields();
		
		for (field in aFields.sort()){
			
			if(objRecord.getField({fieldId: aFields[field]})){
				
				if(objRecord.getText({fieldId: aFields[field]}) != null && 
						objRecord.getField({fieldId: aFields[field]}).type != 'checkbox'){
					objJSON[aFields[field]] = objRecord.getText({fieldId: aFields[field]});
					objJSON[aFields[field] + '_id'] = objRecord.getValue({fieldId: aFields[field]});
				}
				else if(objRecord.getValue({fieldId: aFields[field]}) != null){
					objJSON[aFields[field]] = objRecord.getValue({fieldId: aFields[field]});
				}
				else{
					objJSON[aFields[field]] = '';
				}
			}
		}
		

		try{
			if(objRecord.getField({fieldId: 'shippingaddress'}).type == 'summary'){
				
				var objSubRecord = objRecord.getSubrecord({fieldId: 'shippingaddress'});
				var aSubfields = objSubRecord.getFields();
				
				var objSubJSON = {};
				
				
				for (subfield in aSubfields.sort()){
					
					if(objSubRecord.getText({fieldId: aSubfields[subfield]}) != null){
						objSubJSON[aSubfields[subfield]] = objSubRecord.getText({fieldId: aSubfields[subfield]});
					}
					else if(objSubRecord.getValue({fieldId: aFields[field]}) != null){
						objSubJSON[aSubfields[subfield]] = objSubRecord.getValue({fieldId: aSubfields[subfield]});
					}
					else{
						objSubJSON[aSubfields[subfield]] = '';
					}
				}
				
				//objSubJSON.state = stateCode(objSubJSON.state);
				var sBillAddress = objSubRecord.getValue({fieldId:'addrtext'}).replace(/\n/g, "<br />");
				objJSON['shippingaddress'] =sBillAddress;
			}
		}
		catch(err){
			
		}
		
		try{
			if(objRecord.getField({fieldId: 'billingaddress'}).type == 'summary'){
				
				var objSubRecord = objRecord.getSubrecord({fieldId: 'billingaddress'});
				var aSubfields = objSubRecord.getFields();
				
				var objSubJSON = {};
				
				for (subfield in aSubfields.sort()){
					
					if(objSubRecord.getText({fieldId: aSubfields[subfield]}) != null){
						objSubJSON[aSubfields[subfield]] = objSubRecord.getText({fieldId: aSubfields[subfield]});
					}
					else if(objSubRecord.getValue({fieldId: aFields[field]}) != null){
						objSubJSON[aSubfields[subfield]] = objSubRecord.getValue({fieldId: aSubfields[subfield]});
					}
					else{
						objSubJSON[aSubfields[subfield]] = '';
					}
				}
				
				//objSubJSON.state = stateCode(objSubJSON.state);
				var sBillAddress = objSubRecord.getValue({fieldId:'addrtext'}).replace(/\n/g, "<br />");
				objJSON['billingaddress'] = sBillAddress;
			}
		}
		catch(err){
			
		}

		var aSublists = objRecord.getSublists();
		
		for (sublist in aSublists.sort()){

			objJSON[aSublists[sublist]] = [];
			
			for (var nSblLine = 0; nSblLine < objRecord.getLineCount({sublistId: aSublists[sublist]}); nSblLine++) {
				
				var objLine = {};
				
				var aColumns = objRecord.getSublistFields({sublistId: aSublists[sublist]})
				
				for (column in aColumns.sort()){
									
					if(objRecord.getSublistText({sublistId: aSublists[sublist], fieldId: aColumns[column], line : nSblLine}) != null){
						objLine[aColumns[column]] = objRecord.getSublistText({sublistId: aSublists[sublist], fieldId: aColumns[column], line : nSblLine});
						objLine[aColumns[column] + '_id'] = objRecord.getSublistValue({sublistId: aSublists[sublist], fieldId: aColumns[column], line : nSblLine});
					}
					else if(objRecord.getSublistValue({sublistId: aSublists[sublist], fieldId: aColumns[column], line : nSblLine}) != null){
						objLine[aColumns[column]] = objRecord.getSublistValue({sublistId: aSublists[sublist], fieldId: aColumns[column], line : nSblLine});
					}
					else{
						objLine[aColumns[column]] = '';
					}
				}
				
				objJSON[aSublists[sublist]].push(objLine);
			}
		}
		return objJSON; 

	};
	
    return {
        get : NStoJSON
    };
    
});
