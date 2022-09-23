/**
 * @NApiVersion 2.0
 * @NModuleScope SameAccount
 */

define(['../Library/momentjs/moment'],

    function (moment) {
	
	/**Maps JSON(normally JSON object coming 3rd party) object using another JSON object to the NetSuite record
    * @param {data} data
	*/
	
	jsonMap = function (data) {

        var mapping = data.mapping; //Mapping
        var key = data.key; //Key to Map
        var record = data.record; //NetSuite record object
        var data = data.data; //Data to be mapped to NetSuite record

        if (mapping[key].hasOwnProperty('value')) {

            try {
            	
            	var value = eval('data.' + mapping[key].value);

                if(mapping[key].hasOwnProperty('default')){

                	if(value  === null || value  === "" || value  === undefined){
                		value = mapping[key].default;
                	}
                }
                else{
                    value = (value  === null || value  === "" || value  === undefined) == true ? '' : value  ;
                }

            	if(mapping[key].hasOwnProperty('mapping')){
            		
            		value = mapping[key].mapping[value];
            		
                	if(value == undefined){
                		value = mapping[key].mapping['default'];
                	}
            	}

                if(mapping[key].hasOwnProperty('split')){

                    var objSplit  = mapping[key].split
            		
            		var sDelimiter = objSplit.delimiter;
            		var	arrValue = value.split(sDelimiter);
            		var idx = [0];
            		
            		var sReturn = objSplit.index;
            		var arrRetrun = objSplit.index.split(',');
            		
            		
            		if(sReturn == 'last'){
            			idx = [arrValue.length -1];
            		}
            		else if (sReturn == 'first'){
            			idx = [0];
            		}
            		else if(arrReturn.lenght > 0){
            			idx = [arrRetrun];
            		}
            		else{
            			idx = mapping[key].index;
            		}
            		
            		value = '';
            		
                    idx.forEach(function (id) {
                        value += arrValue[id] + sDelimiter;
                    });

                    value = value.trim();
            		
            	}
                
                record.setValue({
                    fieldId: key,
                    value: value 
                });
            } 
            catch (err) {
                log.audit({
                    title: 'jsonMap',
                    details: 'err: id ' + err
                });
            }
        } 
        else if (mapping[key].hasOwnProperty('text')) {

            try {
            	
            	var text = eval('data.' + mapping[key].text) || '';
            	
            	if(mapping[key].hasOwnProperty('mapping')){
            		
            		text = mapping[key].mapping[text];
            		
                	if(text == undefined){
                		text = mapping[key].mapping['default'];
                	}
            	}
            	
                record.setText({
                    fieldId: key,
                    text: text || ''
                });
            } 
            catch (err) {
                log.audit({
                    title: 'jsonMap',
                    details: 'err: id ' + err
                });
            }

        }
        ///**Built for Lever
        else if (mapping[key].hasOwnProperty('arrayvalues')) {

            try {
            	
            	var arrData = data[mapping[key].arrayvalues];

        		var arrDataFiltered = arrData.filter(function(e) {
      			  return e[mapping[key].key] == mapping[key].keyvalue;
      			});
            	
        		if(arrData.length > 0){
        			record.setValue({
                        fieldId: key,
                        value:  arrDataFiltered[0][mapping[key].valuekey] || ''
                    });
        		}
            } 
            catch (err) {
                log.audit({
                    title: 'jsonMap',
                    details: 'err: id ' + err
                });
            }
        } 
        else if (mapping[key].hasOwnProperty('epoch')) {

            try {
            	
            	var eDate = parseInt(eval('data.' + mapping[key].epoch));
            	
                if (eDate != undefined) {

                	var nOffset = parseInt(mapping[key].offset);
                	
                	if(nOffset){
                		nOffset = nOffset * 1000;
                	}
                	else{
                		nOffset = 0;
                	}
                	
                	eDate = eDate + nOffset;
                	 
                	var dDate;
                	
                	if(eDate.length < 13){
                		dDate = new Date(eDate * 1000);	
                	}
                	else{
                		dDate = new Date(eDate);
                	}
                	
                    record.setValue({
                        fieldId: key,
                        value: dDate || ''
                    });
                }
            } 
            catch (err) {
                log.audit({
                    title: 'jsonMap',
                    details: 'err: id ' + err
                });
            }
        } 
        else if (mapping[key].hasOwnProperty('date')) {

            try {
            	            	
                var data = eval('data.' + mapping[key].date);
                var format = mapping[key].format;
                var sDate = data;
                
                if(format == undefined){
                	
                	 var momDate = moment(sDate)._d; 
                     
                     record.setValue({
                         fieldId: key,
                         value: momDate || ''
                     });
                }
                else{
              	
                	if(format == 'epoch'){
                		
	                	 var momDate = (moment(sDate).valueOf()).toString(); 
                	 
	                     record.setValue({
	                         fieldId: key,
	                         value: momDate || ''
	                     });
                	}
                }
            } 
            catch (err) {
                log.audit({
                    title: 'jsonMap.date',
                    details: 'err: id ' + err
                });
            }
        } 
        else if (mapping[key].hasOwnProperty('concat')) {

            try {
                var arrData = mapping[key].concat;
                var sData = '';
                arrData.forEach(function (value) {
                    try {
                        sData += eval('data.' + value) || '';
                    } catch (err) {
                        sData += value || '';
                    }
                });
                record.setValue({
                    fieldId: key,
                    value: (sData || '').trim()
                });
            } 
            catch (err) {
                log.audit({
                    title: 'jsonMap',
                    details: 'err: id ' + err
                });
            }
        } 
        else if(mapping[key].hasOwnProperty('emaildomain')){
        	
            try {
             	var sEmail = eval('data.' + mapping[key].emaildomain);
             	var sRegex = /\S+@\S+\.\S+/;
             	
             	if(sRegex.test(sEmail)){
             		
             		var sDomain = sEmail.split('@')[1];
             		
             		record.setValue({
                         fieldId: key,
                         value: sDomain || ''
                     });
             	}
                 
            } 
            catch (err) {
                log.audit({
                    title: 'jsonMap',
                    details: 'err: id ' + err
                });
            }
         }
         else if (mapping[key].hasOwnProperty('chargebeeamount')) {

             try {
             	var nAmount = eval('data.' + mapping[key].chargebeeamount);
             	
             	nAmount = nAmount/100;
             	
                 record.setValue({
                     fieldId: key,
                     value: nAmount
                 });
             } 
             catch (err) {
                 log.audit({
                     title: 'jsonMap',
                     details: 'err: id ' + err
                 });
             }
        }
        else if (mapping[key].hasOwnProperty('subrecord')) {

            try {
                var objJsonToNS = {};
                objJsonToNS.mapping = mapping[key].subrecord;
                objJsonToNS.record = record;
                objJsonToNS.data = data;
                
                
                if(mapping[key].find){
                	
                	
                	var nLine = record.findSublistLineWithValue({
                	    sublistId: key,
                	    fieldId: mapping[key].find.field,
                	    value: mapping[key].find.value
                	});
                	
                	if(nLine == -1){
                		
                		record.selectNewLine({
                            sublistId: key
                        });
                		
                		record.setCurrentSublistValue({
                			 sublistId: key,
                			 fieldId: mapping[key].find.field,
                			 value: mapping[key].find.value
                		});
                		
                	}
                	else{
                		
                		record.selectLine({
                            sublistId: key,
                            line: nLine
                        });	
                	}
                }
                else if (record.getLineCount({
                        sublistId: key
                    }) > 0 && mapping[key].addnew) {

                    record.selectNewLine({
                        sublistId: key
                    });

                } else if (record.getLineCount({
                        sublistId: key
                    }) > 0 && mapping[key].override) {

                    record.selectLine({
                        sublistId: key,
                        line: 0
                    });
                } else if (record.getLineCount({
                        sublistId: key
                    }) == 0 && mapping[key].override) {

                    record.selectNewLine({
                        sublistId: key
                    });
                }
                
                var subRecord = record.getCurrentSublistSubrecord({
                    sublistId: key,
                    fieldId: mapping[key].fieldid
                });
                
                for (var subKey in objJsonToNS.mapping) {

                    objJsonToNS.record = subRecord;
                    objJsonToNS.key = subKey;
                    subRecord = jsonMap(objJsonToNS);
                }
                subRecord.commit();
                record.commitLine({
                    sublistId: key,
                });
            } 
            catch (err) {
                log.audit({
                    title: 'jsonMap',
                    details: 'err: id ' + err
                });
            }
        }
        
        else if (mapping[key].hasOwnProperty('sublist')) {

            try {
            	
            	var objSublist = mapping[key].sublist;
            	var sblData = eval('data.' + mapping[key].sublist.arrdata);
            	var objColumns = objSublist.columns;
            	var objFind = objSublist.find;
            	var idSublist = key;
            	
            	
            	for ( var sbl in sblData) {
					
            		var objData = sblData[sbl];
            		
                	var nLine = record.findSublistLineWithValue({
                	    sublistId: idSublist,
                	    fieldId: objFind.field,
                	    value: eval('sblData[sbl].' + objFind.value)
                	});
                	
                	if(nLine == -1){
                		record.selectNewLine({sublistId: idSublist});	
                	}
                	else{
                		record.selectLine({sublistId: idSublist, line: nLine});	
                	}
            		
                    for (var key in objColumns) {
                    	
                    	if (objColumns[key].hasOwnProperty('text')) {
                    		
                    		record.setCurrentSublistText({
                        	    sublistId: idSublist,
                        	    fieldId: key,
                        	    text: eval('sblData[sbl].' + objColumns[key].text)
                        	});	
                    	}
                    	else if (objColumns[key].hasOwnProperty('value')) {
                    		
                    		record.setCurrentSublistValue({
                        	    sublistId: idSublist,
                        	    fieldId: key,
                        	    value: eval('sblData[sbl].' + objColumns[key].value)
                        	});	
                    	}
                        else if (objColumns[key].hasOwnProperty('chargebeeamount')) {

                            try {
                            	
                            	var nAmount = eval('sblData[sbl].' + objColumns[key].chargebeeamount);
                            	
                            	nAmount = nAmount/100;
                            	
                            	record.setCurrentSublistValue({
                            	    sublistId: idSublist,
                            	    fieldId: key,
                            	    value: nAmount
                            	});	
                            	
                            } 
                            catch (err) {
                                log.audit({
                                    title: 'jsonMap',
                                    details: 'err: id ' + err
                                });
                            }
                       }
                       else if (objColumns[key].hasOwnProperty('epoch')) {
                   		
                           try {
                        	   
                               if (eval('sblData[sbl].' + objColumns[key].epoch) != undefined) {

                                   var dDate = new Date(
                                		   eval('sblData[sbl].' + objColumns[key].epoch) * 1000);

		                           	record.setCurrentSublistValue({
		                        	    sublistId: idSublist,
		                        	    fieldId: key,
		                        	    value: dDate
		                        	});	
                               }
                           } 
                           catch (err) {
                               log.audit({
                                   title: 'jsonMap',
                                   details: 'err: id ' + err
                               });
                           }

                   		}
                    }
                    
                    record.commitLine({
                        sublistId: idSublist
                    });
            		
				}
            } 
            catch (err) {
                log.audit({
                    title: 'jsonMap',
                    details: 'err: id ' + err
                });
            }
        }
        else {
            try {
                record.setValue({
                    fieldId: key,
                    value: mapping[key]
                });
            } 
            catch (err) {
                log.audit({
                    title: 'jsonMap',
                    details: 'err: id ' + err
                });
            }
        }

        return record;
    };

	/**Get the value from a JSON object using the mapping object.
    * @param {data} data
	*/
	
    jsonGetValue = function (data) {

        var mapping = data.mapping; //Mapping
        var key = data.key; //Key that is required to get the value of. (NetSuite field)
        var data = data.data; //Data where the value will be extracted.

        if (mapping[key].hasOwnProperty('value')) {
        	
            try {
            	var retMe =  eval('data.' + mapping[key].value) || '';
            	
            	if(mapping[key].hasOwnProperty('mapping')){
            		
            		retMe = mapping[key].mapping[retMe];
            		
                	if(retMe == undefined){
                		retMe = mapping[key].mapping['default'];
                	}
            	}

            	return retMe;
            } 
            catch (err){
               return '';
            }
        } 
        else if (mapping[key].hasOwnProperty('text')) {
        	
        	
        	try {
        		return eval('data.' + mapping[key].text) || '';
        	} 
        	catch (err){
              return '';
        	}
        }
        ///**Built for Lever Offer
        else if (mapping[key].hasOwnProperty('arrayvalues')) {

            try {
            	
            	var arrData = data[mapping[key].arrayvalues];

        		var arrDataFiltered = arrData.filter(function(e) {
      			  return e[mapping[key].key] == mapping[key].keyvalue;
      			});
            	
        		if(arrData.length > 0){
        			return arrDataFiltered[0][mapping[key].valuekey];
        		}
            } 
            catch (err) {
                log.audit({
                    title: 'jsonMap',
                    details: 'err: id ' + err
                });
            }
        }
        else if (mapping[key].hasOwnProperty('epoch')) {
        	
        	if (eval('data.' + mapping[key].epoch) != undefined) {
                return new Date(eval('data.' + mapping[key].epoch) * 1000) || '';
            } 
        	else {
                return '';
            }
        } 
        else if (mapping[key].hasOwnProperty('date')) {

            var dData = eval('data.' + mapping[key].date);

            if (data.indexOf('.') == -1) {
                data = data.replace('Z', '.000Z');
            }

            var dDate = format.parse({
                value: new Date(data),
                type: format.Type.DATE
            });
            return dDate || '';
        } 
        else if (mapping[key].hasOwnProperty('concat')) {

            var arrData = mapping[key].concat;
            var sData = '';

            arrData.forEach(
                function (value) {

                try {
                    sData += eval('data.' + value) || '';
                } catch (err) {
                    sData += (value || '');
                }
            });
            return (sData || '').trim();
        }
        else{
        	
            try {
            	 return  mapping[key] || '';
            } 
            catch (err){
               return '';
            }
        } 
    };

    return {
        jsonMap: jsonMap,
        jsonGetValue: jsonGetValue
    };

});
