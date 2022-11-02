/**
 * @NApiVersion 2.1
 */
define(['N/https', 'N/query', 'N/file', 'N/url', 'N/record'],
	function (https, query, file, url, record) {
		var MAPPING = {
			colorid: "custrecord_rgs_status",
			summary: "name",
			description: "custrecord_rgs_notes",
			projectid: "custrecord_rgs_project",
			workplaceid: "custpage_workplaceid"
		}
		var objectFunc = {}
		objectFunc.create = function (options) {
			try {
				log.debug('objectFunc.create',"<===== create Rag Start =====>")
				log.debug('options', options)
				var sSql = file.load({
					id: 315861 // rag-getproject.sql
				}).getContents();

				var getproject = query.runSuiteQL({
					query: sSql,
					params: [options.name]
				}).asMappedResults()[0];

				options.projectid = getproject.id
				options.colorid = this.getRagColor(options.status).id

				var recrag = record.create({type: 'customrecord_rag_status'});

				for (var key in MAPPING)
					recrag.setValue({fieldId: MAPPING[key], value: options[key]});

				var isresourced = this.isResourced({id:options.workplaceid, projname:options.name});

				if (isresourced){
					var ragid = recrag.save()
					return {
						status: 'SUCCESS',
						message: "Rag is created id:" + ragid,
					}
				} else {
					return {
						status: 'FAILED',
						message: "Your request is invalid, you are not related to the Project"
					}
				}
			} catch (e) {
				log.debug('e',e)
				return {
					status: "FAILED",
					message: e
				}
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
				id: 315861
			}).getContents();

			return query.runSuiteQL({
				query: sSql,
				params: [obj.projectid]
			}).asMappedResults()[0];
		}
		objectFunc.get = function (workplaceid) {
			try {
				if (!workplaceid)
					return
				var sSql = file.load({
					id: 315663,
				}).getContents();
				var projects = query.runSuiteQL({
					query: sSql,
					params: [workplaceid]
				}).asMappedResults();
				var emp = objectFunc.getempbywpid(workplaceid)
				var output = {
					id: emp.id,
					name: emp.name,
					workplaceid: emp.workplaceid,
					projects: []
				};
				for (var i = 0; i < projects.length; i++) {
					var project = projects[i], datecreated, ignore = false;
					if(project.ismanager == "true")
						project.ismanager = true;
					else
						project.ismanager = false;
					if (project.ragid)
						datecreated = project.ragdatecreated;
					else
						datecreated = project.projdatecreated;
					output['projects'].push({
						id: project.id,
						projectid: project.projectid,
						projectname: project.projectname,
						projectmanagername:project.projectmanagername,
						datecreated: datecreated,
						url: this.projectURL(project.id),
						ismanager: project.ismanager
					});
				}
				log.debug('output', output);
				return output
			} catch (e) {
				log.debug('e', e)
			}
		}
		objectFunc.getprojectsss = function () { // SS will be put to MR project reminder
			var sSql = file.load({
				id: 315663,
			}).getContents();

			var res = query.runSuiteQL({
				query: sSql.replace(`AND emp.custentity_workplace_id = ?`,''),
			}).asMappedResults();
			log.debug('getprojects', res)
			return res
		}
		objectFunc.mergeIds = function (list) {
			const out = {};
			log.debug('list',list);
			for (entry of list) {
				var objout = Object.keys(out);
				if (entry.employeeid) {
					var existingEntry = objout.includes('ent_' + entry.employeeid);
					if (existingEntry) {
						out['ent_' + entry.employeeid]["projects"].push(entry);
					} else {
						out['ent_' + entry.employeeid] = {
							id:entry.id,
							name:entry.employeename,
							workplaceid:entry.workplaceid,
							projects:[entry],
						};
					}
					log.debug('out', out)
				}
			}
			return out;
		}
		objectFunc.getemployee = function (obj) {
			var sSql = file.load({
				id: 315761
			}).getContents();
			log.debug('SQL', sSql)
			var employee = query.runSuiteQL({
				query: sSql,
				params: [obj.id]
			}).asMappedResults()[0];
			log.debug('employee', employee);
			return employee;
		}
		objectFunc.getempbywpid = function (workplaceid) {
			return query.runSuiteQL({
				query: 'SELECT id,BUILTIN.DF(id) as name, custentity_workplace_id as workplaceid FROM employee WHERE custentity_workplace_id = ' + workplaceid,
			}).asMappedResults()[0];
		}
		objectFunc.isResourced = function (obj) {
			var retMe = false;
			var sSql = file.load({
				id: 316061
			}).getContents();
			log.debug('SQL', obj)
			var resourced = query.runSuiteQL({
				query: sSql,
				params: [obj.projname, obj.id]
			}).asMappedResults();
			log.debug('resourced', resourced);
			if(resourced.length)
				retMe = true
			return retMe
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
