define(['N/record', 'N/search', 'N/url', './issue', '../../../Helper/jsonmapns', '../../../Helper/srhelper', '../../../SuiteBox/api/suitebox'],
/**
 * @param {record} record
 * @param {search} search
 * @param {url} url
 */
function(record, search, url, issue, jsonmapns, srhelper, suitebox) {
	
	create = function(option){
		
		var retMe = option;
		var objData = (issue.get({id: option.id})).result;
	
		
		log.audit({title: 'option', details: JSON.stringify(option)});
		
		if(objData.status == 'SUCCESS'){

	        var recMapping = record.load({
	            type: 'customrecord_integration_mapping',
	            id: 112
	        });

	        var objMap = JSON.parse(recMapping.getValue({
	            fieldId: 'custrecord_intmap_mapping'
	        }));
			
			var data = objData.data;

			var emProjManager = data.fields.customfield_10072.emailAddress;
			data.company = option.company;
			data.subsidiary = option.subsidiary;
            data.projecttemplateid = option.projecttemplateid;
			data.jobtype = option.jobtype;
			data.fields.customfield_10227 = data.fields.customfield_10227[0].value;
			data.fields.customfield_10072 = srhelper.empEmailToInternalId(emProjManager); 
			
			var rec = record.create({
			    type: record.Type.JOB,
			    isDynamic: true,
			    defaultValues: {
			        parent: option.company 
			    }
			});
			
			rec.setValue({
		        fieldId: 'projecttemplate',
		        value: option.projecttemplateid
		    });
			
	        for (var key in objMap) {

	        	rec = jsonmapns.jsonMap({
	                mapping: objMap,
	                record: rec,
	                data: data,
	                key: key
	            });
	        }
	        
			var idRec = rec.save({
		        isDynamic: true
		    });

//			var rec = record.load({
//			    type: record.Type.JOB,
//			    id: idRec,
//			    isDynamic: true
//			});
			
			var objFolder = suitebox.createFolder({
			    name: data.key,
			    parent: null
			}, {
			    record: 'job',
			    id: idRec
			});

			if (objFolder.status == 'success') {

			    var objCollab = suitebox.addCollab({
			        type: 'folder',
			        id: objFolder.id,
			        email: emProjManager,
			        role: 'co-owner',
			        usertype: 'user'
			    },
			            'job');
			}

    	    var sProjUrl = 'https://3688201.app.netsuite.com/app/accounting/project/project.nl?id=' + idRec;
    	    var stURL = 'https://servicerocket.app.box.com/folder/' + objFolder.id;

//			rec.setValue({
//			    fieldId: 'custentity_sr_box_folder_url',
//			    value: stURL
//			});
//			
//			var idRec = rec.save();
			
			retMe = { boxurl : stURL, id: idRec, projecturl: sProjUrl};
		}
		else{

			retMe = objData;
		}
		
		return retMe;
	};
	
	update = function(option){
		
		var retMe = option;
		var objData = (issue.get({id: option.id})).result;
	
		if(objData.status == 'SUCCESS'){

	        var recMapping = record.load({
	            type: 'customrecord_integration_mapping',
	            id: 113
	        });

	        var objMap = JSON.parse(recMapping.getValue({
	            fieldId: 'custrecord_intmap_mapping'
	        }));
			
			var data = objData.data;
			var emProjManager = data.fields.customfield_10072.emailAddress;
			data.fields.customfield_10227 = data.fields.customfield_10227[0].value;
			data.fields.customfield_10072 = srhelper.empEmailToInternalId(emProjManager); 
			
			
	        var src = search.create({
	            type: record.Type.JOB,
	            filters: ['entityid', 'is', option.id]
	        });

	        var res = src.run().getRange({
	            start: 0,
	            end: 1
	        });
			
	        if (res.length > 0) {
	            
				var rec = record.load({
				    type: record.Type.JOB,
				    id: res[0].id,
				    isDynamic: true
				});
				
		        for (var key in objMap) {

		        	rec = jsonmapns.jsonMap({
		                mapping: objMap,
		                record: rec,
		                data: data,
		                key: key
		            });
		        }
				
				var id = rec.save();
				
				retMe = { status : 'SUCESS', message: 'Project has been updated.'};
	            
	            
	        } 
	        else {
	        	retMe = { status : 'FAILED', message: "Project ID does not exist."};
	        }
		}
		else{
			retMe = objData;
		}
		return retMe;
	};
	
    return {
    	create : create,
    	update: update
    };
    
});
