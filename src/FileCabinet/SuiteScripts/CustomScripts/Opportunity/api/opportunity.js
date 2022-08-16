define(['./lib/boxfolder'],
/**
 * @param {record} record
 * @param {runtime} runtime
 */
function(boxfolder) {
	
	createFolder = function(option){
		
		try{
			
			return boxfolder.create(option);
         }
         catch (err){
        	 log.audit({title: 'opportunity.createFolder' , details: 'err: ' + err});
         }
	};
	
    return {
    	createFolder: createFolder
    };
    
});
