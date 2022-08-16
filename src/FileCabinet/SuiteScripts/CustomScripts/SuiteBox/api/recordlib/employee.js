/**
 * @NApiVersion 2.x
 */
define(['N/search', 'N/runtime', '../lib/folder.js'],

	function (search, runtime, folder) {
		onboardEmployeeFolder = function (options) {
			try {
				// log.debug('folder', folder)
				var scriptObj = runtime.getCurrentScript();
				var stRecId = options.id;
				var strecType = options.type;
				var retMe = {}

				var employee = search.lookupFields({
					type: strecType,
					id: stRecId,
					columns: ['subsidiary', 'entityid', 'internalid', 'firstname', 'lastname']
				});

				var stSubsidiary = employee.subsidiary[0].value;
				var stInternalid = employee.internalid[0].value;

				var stEmployeeFolder = stInternalid + ' - ' + employee.firstname + ', ' + employee.lastname;
				var arrEmpSubFolder = ['onboarding', 'allowance', 'salaryadjustments', 'Variable Compensation', 'Offboarding', 'Others']


				log.debug('arrEmpSubFolder', arrEmpSubFolder);
				log.debug('stSubsidiary',stSubsidiary);

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

				log.debug('folder', folder)
				var objParentFolder = folder.create(options);

				log.debug({title:'objParentFolder',details:objParentFolder});
				var stParentId = useExistingFolderid(objParentFolder);// accepts Box's callback to re-align error


				if (!!stParentId)
					for (var stSubFolderCTR = 0; stSubFolderCTR < arrEmpSubFolder.length; stSubFolderCTR++) {
						options.objFolder = {
							name: arrEmpSubFolder[stSubFolderCTR],
							parent: parseInt(stParentId),
						}
						folder.create(options);
					}
				retMe = {
					response:'successful',
					message: 'employee folders created',
				}

				log.debug({
					title: "Remaining usage units: ",
					details: scriptObj.getRemainingUsage()
				});
				return retMe

				log.debug('e',e)
				retMe = {
					response:'failed',
					message:'failed in creating Folder'
				}
				return retMe

			} catch (e) {
				retMe = {
					response:'failed',
					message:'failed in creating Folder',
					err: e
				}
				log.error({title: 'Error on: Employee library', details: retMe})
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
		}
		var fnSubsidiaryMapping = function (stSubsidiary){
			var objSubsidiaryMap = {
				'1':217211964,	//United States
				'4':217211964,	//United States
				'8':162851997859,	//El Salvador
				'2':1353693716, //United Kingdom
				'12':25586471718,	//Singapore
				'17':169776175563,	//Philippines actual = 159761928514, demo = 169776175563
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

		return {
			onboardEmployeeFolder: onboardEmployeeFolder,
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