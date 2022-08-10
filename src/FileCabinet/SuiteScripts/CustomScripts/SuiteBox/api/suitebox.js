define(['N/https', 'N/record', 'N/search', 'N/email', 'N/query', './lib/file', './lib/folder', './lib/sign'],
/**
 * @param {https} https
 * @param {record} record
 * @param {search} search
 */
function(https, record, search, email, query, boxfile, folder, sign) {
	
	getFile = function(){
		return boxfile.get(option);
	};
	
	updateFolder = function(option){
		
		return folder.update(option);
	};
	
	emailUpload = function(option) {
		return boxfile.upload(option);
	};
	
	gcfUpoad = function(option) {
		return boxfile.gcfUpoad(option);
	};
	
	downloadFile = function(option) {
		return boxfile.download(option);
	};
	
	requestSign = function(option){
		return sign.create(option);
	};
	
	searchFile = function(option){
		return boxfile.search(option);
	};
	
	createFolder = function(objFolder, objRecord) {
	// createFolder = function(option) {
		// return folder.createHW(option);
		try{

			var objSuiteBox = getSuiteBoxConfig(objRecord.record);

			if(objSuiteBox.status == 'bad'){
				objSuiteBox.status = 'failed';
				return objSuiteBox;
			}
			else if(objSuiteBox.status == 'ok') {

				var sParent = '';

				if(objFolder.parent != null && objFolder.parent != ''){
					sParent = objFolder.parent;
				}
				else if (objSuiteBox.parent != null && objSuiteBox.parent != '') {
					sParent = objSuiteBox.parent;
				}

				var objPayload ={	name: objSuiteBox.prefix + objFolder.name,
									parent: {id : objSuiteBox.parent}};
				var objHeader =	{	'Content-Type': 'application/json',
									Authorization: 'Bearer ' + objSuiteBox.accesstoken};

				log.audit({title: 'createFolder', details: 'request: ' + JSON.stringify(objPayload)});

				var objResp = https.post({url: 'https://api.box.com/2.0/folders', body: JSON.stringify(objPayload), headers: objHeader});

				log.audit({title: 'createFolder', details: 'response: ' + objResp.code + ' ' + objResp.body});

				if (objResp.code == 201) {

					var objFolder = JSON.parse(objResp.body);

					var recFolder = record.create({type: 'customrecord_box_record_folder'});
						recFolder.setValue({fieldId: 'custrecord_ns_record_id', value: objRecord.id.toString()});
						recFolder.setValue({fieldId: 'custrecord_box_record_folder_id', value: objFolder.id});
						recFolder.setValue({fieldId: 'custrecord_netsuite_record_type', value: objRecord.record});
					var id = recFolder.save();
						objFolder.status = 'success';
					return objFolder;
				}
				else{
					return {status: 'failed',
							message: objResp.code  + ':' + objResp.body};
				}
			}
		}
		catch (err){
			log.audit({title: 'createFolder', details: 'err:' + err});
			return {status: 'failed',
					message: 'ERROR: ' + err};
		}
	};
	
	folderContents = function(option){
		return folder.contents(option);
	};
	
	addCollab = function(objCollab, recType) {
		
		try{
				
			var objSuiteBox = getSuiteBoxConfig(recType);
			
			var objAccessibleBy = {type : objCollab.usertype};
			
			log.audit({title: 'suitebox.addCollab', details: 'objCollab: ' + JSON.stringify(objCollab)});
			
			if(objCollab.email != undefined){
				objAccessibleBy.login = objCollab.email;
			}
			else if(objCollab.userid != undefined){
				objAccessibleBy.id = objCollab.userid;
			}
			
			var objPayload = {	item: {	type: objCollab.type,
										id: objCollab.id},
								accessible_by: objAccessibleBy,
								role: objCollab.role};
						
			var objHeader = {	'Content-Type': 'application/json', 
								'Authorization': 'Bearer ' + objSuiteBox.accesstoken}; 
			
			log.audit({title: 'suitebox.addCollab', details: 'request: ' + JSON.stringify(objPayload)});
			
			var objResp = https.post({url: 'https://api.box.com/2.0/collaborations', body: JSON.stringify(objPayload), headers: objHeader});
			
			log.audit({title: 'suitebox.addCollab', details: 'response: ' + objResp.code + ' ' + objResp.body});
			
			if (objResp.code == 201) {
				
				var objFolder = JSON.parse(objResp.body);
					objFolder.status = 'success';
				return objFolder;
			}
			else{
				return {status: 'failed',
						message: objResp.code  + ':' + objResp.body};
			}			
		}
		catch (err){
			return {status: 'failed',
					message: 'ERROR: ' + err};
		}		
	};
	
	getSuiteBoxConfig = function(recType){
		
		try{
			
			var src = search.create({	type: 'customrecord_box_record_type_config',
				columns: [{	name: 'custrecord_prefix'},
				          {	name: 'custrecord_suitebox_parent_folder'},
				          {	name: 'custrecord_suitebox_access_token',
				          	join: 'custrecord_suitebox_config'},
				          	
				          //***updated,deployed 24 Feb 2021 ITSM-1582
				          {	name: 'custrecord_suitebox_author',
					          	join: 'custrecord_suitebox_config'},
				          {	name: 'custrecord_suitebox_email',
					          	join: 'custrecord_suitebox_config'}]});
						  //***
			
				src.filters = [];
				src.filters.push(search.createFilter({	name : 'custrecord_record_type', 
														operator : 'is', 
														values : recType}));
				
				var res = src.run().getRange({	start: 0,
												end: 1});
				
				if(res.length < 1){
					return {status : 'bad',
							message : 'CONFIG: Missing SuiteBox Config'};
				}
				else{
					
					return {status: 'ok',
							prefix : res[0].getValue({name: 'custrecord_prefix'}),
							parent : res[0].getValue({name: 'custrecord_suitebox_parent_folder'}),
							accesstoken : res[0].getValue({name: 'custrecord_suitebox_access_token',
														join: 'custrecord_suitebox_config'}),
							//***updated,deployed 24 Feb 2021 ITSM-1582
							author : res[0].getValue({name: 'custrecord_suitebox_author',
								join: 'custrecord_suitebox_config'}),
							email : res[0].getValue({name: 'custrecord_suitebox_email',
								join: 'custrecord_suitebox_config'})};
							//***
				}
		}
		catch(err){
			log.audit({title: 'getSuiteBoxConfig', details: 'err:' + err});
			return {status: 'bad',
					message: 'ERROR: ' + err};
		}
	};
	
	


	getFolderRecord = function(objSuitebox){
		
		var src = search.create({	type: 'customrecord_box_record_folder',
			columns: [{	name: 'internalid'},
			          {	name: 'custrecord_ns_record_id'},
			          {	name: 'custrecord_box_record_folder_id'},
			          {	name: 'custrecord_netsuite_record_type'},
			          ]});
			src.filters = [];
			src.filters.push(search.createFilter({	name : 'custrecord_ns_record_id', 
													operator : 'is', 
													values : objSuitebox.id.toString()}));
			src.filters.push(search.createFilter({	name : 'custrecord_netsuite_record_type', 
													operator : 'is', 
													values : objSuitebox.record}));
		var res = src.run().getRange({	start: 0,
										end: 1});
		
		if(res.length < 1){
			return {status : 'bad',
					message : 'BOXFOLDER: Folder not found.'};
		}
		else{
			
			return {status: 'ok',
					id : res[0].id,
					folderid: res[0].getValue({name: 'custrecord_box_record_folder_id'}),
					record : res[0].getValue({name: 'custrecord_netsuite_record_type'})};
		}
	};
	//***
	
	//***updated,deployed 10 Mar 2021 ITSM-1666
	createFolderRecord = function(objSuitebox){
		
		var recFolder = record.create({type: 'customrecord_box_record_folder'});
			recFolder.setValue({fieldId: 'custrecord_ns_record_id', value: objSuitebox.id.toString()});
			recFolder.setValue({fieldId: 'custrecord_box_record_folder_id', value: objSuitebox.folderid});
			recFolder.setValue({fieldId: 'custrecord_netsuite_record_type', value: objSuitebox.record});
		var id = recFolder.save();
		
		return id;
	};
	//***
	
	getConfig = function(recType){
		
		try{
			
			var arrHsDeal = query.runSuiteQL('SELECT id FROM customrecord_box_record_type_config WHERE custbody_hubspot_id = '+ option.id).asMappedResults();

			var src = search.create({	type: 'customrecord_box_record_type_config',
				columns: [{	name: 'custrecord_prefix'},
				          {	name: 'custrecord_suitebox_parent_folder'},
				          {	name: 'custrecord_suitebox_access_token',
				          	join: 'custrecord_suitebox_config'},
				          	
				          //***updated,deployed 24 Feb 2021 ITSM-1582
				          {	name: 'custrecord_suitebox_author',
					          	join: 'custrecord_suitebox_config'},
				          {	name: 'custrecord_suitebox_email',
					          	join: 'custrecord_suitebox_config'}]});
						  //***
			
				src.filters = [];
				src.filters.push(search.createFilter({	name : 'custrecord_record_type', 
														operator : 'is', 
														values : recType}));
				
				var res = src.run().getRange({	start: 0,
												end: 1});
				
				if(res.length < 1){
					return {status : 'bad',
							message : 'CONFIG: Missing SuiteBox Config'};
				}
				else{
					
					return {status: 'ok',
							prefix : res[0].getValue({name: 'custrecord_prefix'}),
							parent : res[0].getValue({name: 'custrecord_suitebox_parent_folder'}),
							accesstoken : res[0].getValue({name: 'custrecord_suitebox_access_token',
														join: 'custrecord_suitebox_config'}),
							//***updated,deployed 24 Feb 2021 ITSM-1582
							author : res[0].getValue({name: 'custrecord_suitebox_author',
								join: 'custrecord_suitebox_config'}),
							email : res[0].getValue({name: 'custrecord_suitebox_email',
								join: 'custrecord_suitebox_config'})};
							//***
				}
		}
		catch(err){
			log.audit({title: 'getSuiteBoxConfig', details: 'err:' + err});
			return {status: 'bad',
					message: 'ERROR: ' + err};
		}
	};
	
	
    return {
    	createFolder: createFolder,
    	updateFolder: updateFolder,
    	folderContents: folderContents,
    	getFile : getFile,
    	requestSign: requestSign,
    	addCollab: addCollab,
    	emailUpload: emailUpload,
    	getFolderRecord: getFolderRecord,
    	createFolderRecord: createFolderRecord,
    	getConfig: getConfig
    };
    
});
