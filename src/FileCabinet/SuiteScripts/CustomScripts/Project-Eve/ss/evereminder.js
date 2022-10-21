/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */

define(['../api/library/evehelper', 'N/https'],

	(evehelper, https) => {

		/**
		 * Defines the Scheduled script trigger point.
		 * @param {Object} scriptContext
		 * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
		 * @since 2015.2
		 */
		const execute = (scriptContext) => {
			try {
				var projects = evehelper.getprojectsss()
				var consolidated = mergeIds(projects)
				log.debug('consolidated', consolidated)

				for (var empkey in consolidated) {
					var proj = consolidated[empkey]
					var payload = {
						"event": "rag",
						"recipient": [String(proj[0].workplaceid)],
						"message-type": "reminder",
						"project": []
					}
					for (var projElement of proj) {
						payload['project'].push({
							"name": projElement.title,
							"project-manager": projElement.manager_name,
							"url": evehelper.projectURL(projElement.id)
						});
					}
					log.debug('payload', payload)
					var objResp = https.post({
						url: 'https://us-central1-itsm-932-infraops.cloudfunctions.net/urd-on2wp-bot-notification-ingestor-dev-main',
						body: JSON.stringify(payload),
						headers: {
							'Content-Type': 'application/json',
							'X-Signature': '{custsecret_eve_apikey}',
						},
						credentials: ['custsecret_eve_apikey']
					});
					log.debug('objResp', objResp);
				}
				log.debug('----DONE EXECUTING----');
			} catch (e) {
				log.debug('e', e)
			}
		}

		function mergeIds(list) {
			const out = {};
			for (entry of list) {
				var objout = Object.keys(out);
				if (entry.manager_id) {
					var existingEntry = objout.includes('ent_' + entry.manager_id.toString());
					if (existingEntry) {
						out['ent_' + entry.manager_id].push(entry);
					} else {
						out['ent_' + entry.manager_id] = [entry];
					}
				}
			}
			return out;
		}

		return {execute}

	});
