/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/https', 'N/ui/serverWidget', 'N/record', '../api/suitebox'],
/**
 * @param {https} https
 * @param {serverWidget} serverWidget
 */
function(https, serverWidget, record, suitebox) {
   
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
    	
    	var frmRocketBox = serverWidget.createForm({
			title: 'RocketBox'
		});

    	var fldRecipient = frmRocketBox.addField({
    		label: 'Recipient',
			id: 'custpage_rbx_recipient',
			type: serverWidget.FieldType.SELECT
		});
    	
    	var fldFiles = frmRocketBox.addField({
    		label: 'Files',
			id: 'custpage_rbx_files',
			type: serverWidget.FieldType.SELECT
		});
    	
    	var fldSubject = frmRocketBox.addField({
    		label: 'Subject',
			id: 'custpage_rbx_subject',
			type: serverWidget.FieldType.TEXT
		});
    	
    	var fldMessage = frmRocketBox.addField({
    		label: 'Message',
			id: 'custpage_rbx_message',
			type: serverWidget.FieldType.TEXTAREA
		});
    	
    	
    	var recEstimate;
    	
    	try{
    		recEstimate = record.load({
        		type: 'estimate',
        		id: idRec
        	});
    	}
    	catch(err){

    	}
    	
   	
    	fldFiles.isMandatory = true;
    	fldRecipient.isMandatory = true;
		fldFiles.addSelectOption({
		    value: '',
		    text: ''
		});
    	
		fldRecipient.addSelectOption({
		    value: '',
		    text: ''
		});
		
		var rbx;
		
    	try{
    		rbx = suitebox.folderContents({
    			folder: {
    				id: recEstimate.getValue('custbody_rbx_folderid')
    			}
    		});
    	
	
		var arrFile = rbx.response.data;

		
		for (var i = 0; i < arrFile.length; i++) {
			
    		fldFiles.addSelectOption({
    		    value: arrFile[i].id,
    		    text: arrFile[i].name
    		});
		}
			
		fldRecipient.addSelectOption({
		    value: 'patrick.alcomendas@servicerocket.com',
		    text: 'Patrick Alcomendas'
		});
	
		fldRecipient.addSelectOption({
		    value: 'janice.cheang@servicerocket.com',
		    text: 'Janice Cheang'
		});
		
		var fldInfo = frmRocketBox.addField({
    		label: 'Info',
			id: 'custpage_rbx_info',
			type: serverWidget.FieldType.INLINEHTML
		});
    	}
    	catch(err){

    	}
		
    	if(context.request.method === 'POST'){
    		
    		var rbxSign = suitebox.requestSign({
    		    "signers":[{
    		        "role": "signer",
    		        "email": context.request.parameters.custpage_rbx_recipient
    		    }],
    		    "source_files": [{
    		        "type": "file",
    		        "id": context.request.parameters.custpage_rbx_files
    		    }],
    		    "parent_folder": {
    		        "type": "folder",
    		        "id": "156767063747"
    		    },
    			'email_subject': context.request.parameters.custpage_rbx_subject,
    			'email_message': context.request.parameters.custpage_rbx_message
    		});
    		
    	}
    	
    	frmRocketBox.addSubmitButton({label: 'Send to Sign'});
    	
    	context.response.writePage(frmRocketBox);
    	
    }

    return {
        onRequest: onRequest
    };
    
});
