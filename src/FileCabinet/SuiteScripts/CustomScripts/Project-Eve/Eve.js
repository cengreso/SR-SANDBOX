/**
 * @NApiVersion 2.x
 */
define(['./api/library/evehelper.js'],
	function (evehelper) {

		function remind(options) {
			log.debug('remind', options)
			try {
				// evehelper.post(options)
			} catch (e) {
				log.debug('e',e)
			}
		}

		return {
			remind: remind,
		}

	});
