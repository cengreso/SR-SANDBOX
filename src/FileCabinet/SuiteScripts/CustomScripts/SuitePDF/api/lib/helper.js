define(['N/search', 'N/record'],

function(search, record) {
   
	getPaymentInstruction = function (option){
		
        var srch = search.create({
            type: 'customrecord_paymentinstructions'
        });
        
        srch.columns = [new search.createColumn({
            name: 'internalid',
            sort: search.Sort.ASC
        })];
        
        srch.columns = [new search.createColumn({
                name: 'custrecord_payinst_instruction'
            })];
        
        srch.filters = [new search.createFilter({
                name: 'custrecord_payinst_subsidiary',
                operator: 'anyof',
                values: option.record.getValue('subsidiary')
            }),
            new search.createFilter({
                name: 'custrecord_payinst_currency',
                operator: 'anyof',
                values: option.record.getValue('currency')
            })];

        var srcResult = srch.run().getRange({
            start: 0,
            end: 1
        });

        if(option.record.getValue('custbody_is_australian_usd')){
        	
        	var rec = record.load({ 
        		type: 'customrecord_paymentinstructions',
        		id: 11 
        	});
        	
        	return rec.getValue('custrecord_payinst_instruction');
        }
        else if (srcResult.length > 0) {
            return srcResult[0].getValue('custrecord_payinst_instruction');
        }
        else{
        	return 'No Payment Instruction. Please contact your Administrator.';
        }
		
	};
	
	getPrimaryContact = function(option) {
		
        var srch = search.create({
            type: option.record.type
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
            return srcResult[0].getValue({
                name: 'entityid',
                join: 'contactprimary'
            });
        }
        else{
        	return '';
        }
	};
	
	registerHelpers = function(option){
		
		option.registerHelper('if_even',
			    function (conditional) {

			    if ((conditional % 2) == 0) {
			        return '#FFFFFF';
			    } else {
			        return '#F0F0F0';
			    }
			});

		option.registerHelper('nohierarchy', function (value) {
		    var arrValue = value.split(':');
		    return arrValue[arrValue.length - 1];
		});

		option.registerHelper('replace', function (find, replace, options) {
		    var string = options.fn(this);
		    return string.replace(find, replace);
		});

		option.registerHelper('currency', function (value) {
		    return value.toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
		});

		option.registerHelper('paragraph', function (value) {
    		
    		if(value){
    			var arrValue = value.split('\r\n');
    		    return arrValue;	
    		}
    		else{
    			return[''];	
    		}
    	});

        option.registerHelper('ifEquals', function(a, b, options) {
            if (a === b) {
                return options.fn(this);
            }

            return options.inverse(this);
        });

		return option;
	};
	
    return {
    	getPaymentInstruction: getPaymentInstruction,
    	getPrimaryContact: getPrimaryContact,
    	registerHelpers: registerHelpers
    };
    
});
