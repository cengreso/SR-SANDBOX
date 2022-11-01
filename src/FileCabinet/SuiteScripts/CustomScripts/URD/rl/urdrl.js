/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */
define(['../../Project-Eve/Eve.js'],
    (eve) => {
        const get = (requestParams) => {
        }
        const post = (requestBody) => {
					try{
						log.debug('POST', requestBody)
						if (requestBody.action == 'create' && requestBody.type == "rag") {
							return eve.createrag(requestBody);
						} else if (requestBody.action == 'getprojects' && requestBody.type == "rag") {
							return eve.getprojects(requestBody.workplaceid);
						} else
							return{status:'failed', message: 'no bot identified'}
					} catch (e) {
						return {
							status:'FAILED',
							message:e
						}
					}
        }

        return {get, post}

    });
