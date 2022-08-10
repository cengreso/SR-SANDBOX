define(['N/search', 'N/record', '../../../Helper/nstojson', '../../../Helper/jsonmapns', '../../../Library/momentjs/moment','N/runtime'],
	/**
	 * @param {record} record
	 * @param {nstojson} nstojson
	 * @param {jsonmapns} jsonmapns
	 */
	function(search, record, nstojson, jsonmapns, moment, runtime) {
		var userObj = runtime.getCurrentUser();
		var stDatePreference = userObj.getPreference({ name: "dateformat"});

		onboard = function(option){

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

				var rec = record.create({ type: record.Type.EMPLOYEE , isDynamic : true});

				for (var key in objMap) {

					rec = jsonmapns.jsonMap({
						mapping: objMap,
						record: rec,
						data: objRequisition,
						key: key
					});
				}

				var fieldLookUpLocation = search.lookupFields({
					type: search.Type.LOCATION,
					id: recRequisition.getValue("location"),
					columns: ['country']
				});

				rec.selectNewLine({ sublistId: "addressbook" });
				var subrec = rec.getCurrentSublistSubrecord({ sublistId: 'addressbook', fieldId: 'addressbookaddress' });
				subrec.setValue({ fieldId: "country", value: fieldLookUpLocation.country });
				subrec.setValue({ fieldId: "addr1", value: recOffer.getValue({ fieldId: 'custrecord_jo_address1' }) });
				subrec.setValue({ fieldId: "addr2", value: recOffer.getValue({ fieldId: 'custrecord_jo_address2' }) });
				rec.commitLine({ sublistId: "addressbook" });

				if(rec.getValue('hiredate')) {
					var mntHireDate = moment(rec.getValue('hiredate')).add('years', 1).format('L');
					rec.setText({
						fieldId: 'nextreviewdate',
						text: getFormattedDate(mntHireDate)
					});
					// log.audit({
					// 	title: 'mntHireDate._d',
					// 	details: mntHireDate._d
					// });
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


				var employeeid = rec.save();

				if(employeeid) {
					recOffer.setValue({fieldId: 'custrecord_sr_off_employee', value: employeeid});
					var id = recOffer.save();
				}

				return employeeid;

			} catch(err) {
				log.audit({
					title: 'Employee Creation Error',
					details: err
				});
			}
		};

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
					var strdate = arrDate[1] + '-' + month_names_short[arrDate[0]-1] + '-' + arrDate[2] //MM/DD/YYYY
					return strdate;
					break;
				case 'D.M.YYYY':
				case 'DD.MM.YYYY':
					var strdate = arrDate[1] + '.' + arrDate[0] + '.' + arrDate[2];
					return strdate;
					break;
				case 'D-MONTH-YYYY':
				case 'DD-MONTH-YYYY':
					var strdate = arrDate[1] + '-' + month_names[arrDate[0]-1] + '-' + arrDate[2];
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

		return {
			onboard: onboard
		};

	});
