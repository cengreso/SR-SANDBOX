/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/redirect', 'N/runtime', 'N/query', 'N/file'],
    /**
     * @param {redirect} redirect
     * @param {runtime} runtime
     * @param {query} query
     * @param {file} file
     */

    (redirect, runtime, query, file) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {
            try {
                log.debug('Start');
                var inCurrentUser = runtime.getCurrentUser().id;
                // var inCurrentUser = 7130;
                log.debug('inCurrentUser', inCurrentUser);
                var recType = 1474;
                var recId = null;

                var sSql = file.load({
                    // id: 309748 //bankinfo.sql
                    id: '../sql/bankinfo.sql'
                }).getContents();

                var arrBankInfo = query.runSuiteQL({
                    query: sSql,
                    params: [inCurrentUser]
                }).asMappedResults();
                log.debug('arrBankInfo', arrBankInfo);

                if (arrBankInfo.length > 0) {
                    for (var indx in arrBankInfo) {
                        var objBankInfo = arrBankInfo[indx];
                        log.debug('objBankInfo', objBankInfo);

                        // if (inCurrentUser == objBankInfo.empid) {
                        recId = objBankInfo.bankinfoid;
                        // }
                    }
                }

                redirect.redirect({
                    url: '/app/common/custom/custrecordentry.nl?rectype=' + recType + '&id=' + recId
                });
            } catch (e) {
                log.debug('error', e);
            }
        }

        return {onRequest}

    });
