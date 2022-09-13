define(['N/file', 'N/query', 'N/render', 'N/runtime', '../../../Library/handlebars', '../../../SuiteBox/api/suitebox', './helper' ],

function(file, query, render, runtime, handlebars, suitebox, helper) {
	
	generate = function(option){
		
		//var sTemplate = file.load({id: '../../template/adjustmentletter_v1_0.html'});	
		var sTemplate = file.load({id: 227524});
    	var sHandlebar = handlebars.compile(sTemplate.getContents());
    	//var arrSql = (file.load('./sql/adjustmentletter.sql').getContents()).split('{{}}');
    	var arrSql = (file.load({id:227521}).getContents()).split('{{}}');	
    	
    	var objAdjustment = (query.runSuiteQL(arrSql[0].replace('{{id}}', option.id)).asMappedResults())[0];
    	var objTemplate = (query.runSuiteQL(arrSql[1].replace('{{id}}', 4)).asMappedResults())[0];
    	handlebars = helper.registerHelpers(handlebars);
    	
    	handlebars.registerHelper('paragraph', function (value) {
		    var arrValue = value.split('\r\n');
		    return arrValue;
		});
  	
    	objAdjustment.title = objTemplate.title;
    	objAdjustment.seactionhead = objTemplate.seactionhead;
    	objAdjustment.introduction = objTemplate.introduction;
    	objAdjustment.footer = objTemplate.footer;
    	objAdjustment.section = query.runSuiteQL(arrSql[2].replace('{{id}}', 4)).asMappedResults();
    	objAdjustment.newsalary =  (objAdjustment.newsalary).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");;
    	objAdjustment.newstf = (objAdjustment.newstf).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    	objAdjustment.newtcc = (objAdjustment.newtcc).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    	    	
    	var sPdfTemplate = sHandlebar(objAdjustment);
    	var sHandlebar = handlebars.compile(sPdfTemplate);
    	var sPdfTemplate = sHandlebar(objAdjustment);

    	var pdfLetter = render.xmlToPdf({
    	    xmlString: sPdfTemplate
    	});
    	
    	pdfLetter.name = objAdjustment.adjustmentid+'_' + (objAdjustment.name).replace(/ /g,'_')+'.pdf';
    	
		var objEmail = {};
		objEmail.author = runtime.getCurrentUser().id;
		objEmail.email = option.email;
		objEmail.subject = 'Salary Adjustment Letter Box Upload';
		objEmail.body = 'Salary Adjustment Letter Box Upload';
		objEmail.attachments = [pdfLetter];
				
    	//suitebox.emailUpload(objEmail, 'customrecord_sr_rocketeer_promotion');
    	
		return {file: sPdfTemplate, name: pdfLetter.name};
	};
	
	
    return {
    	generate: generate
    };
    
});

