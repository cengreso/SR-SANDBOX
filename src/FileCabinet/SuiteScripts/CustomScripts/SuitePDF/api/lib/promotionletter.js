define(['N/file', 'N/query', 'N/render', 'N/runtime', '../../../Library/handlebars', '../../../SuiteBox/api/suitebox', './helper' ],

function(file, query, render, runtime, handlebars, suitebox, helper) {
	
	generate = function(option){
		
		var sTemplate = file.load(223193);//222775	
    	var sHandlebar = handlebars.compile(sTemplate.getContents());
    	var arrSql = (file.load(223092).getContents()).split('{{}}');	
    	
    	var objPromotion = (query.runSuiteQL(arrSql[0].replace('{{id}}', option.id)).asMappedResults())[0];
    	var objTemplate = (query.runSuiteQL(arrSql[1].replace('{{id}}', 5)).asMappedResults())[0];
    	handlebars = helper.registerHelpers(handlebars);
    	
    	handlebars.registerHelper('paragraph', function (value) {
		    var arrValue = value.split('\r\n');
		    return arrValue;
		});
  	
    	objPromotion.title = objTemplate.title;
    	objPromotion.seactionhead = objTemplate.seactionhead;
    	objPromotion.introduction = objTemplate.introduction;
    	objPromotion.footer = objTemplate.footer;
    	objPromotion.section = query.runSuiteQL(arrSql[2].replace('{{id}}', 5)).asMappedResults();
    	objPromotion.newsalary =  (objPromotion.newsalary).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");;
    	objPromotion.newstf = (objPromotion.newstf).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    	objPromotion.newtcc = (objPromotion.newtcc).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    	objPromotion.stockquantity = (objPromotion.stockquantity).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    	
    	var sPdfTemplate = sHandlebar(objPromotion);
    	var sHandlebar = handlebars.compile(sPdfTemplate);
    	var sPdfTemplate = sHandlebar(objPromotion);

    	var pdfLetter = render.xmlToPdf({
    	    xmlString: sPdfTemplate
    	});
    	
    	pdfLetter.name = objPromotion.promotionid+'_' + (objPromotion.name).replace(/ /g,'_')+'.pdf';
    	
		var objEmail = {};
		objEmail.author = runtime.getCurrentUser().id;
		objEmail.email = option.email;
		objEmail.subject = 'Promotion Letter Box Upload';
		objEmail.body = 'Promotion Letter Box Upload';
		objEmail.attachments = [pdfLetter];
				
    	suitebox.emailUpload(objEmail, 'customrecord_sr_rocketeer_promotion');
    	
		return {file: sPdfTemplate, name: pdfLetter.name};
	};
	
	
    return {
    	generate: generate
    };
    
});

