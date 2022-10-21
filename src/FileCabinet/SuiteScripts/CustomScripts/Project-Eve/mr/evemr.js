/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['../api/library/evehelper.js', 'N/https'],

	(evehelper, https) => {
		const getInputData = (inputContext) => {
			try {
				var projects = evehelper.getprojectsss()
				log.debug('projects',projects)
				var consolidatedProjects = evehelper.mergeIds(projects)
				log.debug('mergeIds(projects)', consolidatedProjects)
				return consolidatedProjects
			} catch (e) {
				log.debug('e', e)
			}
		}

		const map = (mapContext) => {
			log.debug('mapContext',mapContext)
		}

		const reduce = (reduceContext) => {
			log.debug('reduce')
		}

		const summarize = (summaryContext) => {
			log.debug('summarize')
		}

		return {getInputData, map, reduce, summarize}

	});
