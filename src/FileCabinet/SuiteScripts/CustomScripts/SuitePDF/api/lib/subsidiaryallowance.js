define(['N/file', 'N/query', 'N/render', 'N/runtime', '../../../Library/handlebars/handlebars', '../../../Library/handlebars/handlebarshelper', '../../../SuiteBox/api/suitebox', '../../../Library/momentjs/moment' ],

function(file, query, render, runtime, handlebars, handlebarshelper, suitebox, moment) {
   
	generate = function(option){
		
		var arrRawData =query.runSuiteQL({
			query: file.load({
				id: 238993//'./sql/subsidiaryallowance.sql'
			}).getContents()
		}).asMappedResults();
		
		
		
		arrRawData.forEach(function (data, idx, arrRawData) {
        	
			if( (data.currency_symbol.replace(/[a-zA-Z]/g,'')) == ''){
				
				if(data.currency_symbol == 'CLP'){
					arrRawData[idx].currency_symbol = '$';
				}
				else{
					arrRawData[idx].currency_symbol = data.currency_symbol
				}
				
			}
			else{
				
				if(data.currency_symbol == '₹'){
					arrRawData[idx].currency_symbol = 'INR';
				}
				else{
					arrRawData[idx].currency_symbol = data.currency_symbol.replace(/[a-zA-Z]/g,'');	
				}
			}
        });
		
   		var sTemplate = file.load({id: 238790}).getContents();

       	var sHandlebar = handlebars.compile(sTemplate);
       		
    	handlebars = handlebarshelper.register(handlebars);

    	var sPdfTemplate = sHandlebar(arrRawData);

    	var pdfLetter = render.xmlToPdf({
    	    xmlString: sPdfTemplate
    	});
    	
		return {file: sPdfTemplate, name: pdfLetter.name};
	};
	
    return {
        generate: generate
    };
    
});
