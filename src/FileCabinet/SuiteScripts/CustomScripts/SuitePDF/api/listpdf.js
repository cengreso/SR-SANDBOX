define(['./lib/allowancetable'],

function(allowancetable) {
   
	generateAllowanceTable =  function (option){
		return allowancetable.generate(option);
	};
	
	
    return {
    	generateAllowanceTable: generateAllowanceTable
    };
    
});
