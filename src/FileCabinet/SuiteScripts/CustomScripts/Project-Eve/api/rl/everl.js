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
