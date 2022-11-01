/**
 * @NApiVersion 2.x
 */
define(['./api/library/evehelper.js'],
	function (evehelper) {
		var eve = {}

		eve.createrag = function(options) {
			return evehelper.create(options)
		}
		eve.getprojects = function (options) {
			return evehelper.get(options)
		}
		eve.getempbywpid = function(workplaceid){
			return evehelper.getempbywpid(workplaceid)
		}
		return eve

	});
