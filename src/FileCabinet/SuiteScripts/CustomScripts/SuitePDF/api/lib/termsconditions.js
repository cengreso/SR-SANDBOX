define(['N/file', 'N/query', 'N/render', 'N/runtime', '../../../Library/handlebars/handlebars', '../../../Library/handlebars/handlebarshelper', '../../../SuiteBox/api/suitebox', '../../../Library/momentjs/moment' ],

function(file, query, render, runtime, handlebars, handlebarshelper, suitebox, moment) {
   
	generate = function(option){
		

		
    	//var sqlData = file.load({id: './sql/termsconditiondata.sql'}).getContents();
    	var sqlData = file.load({id: 228493}).getContents();
    	//var sqlHeader = file.load({id: './sql/letterheader.sql'}).getContents();	
    	var sqlHeader = file.load({id: 228489}).getContents();
    	//var sqlSection = file.load({id: './sql/lettersection.sql'}).getContents();
    	var sqlSection = file.load({id: 228491}).getContents();

    	
    	
    	
    	var objData = (query.runSuiteQL({query: sqlData, params: [option.id]}).asMappedResults())[0];
    	
       	var objTemplate = (query.runSuiteQL({query: sqlHeader, params: [1]}).asMappedResults())[0];
       		objTemplate.section = query.runSuiteQL({query: sqlSection, params: [1, objData.subsidiaryid]}).asMappedResults();
       		objTemplate.date = moment().format('DD-MMM-YYYY');
       		objTemplate.dategenerated = moment().format('DD-MMM-YYYY hh:mm');
       		objTemplate.user = runtime.getCurrentUser().id;
       		objTemplate.employeeid = option.id;
  		
   		var sTemplate = file.load({
   							id: 'SuiteScripts/CustomScripts/SuitePDF/template/termsandconditions_v1_0.html'
   						}).getContents();

       	var sHandlebar = handlebars.compile(sTemplate);
       		
    	handlebars = handlebarshelper.register(handlebars);
    	
    	var sPdfTemplate = sHandlebar(objTemplate);
    	var sHandlebar = handlebars.compile(sPdfTemplate);
    	var sPdfTemplate = sHandlebar(objData);
    	

    	var pdfLetter = render.xmlToPdf({
    	    xmlString: sPdfTemplate
    	});
    	
    	pdfLetter.name = 'Test.pdf';
    	
		var objEmail = {};
		objEmail.author = runtime.getCurrentUser().id;
		objEmail.email = option.email;
		objEmail.subject = 'Terms & Conditions Box Upload';
		objEmail.body = 'Terms & Conditions Box Upload';
		objEmail.attachments = [pdfLetter];
				
    	//suitebox.emailUpload(objEmail, 'customrecord_sr_rocketeer_promotion');
    	
		return {file: sPdfTemplate, name: pdfLetter.name};
	};
	
    return {
        generate: generate
    };
    
});
