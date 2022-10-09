define(['N/record', './lib/employeetree', './lib/employeeaccess'],

    function (record, employeetree, employeeaccess) {

        updateFuncMapFields = function (newRec) {

            try {
                var recEmployee = record.load({type: newRec.type, id: newRec.id, isDynamic: true});

                var recHcm = record.load({type: 'hcmjob', id: recEmployee.getValue({fieldId: 'job'}), isDynamic: true});
                recHcm = hcmfmupdate.updateFuncMapFields(newRec);
                recHcm.save();
            } catch (e) {
                log.debug('ERROR', e);
            }
        };

        updateEmployeeTree = function (option) {

            return employeetree.update(option);
        };

        getDirectReport = function (option) {

            return employeetree.getDirectReport(option);
        };

        getAllReport = function (option) {

            return employeetree.getAllReport(option);
        };

        grantAccess = function () {
            return employeeaccess.settingAccess();
        }

        return {
            updateFuncMapFields: updateFuncMapFields,
            updateEmployeeTree: updateEmployeeTree,
            getDirectReport: getDirectReport,
            getAllReport: getAllReport,
            grantAccess: grantAccess
        };

    });
