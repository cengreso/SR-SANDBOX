/**
 * @NApiVersion 2.1
 */
define(['N/https', 'N/query', 'N/file', 'N/url', 'N/record'],
	function (https, query, file, url, record) {
		var MAPPING = {
			colorid: "custrecord_rgs_status",
			name: "name",
			description: "custrecord_rgs_notes",
			projectid: "custrecord_rgs_project"
		}
		var objectFunc = {}
		objectFunc.createrag = function (options) {
			try {
				log.debug('options', options)

				var sSql = file.load({
					id: 313460
				}).getContents();

				var getproject = query.runSuiteQL({
					query: sSql,
					params: [options.name]
				}).asMappedResults()[0];

				log.debug('getproject', getproject)
				options.projectid = getproject.id
				options.colorid = this.getRagColor(options.status).id

				var recrag = record.create({
					type: 'customrecord_rag_status',
				});

				for (var key in MAPPING) {
					recrag.setValue({
						fieldId: MAPPING[key],
						value: options[key]
					});
				}
				var emp = this.getemployee({id: getproject.manager_id})

				log.debug('emp', emp.workplaceid)
				if (emp.workplaceid == options.workplaceid) {
					var ragid = recrag.save()
					log.debug('Rag Created', ragid)
					return {
						status: 'SUCCESS',
						message: "Rag is created\n ragid:" + ragid,
					}
				} else {
					return {
						status: 'FAILED',
						message: "your request is invalid, you are not the project manager"
					}
					log.debug('not created')
				}
			} catch (e) {
				return {
					status: "FAILED",
					message: e
				}
				log.debug('e', e)
			}
		}
		objectFunc.getRagColor = function (color) {
			return query.runSuiteQL({
				query: "SELECT id, name FROM customrecord_traffic_light WHERE UPPER(name) LIKE UPPER('%" + color + "%')",
			}).asMappedResults()[0];
		}
		objectFunc.projectURL = function (id) {
			var scheme = 'https://';
			var host = url.resolveDomain({
				hostType: url.HostType.APPLICATION
			});
			var relativePath = url.resolveRecord({
				recordType: record.Type.JOB,
				recordId: id,
			});
			return scheme + host + relativePath;
		}
		objectFunc.getproject = function (obj) {
			var sSql = file.load({
				id: 312756
			}).getContents();

			return query.runSuiteQL({
				query: sSql,
				params: [obj.projectid]
			}).asMappedResults()[0];
		}
		objectFunc.getprojects = function (workplaceid) {
			log.debug('getprojects', workplaceid)
			var sSql = file.load({
				id: 313056,
			}).getContents();
			var projects = query.runSuiteQL({
				query: sSql,
				params: [workplaceid]
			}).asMappedResults();
			log.debug('projects', projects)
			var output = {
				managerid: projects[0].managerid,
				managername: projects[0].managername,
				workplaceid: projects[0].workplaceid,
				projects: []
			};
			for (var i = 0; i < projects.length; i++) {
				var project = projects[i]
				output['projects'].push({
					id: project.id,
					projectid: project.projectid,
					projectname: project.projectname,
					datecreated: project.datecreated,
					url: this.projectURL(project.id)
				})
			}
			return output
		}
		objectFunc.getprojectsss = function (obj) { // SS will be put to MR project reminder
			var sSql = file.load({
				id: 313156,
			}).getContents();
			var res = query.runSuiteQL({
				query: sSql,
			}).asMappedResults();
			log.debug('getprojects', res)
			return res
		}
		objectFunc.mergeIds = function (entry) {
			log.debug('whole entry', entry)
			const out = {};
			try {
				for (var i = 0; i < entry.length; i++) {
					log.debug('entry', entry[i])
					var objout = Object.keys(out)
					if (entry[i].manager_id) {
						var existingEntry = objout.includes(entry[i].manager_id);
						if (existingEntry) {
							out[entry[i].manager_id].push(entry[i])
						} else {
							out[entry[i].manager_id] = [entry[i]];
						}
					}
				}
				log.debug('out', out)
			} catch (e) {
				log.debug('e', e)
			}
			return out;
		}
		objectFunc.getemployee = function (obj) {
			var sSql = file.load({
				id: 313761
			}).getContents();
			return query.runSuiteQL({
				query: sSql,
				params: [obj.id]
			}).asMappedResults()[0];
		}
		return objectFunc
	});
/*
{
	"event":"rag",
	"recipient":["100086059662703"],
	"message-type":"reminder",
	"name":"EVENT-23",
	"project-manager":"Cornello Engreso",
	"url":"google.com",
	"projectid":"1124888"
}
*/
