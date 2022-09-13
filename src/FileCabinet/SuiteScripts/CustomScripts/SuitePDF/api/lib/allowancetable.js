define(['N/file', '../../../SuiteTable/api/suitetable', '../../../Library/handlebars/handlebars', '../../../Library/momentjs/moment'],

function(file, suitetable, handlebars, moment) {
   
	generate = function(option){
		
		var objList = suitetable.getData({
			sqlfile: 'SuiteScripts/CustomScripts/SuitePDF/api/lib/sql/allowancetable.sql'
		});
		
		objList.generated = moment().format('DD-MMM-YYYY');
		
		var sTemplate = file.load('SuiteScripts/CustomScripts/SuitePDF/template/allowancetable.html');
		var sHandlebar = handlebars.compile(sTemplate.getContents());
		var sPdfTemplate = sHandlebar(objList);
		
		return sPdfTemplate;
		
	};
	
    return {
    	generate: generate
    };
    
});
