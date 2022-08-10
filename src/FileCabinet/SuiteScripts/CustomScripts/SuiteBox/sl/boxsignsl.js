/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */

define(['N/file', 'N/record', 'N/render', 'N/ui/serverWidget', 'SuiteScripts/CustomScripts/SuitePDF/api/estimate', 'SuiteScripts/CustomScripts/SuiteBox/api/suitebox', '../../Library/handlebars', '../../Library/handlebars/handlebarshelper'],
    /**
     * @param {file} file
     * @param {record} record
     * @param {render} render
     */
    function (file, record, render, serverWidget, estimate, suitebox, handlebars, handlebarshelper) {

    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {

        var paramReq = context.request.parameters;
        var idRec = paramReq.recid;
        var sType = paramReq.rectype;
        var sAction = paramReq.action;
        var sPdfTemplate = '';
		var sTemplate = file.load({
			id: 'SuiteScripts/CustomScripts/SuiteBox/template/pdfobject.html'
		}).getContents();
		
		var retMe = {
			status: '',
			response: ''
		};
		
        var idFolder = '156766524816';
        var idSignedFolder = '156767063747';
        var sEmail = '';
        
    	if (sAction == 'upload') {

	        var pdfFile = render.xmlToPdf({
	            xmlString: 'Test Box Sign'
	        });
	
	        pdfFile.name = 'TestBoxSign2.pdf';
	
	        var stbxFolder = suitebox.updateFolder({
	            data: {
	                'folder_upload_email': {
	                    'access': 'open'
	                },
	                id: idFolder
	            }
	        });

	        if (stbxFolder.status == 'SUCCESS') {
	
	            sEmail = stbxFolder.response.data.folder_upload_email.email;
	            
	            log.audit({
	            	title: 'sEmail', 
	            	details: 'sEmail: ' + sEmail
	            }); 
	
	        } 
	        else if (stbxFolder.status == 'FAILED') {
	        	
	        	log.audit({
	            	title: 'stbxFolder', 
	            	details: 'FAILED'
	            }); 
	        }
	
	        var stbxUpload = suitebox.emailUpload2({
	            data: {
	                author: 171596,
	                email: sEmail,
	                subject: 'subject',
	                body: 'body',
	                attachments: [pdfFile]
	            }
	        });
	
	        if (stbxUpload.status == 'SUCCESS') {

	        	retMe.status = 'SUCCESS';
	        	retMe.response = {
	        			message: 'Uploading in Progress.'
	        	};
	        }
	        else{
	        	retMe.status = 'FAILED';
	        	retMe.response = {
	        			message : stbxUpload.response.message
	        	};
	        }
	        
    		context.response.setHeader({
          		name: 'Content-Type',
          		value: 'application/json'
        	});
			
			context.response.write(JSON.stringify(retMe));
    	}
    	else if (sAction == 'checkfile') {
    		
	        var stbxItems = suitebox.folderItems({
	            data: {
	                'folder': idFolder,
	                'name': 'TestBoxSign2.pdf'
	            }
	        });
	
	        if (stbxItems.status == 'SUCCESS') {
	        	
	        	var objFile  = stbxItems.response.data.filter(
	        			function(file){
	        				return file.name == 'TestBoxSign2.pdf';
	        			}
	        		);        	
	        	
	        	if(objFile.length > 0){
	        		
	        		retMe.status = 'SUCCESS';
		        	retMe.response = {
		        		id : objFile[0].id
		        	}
	        	}
	        	else{
	        		
		        	retMe.status = 'SUCCESS';
		        	retMe.response = {
		        			message: 'Uploading in Progress.'
		        	};
	        	}
	        	
	        }
	        else{
	        	retMe.status = 'FAILED';
	        	retMe.response = { 
	        			message : stbxItems.response.message
	        	}
	        }
	        
    		context.response.setHeader({
          		name: 'Content-Type',
          		value: 'application/json'
        	});
			
			context.response.write(JSON.stringify(retMe));
    	}
    	else if (sAction == 'sign') {

            var stbxSign = suitebox.requestSign({

                data: {
                    'signers': [{
                            'role': 'signer',
                            'email': 'patrick.alcomendas@servicerocket.com'
                        }
                    ],
                    'source_files': [{
                            'type': 'file',
                            'id': stbxItems.response.data[0].id
                        }
                    ],
                    'parent_folder': {
                        'type': 'folder',
                        'id': idSignedFolder
                    }
                }
            });

	        if (stbxSign.status == 'SUCCESS') {
	        	
	        	retMe.status = 'SUCCESS';
	        	retMe.response.message = 'Sign Request Created.';
	        }
	        else{
	        	retMe.status = 'FAILED';
	        	retMe.response.message = stbxSign.response.message;
	        }
	        
    		context.response.setHeader({
          		name: 'Content-Type',
          		value: 'application/json'
        	});
			
			context.response.write(JSON.stringify(retMe));
	
	        var x = 1;
    		
    		
    	}
    	else{
    		
			var objForm = serverWidget.createForm({
				title: 'BoxSign 1.0'
			});

			var fldHtml = objForm.addField({
				id: 'custpage_htmlfield',
				type: serverWidget.FieldType.INLINEHTML,
				label: 'HTML'
			});
			
			var sHandlebar = handlebars.compile(sTemplate);
			handlebars = handlebarshelper.register(handlebars);
			
			var sHtmlTemplate = sHandlebar({
				type: sType,
				id: idRec
					
			});

			fldHtml.defaultValue = sHtmlTemplate;

			context.response.writePage(objForm);
    	}
    }

    return {
        onRequest: onRequest
    };

});