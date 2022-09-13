define(['./lib/atlinvoice', './lib/invoice','./lib/indiainvoice'],

    function (atlinvoice, invoice, indiainvoice) {

        generate =

            function (option) {

                var sTemplate = '';

                if (option.getValue('class') == 90) { //Resell
                    sTemplate = atlinvoice.generate(option);
                } else if (option.getValue('subsidiary') == 15) {
                    sTemplate = indiainvoice.generate(option);
                } else {
                    sTemplate = invoice.generate(option);
                }

                return sTemplate;

            };

        return {
            generate: generate
        };

    });