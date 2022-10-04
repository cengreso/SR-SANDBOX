/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['N/https', 'N/query', 'N/file', 'N/url', 'N/record', '../library/evehelper.js'],
	function (https, query, file, url, record, evehelper) {

		function get(requestParams) {
		}

		function post(requestBody) {
			//requestBody.workplaceid = 100013279155321 // sample
			try {
				log.debug('requestBody', requestBody)
				if (requestBody.rgs_type == "create") {
					var callback = evehelper.createrag(requestBody)
				} else {

					// log.debug('requestParams', requestBody)
					// var projecturl = evehelper.projectURL(requestBody.projectid)
					// log.debug('projecturl', projecturl)
					// // var arrproject = evehelper.getproject({projectid: requestBody.projectid})
					// // log.debug('arrproject', arrproject)
					//
					// if (requestBody.workplaceid) {
					// 	var id = requestBody.workplaceid
					// 	var arrprojects = evehelper.getprojects({workplaceid: id})
					// 	log.debug('arrprojects', arrprojects)
					// }
				}

				return {
					status: 'success',
					message: callback
				}
			} catch (e) {
				log.debug('e', e)
			}
		}

		return {get: get, post: post}


	});
