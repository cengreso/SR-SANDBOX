/**
 * @NApiVersion 2.x
 */
define(['N/search','N/record', 'N/runtime', '../lib/folder.js', 'N/file','N/query', '../lib/collab','../../../Helper/jsonmapns'],

	function (search,record, runtime, folder, file, query, collab,jsonmapns) {
		log.debug('employee.js');

		var subsidiaryFolders = runtime.getCurrentScript().getParameter('custscriptjson_empfoldercreation_by_subs');
		onboardEmployeeFolder = function (options) {
			try {
				var scriptObj = runtime.getCurrentScript();
				var stRecId = options.id;
				var strecType = options.type;
				var retMe = {}

				var sSql = file.load({
					id: 309848 // SuiteBox/api/recordlib/sql/getemployee.sql
				}).getContents();

				var objEmployee = query.runSuiteQL({
					query: sSql,
					params: [stRecId]
				}).asMappedResults()[0];
				log.debug('objEmployee', objEmployee);

				var recMapping = record.load({type:'customrecord_integration_mapping', id:134});
				var jsonMap = JSON.parse(recMapping.getValue('custrecord_intmap_mapping'));
				var subsidiary = jsonmapns.jsonGetValue({
					mapping: jsonMap,
					data: objEmployee,
					key: 'subsidiary'
				});
				log.debug('subsidiary new update', subsidiary)
				var stSubsidiary = objEmployee.subsidiary;
				var stInternalid = objEmployee.id;

				var stEmployeeFolder = stInternalid + ' - ' + objEmployee.firstname + ', ' + objEmployee.lastname;
				var arrEmpSubFolder = ['onboarding', 'allowance', 'salaryadjustments', 'Variable Compensation', 'Offboarding', 'Others']

				var options = {
					objFolder: {
						name: stEmployeeFolder,
						parent: subsidiary, // subsidiary folder id stSubsidiary will have a mapping
					},
					objRecord: {
						record: strecType,
						id: stRecId,
					},
				};

				var objParentFolder = folder.create(options);

				log.debug({
					title: "Employee Parent Folder",
					details: objParentFolder
				});
				var stParentId = useExistingFolderid(objParentFolder);// accepts Box's callback to re-align error

				if (!!stParentId)
					for (var stSubFolderCTR = 0; stSubFolderCTR < arrEmpSubFolder.length; stSubFolderCTR++) {
						options.objFolder = {
							name: arrEmpSubFolder[stSubFolderCTR],
							parent: parseInt(stParentId),
						}
						var subFolder = folder.create(options);
						log.audit({
							title: "Employee subFolder",
							details: subFolder
						});
					}
				retMe = {
					response:'successful',
					message: 'employee folders created',
				}

				log.audit({
					title: "Remaining usage units: ",
					details: scriptObj.getRemainingUsage()
				});
				return retMe

			} catch (e) {
				retMe = {
					response:'failed',
					message:'failed in creating Folder',
					err: e
				};
				log.debug({title: 'Error on: Employee library', details: retMe});
				return retMe
			}
		};

		var useExistingFolderid = function(objParentFolder){
			var stParentId = null
			if(objParentFolder.status == "failed"){
				var objErrorJson = JSON.parse(objParentFolder.json)
				if(objErrorJson.status == 409)
					stParentId = objErrorJson.context_info.conflicts[0].id
			}else
				stParentId = objParentFolder.id
			return stParentId
		};

		addCollab = function (options){
			// { Single Collaborations
			// 	type: 'folder', // folder
			// 		id: folderId, // target folder id
			// 	userid: 30912392949, // OR userid: '53397',email: emailSalesRep,
			// 	role: 'co-owner',
			// 	usertype: 'group',
			// 	recType:'employee'
			// }
			return collab.addCollab(options)
		};

		addCollabs = function (arrOptions) {
			try{
				//{ // Multiple Collaborations based on Subsidary
				//	subsidiary:17,
				//	recType: "employee",
				//	collabs: true,
				//	folderId: 169990947918
				//}

				var collaborators = getCollabBySubsidiary(arrOptions);

				for (var optionCTR = 0; optionCTR < collaborators.length; optionCTR++) 	{
					collaborators[optionCTR].id = arrOptions.folderId
					collaborators[optionCTR].type = arrOptions.type
					collab.addCollab(collaborators[optionCTR]);
				}

			}catch (e) {
				log.debug('arrOptions', e);
			}
			getCollabBySubsidiary = function (options) {
				var arr = JSON.parse(runtime.getCurrentScript().getParameter('custscriptjson_collaborators_by_sub'));
				var arrSubsidiary = [];
				for (var arrCTR = 0; arrCTR < arr.length; arrCTR++) {
					var arrSubs = arr[arrCTR].subsidiary.split(',');
					for (var subCTR = 0; subCTR < arrSubs.length; subCTR++) {
						if(arrSubs[subCTR] == options.subsidiary)
							arrSubsidiary.push(arr[arrCTR]);
					}
				}
				return arrSubsidiary
			}
		};



		return {
			onboardEmployeeFolder: onboardEmployeeFolder,
			addCollab:addCollab,
			addCollabs:addCollabs
		}

	});