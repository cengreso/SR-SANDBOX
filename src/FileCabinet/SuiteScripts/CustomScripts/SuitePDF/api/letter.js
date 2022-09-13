define(['./lib/promotionletter', './lib/salaryadjustmentletter', './lib/termsconditions', './lib/offerletter', './lib/subsidiaryallowance'],

function(promotionletter, salaryadjustmentletter, termsconditions, offerletter, subsidiaryallowance) {

	generatePromotion =  function (option){
		return promotionletter.generate(option);
	};
	
	generateSalaryAdjustment = function(option){
		
		return salaryadjustmentletter.generate(option);

	};

	generateTermsCondition = function(option){
		
		return termsconditions.generate(option);

	};
	
	generateOffer = function(option){
		
		return offerletter.generate(option);

	};
	
	generateSubsidiaryAllowance = function(option){
		
		return subsidiaryallowance.generate(option);

	};
	
    return {
    	generatePromotion: generatePromotion,
    	generateSalaryAdjustment: generateSalaryAdjustment,
    	generateTermsCondition: generateTermsCondition,
    	generateOffer: generateOffer,
    	generateSubsidiaryAllowance: generateSubsidiaryAllowance
    };
    
});
