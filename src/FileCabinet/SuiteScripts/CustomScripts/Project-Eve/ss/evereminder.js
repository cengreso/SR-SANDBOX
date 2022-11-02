/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */

define(['../api/library/evehelper', 'N/https', 'N/runtime'],

	(evehelper, https, runtime) => {

		/**
		 * Defines the Scheduled script trigger point.
		 * @param {Object} scriptContext
		 * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
		 * @since 2015.2
		 */
		const execute = (scriptContext) => {
			try {
				var scriptObj = runtime.getCurrentScript();
				var projects = evehelper.getprojectsss();
				var consoled = evehelper.mergeIds(projects);

				for (var key in consoled) {
					var proj = consoled[key];

					var payload = {
						"event": "rag",
						"name":proj.name,
						"recipient": [proj.workplaceid],
						"message-type": "reminder",
						"project": proj.projects
					}
					log.debug('payload',payload)
					for (var [i, project] of proj.projects.entries()) {
						proj.projects[i]['project-manager'] = project.projectmanagername
						proj.projects[i]['name'] = project.projectname
						proj.projects[i]['url'] = evehelper.projectURL(project.id)
					}
					log.debug('payload',payload)
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

				log.debug('----DONE EXECUTING----','Governance Left:'+ scriptObj.getRemainingUsage());
			} catch (e) {
				log.debug('e', e)
			}
		}

		return {execute}

	});
