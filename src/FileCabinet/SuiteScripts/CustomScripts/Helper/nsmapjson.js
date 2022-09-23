define([],

function() {
	
	nsMap = /**
	 * @param data
	 * @returns data.data
	 */
		
	function(data){
		
        var mapping = data.mapping; //Mapping
        var key = data.key; //Key to Map
        var record = data.record; //NetSuite record object
        var data = data.data; //Object that will be returned
        
		if(mapping[key].hasOwnProperty('integer')){
			
			value = record.getValue({
                fieldId: mapping[key].integer
            }) || 0.00;

			data = updateData(data, key, value);
            return data;
		}
		else if(mapping[key].hasOwnProperty('value')){
			
        	var value = record.getValue({
                fieldId: mapping[key].value
            }) || '';
        	
//       		var sValue = getValue({
//       			record: record,
//       			field: mapping[key].value
//       		});
        	
        	if(mapping[key].hasOwnProperty('mapping')){
        		
            	try{
            		var sValue = getMapValue({
            			mapping: mapping[key].mapping,
            			value: value
            		});
            	}
            	catch(err){
            		
                    log.audit({
                        title: 'nsmapjson',
                        details: 'mapValue err: ' + err
                    });
            	}
        		
        		
        		value = mapping[key].mapping[value];
        		
            	if(value == undefined){
            		value = mapping[key].mapping['default'];
            	}
        	}
        	
			data = updateData(data, key, value);
            return data;
		}
		else if(mapping[key].hasOwnProperty('text')){

        	var value = record.getText({
                fieldId: mapping[key].text
            }) || '';
        	
        	if(mapping[key].hasOwnProperty('mapping')){
        		
        		value = mapping[key].mapping[value];
        		
            	if(value == undefined){
            		value = mapping[key].mapping['default'];
            	}
        	}

			data = updateData(data, key, value);
            return data;
		}
		else if(mapping[key].hasOwnProperty('boolean')){
			
        	var value = record.getValue({
                fieldId: mapping[key].boolean
            }) || '';
        	
        	if(value == '' || !value){
        		value = false;
        	}
        	else{
        		value = true;
        	}
			data = updateData(data, key, value);
            return data;
		}
		else if(mapping[key].hasOwnProperty('epoch')){
			
            var value = '';

            if (record.getValue({
                    fieldId: mapping[key].epoch
                })) {
                var dDate = record.getValue({
                    fieldId: mapping[key].epoch
                });
                value = dDate.getTime().toString();
            } 

            if(value == '' || value == undefined){
            	
                if(mapping[key].hasOwnProperty('ifnull')){
                	
                	var ifNull = {
                		    nullvalue: mapping[key].ifnull
                		};
                	value = nsMap({
    	                    mapping: ifNull,
    	                    record: record,
    	                    data: {},
    	                    key: 'nullvalue'
    	                }).nullvalue;
                }
            }
            
            data = updateData(data, key, value);
            return data;
		}
		else if(mapping[key].hasOwnProperty('split')){
			
			var objSplit = mapping[key].split;
			var sSplitMe = '';
			var sValue = '';
			
			if (objSplit.hasOwnProperty('value')) {
			    sSplitMe += record.getValue({
			        fieldId: objSplit.value
			    });
			} 
			else if (objSplit.hasOwnProperty('text')) {
			    sSplitMe += record.getText({
			        fieldId: objSplit.text
			    });
			}
			
			var arrSplit = sSplitMe.split(objSplit.delimiter);
			
			objSplit['return'].forEach(function(ret) {
				
					if(typeof ret == 'number'){
						sValue += arrSplit[ret];
					}
					else if(typeof ret == 'string'){
						
						sValue += ret;
					}
					else if(ret instanceof Array){
						
						var arrSub = ret;
						
						if(arrSub.length > 0 && arrSub.length <= 2){
							
							if(arrSub.length == 1 && arrSub[0] >= 0){
								for (var idx = arrSub[0]; idx < arrSplit.length; idx++) {
									sValue += arrSplit[idx] + objSplit.delimiter;
								}
							}
							else if(arrSub.length == 1 && arrSub[0] < 0){
							
								var nStart = arrSplit.length + arrSub[0];
								
								for (var idx = nStart; idx < arrSplit.length; idx++) {
									sValue += arrSplit[idx] + objSplit.delimiter;
								}
							}
							else if(arrSub.length > 0){
								
								for (var idx =  arrSub[0] ; idx <= arrSub[1]; idx++) {
									sValue += arrSplit[idx] + objSplit.delimiter;
								}
							}
						}
					}
				}
			);
			
			data = updateData(data, key, sValue);
			return data;
		}
		else if(mapping[key].hasOwnProperty('slice')){
			
			var objSlice = mapping[key].slice;
			var sSplitMe = '';
			var sValue = '';
			
			if (objSlice.hasOwnProperty('value')) {
			    sSplitMe += record.getValue({
			        fieldId: objSlice.value
			    });
			} 
			else if (objSlice.hasOwnProperty('text')) {
			    sSplitMe += record.getText({
			        fieldId: objSlice.text
			    });
			}
			
			var arrSlice = sSplitMe.split(objSlice.delimiter);
			
			
			arrSlice.forEach(function(slice) {
				
				if(objSlice.slice.indexOf(arrSlice.indexOf(slice)) == -1){
					
					if(typeof slice == 'number'){
						sValue += arrSlice[slice] + objSlice.delimiter;
					}
					else if(typeof slice == 'string'){
						
						sValue += slice + objSlice.delimiter;
					}
				}
			});
			
			data = updateData(data, key, sValue.trim());
			return data;
		}
		else if(mapping[key].hasOwnProperty('concat')){
			
        	var arrFields = mapping[key].concat;
        	var value = '';
        	
            arrFields.forEach(function (field) {
            	
            	if (field.hasOwnProperty('value')) {

            		value += record.getValue({
                        fieldId: field.value
                    });
                } 
            	else if (field.hasOwnProperty('text')) {

            		value += record.getText({
                        fieldId: field.text
                    });
                }
            	else{
            		value += field;
            	}
            });
			
            if(mapping[key].hasOwnProperty('mapping')){
        		
        		value = mapping[key].mapping[value];
        		
            	if(value == undefined){
            		value = mapping[key].mapping['default'];
            	}
        	}
            
			data = updateData(data, key, value);
			
			return data;
		}
		else if(mapping[key].hasOwnProperty('arrayvalue')) {
			var value = []
			var lineCount = record.getLineCount({
				sublistId: mapping[key].arrayvalue.sublistid
			})
			
			for(var line=0; line<lineCount; line++) {
				value.push(
					mapping[key].arrayvalue.field == 'value'? 
					record.getSublistValue({
						sublistId: mapping[key].arrayvalue.sublistid,
						fieldId: mapping[key].arrayvalue.field.value,
						line: line
					}): record.getSublistText({
						sublistId: mapping[key].arrayvalue.sublistid,
						fieldId: mapping[key].arrayvalue.field.text,
						line: line
					})
				)
			}

			data = updateData(data, key, value);

			return data;
		}
        else {
        	
        	var value = mapping[key];
			data = updateData(data, key, value);
			
            return data;
        }
	};
	
	generate = /**
	 * @param data
	 * @returns objPayload
	 */
		
	function(option) {
		
		var objPayload = {};
		
        for (var key in option.mapping) {

        	objPayload = nsMap({
                mapping: option.mapping,
                record: option.record,
                data: objPayload,
                key: key
            });
        }
        
        return objPayload;
	};
	
	updateData = /**
	 * @param object
	 * @param property
	 * @param value
	 * @returns object
	 */
		
	function (object, property, value) {

        var path =  property.split(".");
        var val = value; 

        for (var i = 0, tmp = object; i < path.length - 1; i++) {
			
			if(!tmp.hasOwnProperty(path[i])){
				tmp = tmp[path[i]] = {};		
			}
			else{
				tmp = tmp[path[i]]
			}
        }
        
       	tmp[path[i]] = val;

        return object;
    };
    
	getValue = function(option){
		
    	var value = option.record.getValue(option.field) || '';
    	
		return value;
	};
	
	getText = function(option){
		
    	var value = option.record.getText(option.field) || '';
    	
		return value;
	};
	
	getInteger = function(option){
		
		var value = option.record.getValue(option.field) || 0.00;

		return value;
	};
	
	getBoolean = function(option){

		var value = option.record.getValue(option.field) || '';
    	
    	if(value == '' || !value){
    		value = false;
    	}
    	else{
    		value = true;
    	}
		
		return value;
	};
	
	getEpoch = function (option){
		
        var value = option.record.getValue(option.field);
        
        if (value) {
            value = dDate.getTime().toString();
        } 

        return value;
	};

	getMapValue = function(option) {
		
   		value = option.mapping[option.value];
    
    	if(value == undefined){
    		value = option.mapping['default'];
    		
        	if(value == undefined){
        		value = '';
        	}
    	}
    	
    	return value;
	};
    
	getSplitValue = function(option){
		
		var objSplit = mapping[key].split;
		var sSplitMe = option.value;
		var sValue = '';
		
		var arrSplit = sSplitMe.split(objSplit.delimiter);
		
		objSplit['return'].forEach(function(ret) {
			
				if(typeof ret == 'number'){
					sValue += arrSplit[ret];
				}
				else if(typeof ret == 'string'){
					
					sValue += ret;
				}
				else if(ret instanceof Array){
					
					var arrSub = ret;
					
					if(arrSub.length > 0 && arrSub.length <= 2){
						
						if(arrSub.length == 1 && arrSub[0] >= 0){
							for (var idx = arrSub[0]; idx < arrSplit.length; idx++) {
								sValue += arrSplit[idx] + objSplit.delimiter;
							}
						}
						else if(arrSub.length == 1 && arrSub[0] < 0){
						
							var nStart = arrSplit.length + arrSub[0];
							
							for (var idx = nStart; idx < arrSplit.length; idx++) {
								sValue += arrSplit[idx] + objSplit.delimiter;
							}
						}
						else if(arrSub.length > 0){
							
							for (var idx =  arrSub[0] ; idx <= arrSub[1]; idx++) {
								sValue += arrSplit[idx] + objSplit.delimiter;
							}
						}
					}
				}
			}
		);
		
		data = updateData(data, key, sValue);
		return data;
		
	};
	
	
    return {
    	nsMap: nsMap,
    	generate: generate
    };
    
});
