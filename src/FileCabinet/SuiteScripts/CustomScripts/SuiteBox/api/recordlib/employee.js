/**
 * @NApiVersion 2.x
 */
define(['N/search', 'N/runtime', '../lib/folder.js', 'N/file','N/query', '../lib/collab'],

	function (search, runtime, folder, file, query, collab) {
		log.debug('employee.js');

		onboardEmployeeFolder = function (options) {
			try {
				var scriptObj = runtime.getCurrentScript();
				var stRecId = options.id;
				var strecType = options.type;
				var retMe = {}

				var sSql = file.load({
					id: 309848 // SuiteBox/api/recordlib/sql/employee.sql
				}).getContents();

				var objEmployee = query.runSuiteQL({
					query: sSql,
					params: [stRecId]
				}).asMappedResults()[0];
				log.debug('objEmployee', objEmployee);

				var stSubsidiary = objEmployee.subsidiary;
				var stInternalid = objEmployee.id;

				var stEmployeeFolder = stInternalid + ' - ' + objEmployee.firstname + ', ' + objEmployee.lastname;
				var arrEmpSubFolder = ['onboarding', 'allowance', 'salaryadjustments', 'Variable Compensation', 'Offboarding', 'Others']

				var options = {
					objFolder: {
						name: stEmployeeFolder,
						parent: fnSubsidiaryMapping(stSubsidiary), // subsidiary folder id stSubsidiary will have a mapping
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

				log.debug('collaborators',collaborators);

				for (var optionCTR = 0; optionCTR < collaborators.length; optionCTR++) 	{
					collaborators[optionCTR].id = arrOptions.folderId
					collaborators[optionCTR].type = arrOptions.type
					collab.addCollab(collaborators[optionCTR]);
				}

			}catch (e) {
				log.debug('arrOptions', e);
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
		}
		var fnSubsidiaryMapping = function (stSubsidiary){
			var objSubsidiaryMap = {
				'1':217211964,	//United States
				'4':217211964,	//United States
				'8':162851997859,	//El Salvador
				'2':1353693716, //United Kingdom
				'12':25586471718,	//Singapore
				'17':169776175563,	//Philippines actual = 159761928514, demo = 169776175563, prod Test = 171045313346
				'10':8206811153,	//Malaysia
				'15':127215681988,	//india
				'5':1106562906,	//chile
				'14':104978865295,	//Canada
				'3':129086805626,  //australia
				'9':129086805626,  //australia
				'6':129086805626,  //australia
				'11':129086805626,  //australia
				'7':129086805626,  //australia
			}
			return objSubsidiaryMap[stSubsidiary]
		}
		var getCollabBySubsidiary = function (options) {

			var sSql = file.load({
				id: 310049 // SuiteBox/api/recordlib/sql/collaborators.sql
			}).getContents();

			var arrSubsidiary = query.runSuiteQL({
				query: sSql,
				params: [options.subsidiary]
			}).asMappedResults()
			log.debug('arrSubsidiary',arrSubsidiary)
			return arrSubsidiary
		}

		return {
			onboardEmployeeFolder: onboardEmployeeFolder,
			addCollab:addCollab,
			addCollabs:addCollabs
		}

	});

/*
var objEmployeeFolders = {
	subsidiary:{
		Employee_Name:{
			onboarding_folders:['onboarding', 'allowance', 'salaryadjustments', 'Variable Compensation', 'Offboarding', 'Others'],
			otherSubFolder:{
				otherSubSubFolder:['what will be the last directory for this subfolder']
			}
		}
	}
}
*/