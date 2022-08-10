define(['N/record'],

    function (record) {

        settingAccess = function () {
            try {
                var arrEmployee = [1060238, 1060235, 1060647, 1061952, 1060643, 8539, 557, 7130, 9022];
                // var arrEmployee = [1060237, 1060644];

                for (var indxEmployee in arrEmployee) {

                    var recEmployee = record.load({
                        type: record.Type.EMPLOYEE,
                        id: arrEmployee[indxEmployee],
                        isDynamic: true
                    });

                    recEmployee.setValue({
                        fieldId: 'giveaccess',
                        value: true
                    });

                    recEmployee.selectNewLine({
                        sublistId: 'roles'
                    });
                    recEmployee.setCurrentSublistValue({
                        sublistId: 'roles',
                        fieldId: 'selectedrole',
                        value: 1326,// Rocketeer NetSuite Administrator
                        ignoreFieldChange: true
                    });
                    recEmployee.commitLine({
                        sublistId: 'roles'
                    });

                    recEmployee.selectNewLine({
                        sublistId: 'roles'
                    });
                    recEmployee.setCurrentSublistValue({
                        sublistId: 'roles',
                        fieldId: 'selectedrole',
                        value: 1304,// Rocketeer Project Operations (non-SAML)
                        ignoreFieldChange: true
                    });
                    recEmployee.commitLine({
                        sublistId: 'roles'
                    });

                    recEmployee.save();
                }
            } catch (e) {
                log.debug('error', e);
            }
        }

        return {settingAccess: settingAccess}

    });
