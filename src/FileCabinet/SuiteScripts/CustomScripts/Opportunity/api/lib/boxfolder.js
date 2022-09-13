define(['../../../SuiteBox/api/suitebox'],
/**
 * @param {record} suitebox
 */
function(suitebox) {
	
	create = function(newRec){
		
		try{
			
			var emailSalesRep = newRec.getValue({fieldId: 'custbody_salesrep_email'});
			
			log.audit({title: 'opportunity.createFolder' , details: 'emailSalesRep: ' + emailSalesRep});
			
			//create folder
			var objFolder = suitebox.createFolder({	name: newRec.getValue({fieldId: 'tranid'}), 
													parent: null}, 
												  { record: 'opportunity', 
													id: newRec.id });
			
			//add sales rep
			var objCollab = suitebox.addCollab({type: 'folder', 
												id: objFolder.id , 
												email: emailSalesRep,
												role: 'co-owner',
												usertype: 'user'}, 'opportunity');
			
			//add group finance.members
			var objCollab = suitebox.addCollab({type: 'folder', 
												id: objFolder.id , 
												userid: '53397',
												role: 'viewer',
												usertype: 'group'}, 'opportunity');
			return objFolder;
         }
         catch (err){
        	 log.audit({title: 'opportunity.createFolder' , details: 'err: ' + err});
         }
	};
	
    return {
		
    	create:create 			

    };
});
