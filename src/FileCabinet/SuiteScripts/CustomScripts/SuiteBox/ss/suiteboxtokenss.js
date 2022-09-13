/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope SameAccount
 */
define(['N/https', 'N/record', '../api/suitebox'],
/**
 * @param {https} https
 * @param {record} record
 */
function(https, record, suitebox) {
   
    /**
     * Definition of the Scheduled script trigger point.
     *
     * @param {Object} scriptContext
     * @param {string} scriptContext.type - The context in which the script is executed. It is one of the values from the scriptContext.InvocationType enum.
     * @Since 2015.2
     */
    function execute(scriptContext) {
    	

    	var refreshType = '1'; 
    	
		var recToken = record.load({type:'customrecord_suite_box', id: 1});
		var objHeader = { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': '*/*'}; 
		
		
		var data = 'grant_type=refresh_token&client_id=' + recToken.getValue({fieldId: 'custrecord_suitebox_clientid'}) + '&client_secret='+ recToken.getValue({fieldId: 'custrecord_suitebox_clientsec'}) + 
					'&refresh_token=' + recToken.getValue({fieldId: 'custrecord_suitebox_refresh_token'});
		
		var objResp = https.post({url: recToken.getValue({fieldId: 'custrecord_suitebox_auth_url'}), body: data, headers: objHeader});
		
		if (objResp.code == 200) {
			
			var objTokens = JSON.parse(objResp.body);
			recToken.setValue({fieldId: 'custrecord_suitebox_access_token', value: objTokens.access_token});
			recToken.setValue({fieldId: 'custrecord_suitebox_refresh_token', value: objTokens.refresh_token});
			recToken.save();
		}
    }

    return {
        execute: execute
    };
    
});
