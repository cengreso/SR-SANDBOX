/**
 * @NApiVersion 2.x
 */
define(['./api/library/evehelper.js'],
	function (evehelper) {
		var returnObj = {}

		returnObj.createrag = function(options) {
			return evehelper.create(options)
		}
		returnObj.getprojects = function (options) {
			return evehelper.get(options)
		}
		return returnObj

	});
