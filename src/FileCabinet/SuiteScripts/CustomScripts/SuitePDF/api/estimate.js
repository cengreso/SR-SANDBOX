define(['N/record', 'N/search', 'N/file', './lib/atlassiannavy', './lib/digitalai', './lib/sow', './lib/workplacequote', './lib/miroquote'],

function(record, search, file, atlassiannavy, digitalai, sow, workplacequote, miroquote) {
   
	function generate(recPrint) {
		
		var sTemplate = '';
		
		
		if(recPrint.getValue({
				fieldId: 'custbody_quote_type'
			}) == 1 && recPrint.getValue({
				fieldId: 'custbody_sr_partner'
			}) ==  845326){
			
			sTemplate = workplacequote.generate(recPrint);
		}
		else if(recPrint.getValue({
				fieldId: 'custbody_quote_type'
			}) == 1 && recPrint.getValue({
				fieldId: 'custbody_sr_partner'
			}) ==  13435){
		
			sTemplate = miroquote.generate(recPrint);
		}
		else if(recPrint.getValue({fieldId: 'custbody_quote_type'}) == 2){
			sTemplate = sow.generate(recPrint);
		}
		else if(recPrint.getValue({fieldId: 'custbody_quote_type'}) == 4){
			sTemplate = digitalai.generate(recPrint);
		}
		else{
			sTemplate = atlassiannavy.generate(recPrint);	
		}
		
		return sTemplate;
	}
	
    return {
    	generate: generate
    };
    
});
