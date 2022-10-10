define(['N/query', 'N/search', 'N/record', '../../../Helper/nstojson', '../../../Helper/jsonmapns', '../../../Library/momentjs/moment', 'N/runtime', '../../../BankInformation/api/bankinformation', '../../../SuiteBox/api/lib/folder.js', 'N/file','../../../SuiteBox/api/lib/collab.js'],
    /**
     * @param {query} query
     * @param {search} search
     * @param {record} record
     * @param {nstojson} nstojson
     * @param {jsonmapns} jsonmapns
     * @param {moment} moment
     * @param {runtime} runtime
     */
    function (query, search, record, nstojson, jsonmapns, moment, runtime, bankinformation, folder, file, collab) {
        var userObj = runtime.getCurrentUser();
        var stDatePreference = userObj.getPreference({name: "dateformat"});

        create = function (option) {

            //Load Job Req
            //Load Job Offer
            //Upload
            try {
                var recOffer = record.load({
                    type: 'customrecord_joboffer',
                    id: option.id,
                    isDynamic: true
                });

                var recRequisition = record.load({
                    type: 'jobrequisition',
                    id: recOffer.getValue({
                        fieldId: 'custrecord_jo_jobrequisition'
                    }),
                    isDynamic: true,
                    defaultValues: Object
                });

                var objOffer = nstojson.get(recOffer);
                var objRequisition = nstojson.get(recRequisition);

                for (var key in objOffer) {
                    objRequisition[key] = objOffer[key];
                }

                var recMapping = record.load({
                    type: 'customrecord_integration_mapping',
                    id: 117
                });

                var objMap = JSON.parse(recMapping.getValue({
                    fieldId: 'custrecord_intmap_mapping'
                }));

                var intEmployeeId = getEmployeeId(recOffer.getValue("custrecord_jo_firstname"), recOffer.getValue("custrecord_jo_lastname"));

                if (intEmployeeId) {
                    var rec = record.load({type: record.Type.EMPLOYEE, id: intEmployeeId, isDynamic: true});
                } else {
                    var rec = record.create({type: record.Type.EMPLOYEE, isDynamic: true});
                }

                for (var key in objMap) {

                    rec = jsonmapns.jsonMap({
                        mapping: objMap,
                        record: rec,
                        data: objRequisition,
                        key: key
                    });
                }

                var objTimeOffPlans = getTimeOffPlans();

                var fieldLookUpLocation = search.lookupFields({
                    type: search.Type.LOCATION,
                    id: recRequisition.getValue("location"),
                    columns: ['country']
                });

                var intAddressCount = rec.getLineCount({sublistId: "addressbook"});
                if (intAddressCount == 0) {
                    rec.selectNewLine({sublistId: "addressbook"});
                } else {
                    rec.selectLine({sublistId: "addressbook", line: intAddressCount - 1});
                }

                var subrec = rec.getCurrentSublistSubrecord({sublistId: 'addressbook', fieldId: 'addressbookaddress'});
                subrec.setValue({fieldId: "country", value: fieldLookUpLocation.country});
                subrec.setValue({fieldId: "addr1", value: recOffer.getValue({fieldId: 'custrecord_jo_address1'})});
                subrec.setValue({fieldId: "addr2", value: recOffer.getValue({fieldId: 'custrecord_jo_address2'})});
                rec.commitLine({sublistId: "addressbook"});

                // var stEmail = setEmailOfEmployee(recOffer);
                // rec.setValue({fieldId: 'email', value: stEmail.toLowerCase()});
                rec.setValue({fieldId: 'basewage', value: recOffer.getValue('custrecord_jo_basesalary')});
                if (rec.getValue('subsidiary') && rec.getValue('hiredate')) {
                    var intTimeOffPlan = (typeof objTimeOffPlans[rec.getValue('subsidiary')] != "undefined") ? objTimeOffPlans[rec.getValue('subsidiary')] : "";
                    rec.setValue({fieldId: 'timeoffplan', value: intTimeOffPlan});
                    rec.setValue({fieldId: 'startdatetimeoffcalc', value: rec.getValue('hiredate')});
                }

                if (rec.getValue('hiredate')) {
                    var dtNextReviewDate = moment(rec.getValue('hiredate')).add('M', 9).format('L');
                    var dtProbitionExpiryDate = moment(rec.getValue('hiredate')).add('M', 3).format('L');
                    rec.setText({fieldId: 'nextreviewdate', text: getFormattedDate(dtNextReviewDate)});
                    rec.setText({
                        fieldId: 'custentity_sr_probation_expiry',
                        text: getFormattedDate(dtProbitionExpiryDate)
                    });
                    var stNextReviewMonth = moment(moment(rec.getValue('hiredate')).add('M', 10).month(), 'M').format('MM'); //add 1 month  on the next review date since the  result of the month() always start at 0;
                    var stNextReviewYear = moment(rec.getValue('hiredate')).add('M', 9).year();
                    var intAdjustmentCycleId = getAdjustmentCycleId(stNextReviewYear, stNextReviewMonth);
                    if (intAdjustmentCycleId) {
                        rec.setValue({fieldId: "custentity_sr_next_adjustment_cycle", value: intAdjustmentCycleId});
                    }
                }

                //		rec.selectNewLine({
                //            sublistId: 'roles'
                //        });
                //
                //		rec.setCurrentSublistValue({
                //			sublistId : 'roles',
                //			fieldId : 'selectedrole',
                //			value : 1022
                //		});
                //
                //        rec.commitLine({
                //            sublistId: 'roles'
                //        });

                var employeeid = "";
                if (!rec.getValue("employeestatus")) {
                    employeeid = rec.save({enableSourcing: false, ignoreMandatoryFields: true});
                    if (employeeid) {
                        recOffer.setValue({fieldId: 'custrecord_sr_off_employee', value: employeeid});
                        recOffer.save({enableSourcing: false, ignoreMandatoryFields: true});

                        bankinformation.create({employeeId: employeeid})
                    }
                }

                return employeeid;

            } catch (err) {
                log.audit({
                    title: 'Employee Creation Error',
                    details: err
                });
            }
        };

        update = function (option) {

            //Load Job Req
            //Load Job Offer
            //Upload
            try {
                var recOffer = record.load({
                    type: 'customrecord_joboffer',
                    id: option.id,
                    isDynamic: true
                });

                var recRequisition = record.load({
                    type: 'jobrequisition',
                    id: recOffer.getValue({
                        fieldId: 'custrecord_jo_jobrequisition'
                    }),
                    isDynamic: true,
                    defaultValues: Object
                });

                var objOffer = nstojson.get(recOffer);
                var objRequisition = nstojson.get(recRequisition);

                for (var key in objOffer) {
                    objRequisition[key] = objOffer[key];
                }

                var recMapping = record.load({
                    type: 'customrecord_integration_mapping',
                    id: 117
                });

                var objMap = JSON.parse(recMapping.getValue({
                    fieldId: 'custrecord_intmap_mapping'
                }));

                if (recOffer.getValue("custrecord_sr_off_employee")) {
                    var intEmployeeId = recOffer.getValue("custrecord_sr_off_employee");
                } else {
                    var intEmployeeId = getEmployeeId(recOffer.getValue("custrecord_jo_firstname"), recOffer.getValue("custrecord_jo_lastname"));
                }

                if (intEmployeeId) {
                    var rec = record.load({type: record.Type.EMPLOYEE, id: intEmployeeId, isDynamic: true});
                } else {
                    var rec = record.create({type: record.Type.EMPLOYEE, isDynamic: true});
                }

                for (var key in objMap) {

                    rec = jsonmapns.jsonMap({
                        mapping: objMap,
                        record: rec,
                        data: objRequisition,
                        key: key
                    });
                }

                var objTimeOffPlans = getTimeOffPlans();
                var fieldLookUpLocation = search.lookupFields({
                    type: search.Type.LOCATION,
                    id: recRequisition.getValue("location"),
                    columns: ['country']
                });

                var intAddressCount = rec.getLineCount({sublistId: "addressbook"});
                if (intAddressCount == 0) {
                    rec.selectNewLine({sublistId: "addressbook"});
                } else {
                    rec.selectLine({sublistId: "addressbook", line: intAddressCount - 1});
                }

                var subrec = rec.getCurrentSublistSubrecord({sublistId: 'addressbook', fieldId: 'addressbookaddress'});
                subrec.setValue({fieldId: "country", value: fieldLookUpLocation.country});
                subrec.setValue({fieldId: "addr1", value: recOffer.getValue({fieldId: 'custrecord_jo_address1'})});
                subrec.setValue({fieldId: "addr2", value: recOffer.getValue({fieldId: 'custrecord_jo_address2'})});
                rec.commitLine({sublistId: "addressbook"});

                // var stEmail = setEmailOfEmployee(recOffer);
                // rec.setValue({fieldId: 'email', value: stEmail.toLowerCase()});
                rec.setValue({fieldId: 'basewage', value: recOffer.getValue('custrecord_jo_basesalary')});
                if (rec.getValue('subsidiary') && rec.getValue('hiredate')) {
                    var intTimeOffPlan = (typeof objTimeOffPlans[rec.getValue('subsidiary')] != "undefined") ? objTimeOffPlans[rec.getValue('subsidiary')] : "";
                    rec.setValue({fieldId: 'timeoffplan', value: intTimeOffPlan});
                    rec.setValue({fieldId: 'startdatetimeoffcalc', value: rec.getValue('hiredate')});
                }

                if (rec.getValue('hiredate')) {
                    var dtNextReviewDate = moment(rec.getValue('hiredate')).add('M', 9).format('L');
                    var dtProbitionExpiryDate = moment(rec.getValue('hiredate')).add('M', 3).format('L');
                    rec.setText({fieldId: 'nextreviewdate', text: getFormattedDate(dtNextReviewDate)});
                    rec.setText({
                        fieldId: 'custentity_sr_probation_expiry',
                        text: getFormattedDate(dtProbitionExpiryDate)
                    });
                    var stNextReviewMonth = moment(moment(rec.getValue('hiredate')).add('M', 10).month(), 'M').format('MM'); //add 1 month  on the next review date since the  result of the month() always start at 0;
                    var stNextReviewYear = moment(rec.getValue('hiredate')).add('M', 9).year();
                    var intAdjustmentCycleId = getAdjustmentCycleId(stNextReviewYear, stNextReviewMonth);

                    var stPayrollDay = getSubsidiaryPayrollDay(recRequisition.getValue('subsidiary'));
                    log.audit("year", moment(rec.getValue('hiredate')).year());
                    log.audit("month", moment(rec.getValue('hiredate')).month());
                    log.audit("stPayrollDay", stPayrollDay);
                    log.audit("getSubsidiaryPayrollDay", moment([moment(rec.getValue('hiredate')).year(), moment(rec.getValue('hiredate')).month(), stPayrollDay]).format('L'));

                    if (intAdjustmentCycleId) {
                        rec.setValue({fieldId: "custentity_sr_next_adjustment_cycle", value: intAdjustmentCycleId});
                    }
                }

                if (recOffer.getValue({fieldId: 'custrecord_jo_variablebonus'})) {
                    rec.setValue({
                        fieldId: 'bonustarget',
                        value: parseFloat(recOffer.getValue({fieldId: 'custrecord_jo_variablebonus'})) / 4
                    });
                }

                //		rec.selectNewLine({
                //            sublistId: 'roles'
                //        });
                //
                //		rec.setCurrentSublistValue({
                //			sublistId : 'roles',
                //			fieldId : 'selectedrole',
                //			value : 1022
                //		});
                //
                //        rec.commitLine({
                //            sublistId: 'roles'
                //        });
                var employeeid = "";
                if (!rec.getValue("employeestatus")) {
                    employeeid = rec.save({enableSourcing: false, ignoreMandatoryFields: true});
                    if (employeeid) {
                        recOffer.setValue({fieldId: 'custrecord_sr_off_employee', value: employeeid});
                        recOffer.save({enableSourcing: false, ignoreMandatoryFields: true});
                    }
                }


                return employeeid;

            } catch (err) {
                log.audit({
                    title: 'Employee Creation Error',
                    details: err
                });
            }
        };

        function setEmailOfEmployee(recOffer) {
            var stFirstName = recOffer.getValue("custrecord_jo_firstname") ? recOffer.getValue("custrecord_jo_firstname") : '';
            var stLastName = recOffer.getValue("custrecord_jo_lastname") ? recOffer.getValue("custrecord_jo_lastname") : '';

            if (stFirstName && stLastName) {
                var stEmail = stFirstName + '.' + stLastName + '@servicerocket.com';
                log.audit('stEmail', stEmail.toLowerCase());
            }

            return stEmail;
        }

        getSubsidiaryPayrollDay = function (intSubsidiaryId) {
            var stPayrollDay = "";
            var stQuery = "SELECT id, custrecord_sr_payroll_day_of_month FROM subsidiary WHERE id=" + intSubsidiaryId;
            var arrSubsidiaryRecord = query.runSuiteQL({query: stQuery}).asMappedResults();
            if (arrSubsidiaryRecord.length != 0) {
                arrSubsidiaryRecord.forEach(function (result) {
                    stPayrollDay = result.custrecord_sr_payroll_day_of_month;
                });
            }
            stPayrollDay = stPayrollDay.replace(/[^0-9]/g, "");
            return stPayrollDay;
        }

        getSubsidiaryTimeZone = function (intSubsidiaryId) {
            var recSubsidiary = record.load({type: "subsidiary", id: intSubsidiaryId, isDynamic: true});
            return recSubsidiary.getValue("TIMEZONE");
        }

        getAdjustmentCycleId = function (stYear, stMonth) {
            var intAdjustmentCycleId = "";
            var stAdjustmentName = 'ADJUSTCYCLE-' + stYear + '.' + stMonth;
            var stQuery = "SELECT id FROM customrecord_sr_adjustmentcycle WHERE name='" + stAdjustmentName + "'";
            var arrAdjustmentCycleRecord = query.runSuiteQL({query: stQuery}).asMappedResults();
            if (arrAdjustmentCycleRecord.length != 0) {
                arrAdjustmentCycleRecord.forEach(function (result) {
                    intAdjustmentCycleId = result.id;
                });
            }
            return intAdjustmentCycleId;
        }

        getFormattedDate = function (stDate) {
            var month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            var month_names_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var objMonth = {
                'Jan': 1,
                'Feb': 2,
                'Mar': 3,
                'Apr': 4,
                'May': 5,
                'Jun': 6,
                'Jul': 7,
                'Aug': 8,
                'Sep': 9,
                'Oct': 10,
                'Nov': 11,
                'Dec': 12
            };

            var arrDate = stDate.split('/');
            switch (stDatePreference) {
                case 'M/D/YYYY':
                case 'MM/DD/YYYY':
                    var strdate = arrDate[0] + '/' + arrDate[1] + '/' + arrDate[2];
                    return strdate;
                    break;
                case 'D/M/YYYY':
                case 'DD/MM/YYYY':
                    var strdate = arrDate[1] + '/' + arrDate[0] + '/' + arrDate[2]; //MM/DD/YYYY
                    return strdate;
                    break;
                case 'D-Mon-YYYY':
                case 'DD-Mon-YYYY':
                    var strdate = arrDate[1] + '-' + month_names_short[arrDate[0] - 1] + '-' + arrDate[2] //MM/DD/YYYY
                    return strdate;
                    break;
                case 'D.M.YYYY':
                case 'DD.MM.YYYY':
                    var strdate = arrDate[1] + '.' + arrDate[0] + '.' + arrDate[2];
                    return strdate;
                    break;
                case 'D-MONTH-YYYY':
                case 'DD-MONTH-YYYY':
                    var strdate = arrDate[1] + '-' + month_names[arrDate[0] - 1] + '-' + arrDate[2];
                    return strdate;
                    break;
                case 'D MONTH, YYYY':
                case 'DD MONTH, YYYY':
                    var strdate = new Date(stDate); //MM/DD/YYYY
                    return strdate;
                    break;
                case 'YYYY/M/D':
                case 'YYYY/MM/DD':
                    var strdate = new Date(arrDate[1] + '/' + arrDate[2] + '/' + arrDate[0]); //MM/DD/YYYY
                    return strdate;
                    break;
                case 'YYYY-M-D':
                case 'YYYY-MM-DD':
                    var strdate = new Date(arrDate[1] + '/' + arrDate[2] + '/' + arrDate[0]); //MM/DD/YYYY
                    return strdate;
                    break;
            }
        }

        getTimeOffPlans = function () {
            var objTimeOffPlans = {};
            var arrTimeOffPlans = query.runSuiteQL({
                query: "select id, subsidiary from timeoffplan where isinactive='F'"
            }).asMappedResults();

            if (arrTimeOffPlans.length != 0) {
                arrTimeOffPlans.forEach(function (timeoffplan) {
                    if (objTimeOffPlans[timeoffplan.subsidiary] == null) {
                        objTimeOffPlans[timeoffplan.subsidiary] = "";
                    }
                    objTimeOffPlans[timeoffplan.subsidiary] = timeoffplan.id;
                });
            }
            return objTimeOffPlans;
        }

        getEmployeeId = function (stFirstName, stLastName) {
            var intEmployeeId = "";
            var employeeSearchObj = search.create({
                type: "employee",
                filters: [
                    ["isinactive", "is", "F"], "AND",
                    ["firstname", "is", stFirstName], "AND",
                    ["lastname", "is", stLastName]
                ],
                columns: [
                    search.createColumn({name: "entityid", sort: search.Sort.ASC}),
                    search.createColumn({name: "subsidiary"})
                ]
            });
            var searchResultCount = employeeSearchObj.runPaged().count;
            if (searchResultCount != 0) {
                employeeSearchObj.run().each(function (result) {
                    intEmployeeId = result.id;
                    return false;
                });
            }
            return intEmployeeId;
        }

        getSubsidiaries = function () {
            var objSubsidiaries = {};
            var subsidiarySearchObj = search.create({
                type: "subsidiary",
                filters: ["isinactive", "is", "F"],
                columns: [search.createColumn({name: "name"})]
            });
            var searchResultCount = subsidiarySearchObj.runPaged().count;
            if (searchResultCount != 0) {
                subsidiarySearchObj.run().each(function (result) {
                    if (objSubsidiaries[result.getValue({name: "name"})] == null) {
                        objSubsidiaries[result.getValue({name: "name"})] = "";
                    }
                    objSubsidiaries[result.getValue({name: "name"})] = result.id;
                    return true;
                });
            }
            return objSubsidiaries;
        }

				onboardEmployeeFolder = function (options) {
					try {
						var stRecId = options.id;
						var strecType = options.type;

						var sSql = file.load({
							id: 313862 // ../sql/getemployee.sql
						}).getContents();

						var objEmployee = query.runSuiteQL({
							query: sSql,
							params: [stRecId]
						}).asMappedResults()[0];

						var recMapping = record.load({type: 'customrecord_integration_mapping', id: 134});
						var jsonMap = JSON.parse(recMapping.getValue('custrecord_intmap_mapping'));
						var subsidiary = jsonmapns.jsonGetValue({
							mapping: jsonMap,
							data: objEmployee,
							key: 'subsidiary'
						});
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

						var stParentId = useExistingFolderid(objParentFolder);// accepts Box's callback to re-align error

						if (!!stParentId)
							for (var stSubFolderCTR = 0; stSubFolderCTR < arrEmpSubFolder.length; stSubFolderCTR++) {
								options.objFolder = {
									name: arrEmpSubFolder[stSubFolderCTR],
									parent: parseInt(stParentId),
								}
								folder.create(options);
							}
						return {response: 'successful', message: 'employee folders created', rootFolder:stParentId}

					} catch (e) {
						return {
							response: 'failed',
							message: 'failed in creating Folder',
							err: e
						}
					}
				};
			var addCollabs = function (arrOptions) {
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
				function getCollabBySubsidiary(options) {
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

			var useExistingFolderid = function (objParentFolder) {
				var stParentId = null
				if(objParentFolder.status == "failed"){
					var objErrorJson = JSON.parse(objParentFolder.json)
					if(objErrorJson.status == 409)
						stParentId = objErrorJson.context_info.conflicts[0].id
				}else
					stParentId = objParentFolder.id
				return stParentId
			};

			return {
				create: create,
				update: update,
				onboardEmployeeFolder:onboardEmployeeFolder,
				addCollabs:addCollabs
			};

    });
