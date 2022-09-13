define(['N/record', 'N/search', 'N/file', './lib/atlassiannavytest', './lib/digitalai'],

function(record, search, file, atlassiannavytest, digitalai) {
   
	function generate(recPrint) {
		
		var sTemplate = '';
		
		if(recPrint.getValue({fieldId: 'custbody_quote_type'}) == 4){
			sTemplate = digitalai.generate(recPrint);
		}
		else{
			sTemplate = atlassiannavytest.generate(recPrint);	
		}
		
		return sTemplate;
	}
	
    return {
    	generate: generate
    };
    
});
