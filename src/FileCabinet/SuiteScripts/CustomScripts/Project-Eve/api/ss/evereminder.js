/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */

define(['../library/evehelper', 'N/https'],

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
					log.debug('empdata', consolidated[empkey])
					var proj = consolidated[empkey]
					log.debug('proj', proj)
					for (var projElement of consolidated[empkey]) {
						var payload = {
							"event": "rag",
							"recipient": ["100086059662703"],
							"message-type": "reminder",
							"project": {
								"name": projElement.title,
								"project-manager": projElement.manager_name,
								"url": evehelper.projectURL(projElement.id)
							}
						}
						log.debug('payload', payload)
						var objResp = https.post.promise({
							url: 'https://us-central1-itsm-932-infraops.cloudfunctions.net/urd-on2wp-bot-notification-ingestor-dev-main',
							body: JSON.stringify(payload),
							headers: {
								'Content-Type': 'application/json',
								'X-Signature': '{custsecret_eve_apikey}',
							},
							credentials: ['custsecret_eve_apikey']
						})
						.then((objResp) => log.debug('objResp', objResp))
						.catch((e) => log.debug('e', e));
					}
				}
			} catch (e) {
				log.debug('e', e)
			}
		}

		function mergeIds(list) {
			const out = {};
			for (entry of list) {
				var objout = Object.keys(out);
				if (entry.manager_id) {
					var existingEntry = objout.includes('ent_'+entry.manager_id.toString());
					if (existingEntry) {
						out['ent_'+entry.manager_id].push(entry);
					} else {
						out['ent_'+entry.manager_id] = [entry];
					}
				}
			}
			return out;
		}

		return {execute}

	});
