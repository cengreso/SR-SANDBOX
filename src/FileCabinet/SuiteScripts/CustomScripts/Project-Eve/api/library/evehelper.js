/**
 * @NApiVersion 2.1
 */
define(['N/https', 'N/query', 'N/file', 'N/url', 'N/record'],
	function (https, query, file, url, record) {
		var MAPPING = {
			rgs_colorid:"custrecord_rgs_status",
			rgs_name:"name",
			rgs_description:"custrecord_rgs_notes",
			rgs_projectid:"custrecord_rgs_project"
		}
		var objectFunc = {}
		objectFunc.createrag = function (options) {
			log.debug('options', options)

			var sSql = file.load({
				id: 313460
			}).getContents();
			var getproject = query.runSuiteQL({
				query: sSql,
				params: [options.rgs_name]
			}).asMappedResults()[0];
			log.debug('getproject',getproject)
			options.rgs_projectid = getproject.id
			options.rgs_colorid = this.getRagColor(options.rgs_status).id

			log.debug('newoptions', options)
			var recrag = record.create({
				type:'customrecord_rag_status',
			});
			for (var key in MAPPING) {
				log.debug(MAPPING[key]+': '+key, options[key])
				recrag.setValue({
					fieldId: MAPPING[key],
					value: options[key]
				});
			}
			var ragid = recrag.save()
			log.debug('Rag Created', ragid)
		}
		objectFunc.getRagColor = function (color) {
			return query.runSuiteQL({
				query: "SELECT id, name FROM customrecord_traffic_light where UPPER(name) LIKE UPPER('%"+color+"%')",
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
		objectFunc.getprojects = function (obj) {
			log.debug('getprojects', obj)
			var sSql = file.load({
				id: 313056,
			}).getContents();
			return query.runSuiteQL({
				query: sSql,
				params: [obj.workplaceid]
			}).asMappedResults();
		}
		objectFunc.getprojectsss = function (obj) {
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
			const out = [];
			try {
				for (var i = 0; i < entry.length; i++) {
					log.debug('entry',entry[i])
					var objout = Object.keys(out)
					if (entry[i].manager_id) {
						var existingEntry = objout.includes(entry.manager_id.toString());
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
