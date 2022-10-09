/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 * @NModuleScope SameAccount
 */
define(['../api/jira', '../../Project-Eve/api/library/evehelper.js', 'N/runtime'],

	function (jira, evehelper, runtime) {

		/**
		 * Function called upon sending a GET request to the RESTlet.
		 *
		 * @param {Object} requestParams - Parameters from HTTP request URL; parameters will be passed into function as an Object (for all supported content types)
		 * @returns {string | Object} HTTP response body; return string when request Content-Type is 'text/plain'; return Object when request Content-Type is 'application/json'
		 * @since 2015.1
		 */
		function doGet(requestParams) {
			return 'sadasdsad'

		}

		/**
		 * Function called upon sending a PUT request to the RESTlet.
		 *
		 * @param {string | Object} requestBody - The HTTP request body; request body will be passed into function as a string when request Content-Type is 'text/plain'
		 * or parsed into an Object when request Content-Type is 'application/json' (in which case the body must be a valid JSON)
		 * @returns {string | Object} HTTP response body; return string when request Content-Type is 'text/plain'; return Object when request Content-Type is 'application/json'
		 * @since 2015.2
		 */
		function doPut(requestBody) {

		}


		/**
		 * Function called upon sending a POST request to the RESTlet.
		 *
		 * @param {string | Object} requestBody - The HTTP request body; request body will be passed into function as a string when request Content-Type is 'text/plain'
		 * or parsed into an Object when request Content-Type is 'application/json' (in which case the body must be a valid JSON)
		 * @returns {string | Object} HTTP response body; return string when request Content-Type is 'text/plain'; return Object when request Content-Type is 'application/json'
		 * @since 2015.2
		 */
		function doPost(requestBody) {

			try {
				log.debug('user role', runtime.getCurrentUser())
				log.debug({title: 'doPost', details:requestBody});

				var retMe = requestBody;

				if (requestBody != undefined && requestBody != '') {
					if (requestBody.action == 'create' && requestBody.record == 'pmojob') {
						retMe = jira.createProject(requestBody);
					} else if (requestBody.action == 'update' && requestBody.record == 'pmojob') {
						retMe = jira.updateProject(requestBody);
					} else if (requestBody.action == 'create' && requestBody.bot == "eve") {
						return evehelper.createrag(requestBody);
					} else if (requestBody.action == 'getproject' && requestBody.bot == "eve"){
						return evehelper.getprojects(requestBody.workplaceid)
					}
				} else {
					retMe = {status: 'FAILED', message: 'Empty request.'};
				}

				log.audit({title: 'doPost', details: 'response ' + JSON.stringify(retMe)});

				return retMe;

			} catch (err) {
				log.audit({title: 'doPost', details: 'error ' + err});
				return {status: 'FAILED', message: err};
			}
		}

		/**
		 * Function called upon sending a DELETE request to the RESTlet.
		 *
		 * @param {Object} requestParams - Parameters from HTTP request URL; parameters will be passed into function as an Object (for all supported content types)
		 * @returns {string | Object} HTTP response body; return string when request Content-Type is 'text/plain'; return Object when request Content-Type is 'application/json'
		 * @since 2015.2
		 */
		function doDelete(requestParams) {

		}

		return {
			'get': doGet,
			put: doPut,
			post: doPost,
			'delete': doDelete
		};

	});
