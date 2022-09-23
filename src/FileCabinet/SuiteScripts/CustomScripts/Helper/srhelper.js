define(['N/search'],

function(search) {
	
	
	Date.isLeapYear = function (year) { 
	    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0)); 
	};

	Date.getDaysInMonth = function (year, month) {
	    return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
	};

	Date.prototype.isLeapYear = function () { 
	    return Date.isLeapYear(this.getFullYear()); 
	};

	Date.prototype.getDaysInMonth = function () { 
	    return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
	};

	Date.prototype.addMonths = function (value) {
	    var n = this.getDate();
	    this.setDate(1);
	    this.setMonth(this.getMonth() + value);
	    this.setDate(Math.min(n, this.getDaysInMonth()));
	    return this;
	};
	
	isoToNSDateAddMonths = function(sIso, nMonth){
    	
    	var arrDue = (sIso.split('T')[0]).split('-');
    	var retDate = new Date(arrDue[1] + '/' + arrDue[2] + '/' + arrDue[0]);
    	return retDate.addMonths(nMonth);
    };
    
    dateAddMonths = function(dDate, nMonth){
    	return dDate.addMonths(nMonth);
    };
    
    empEmailToInternalId = function(sEmail){
    	    	
		var src = search.create({type: 'employee',  columns: ['internalid']});
	    	src.filters = [];
	    	src.filters.push(search.createFilter({name: 'email', operator: 'is', values: sEmail}));
	    	
	    	var res = src.run().getRange({start: 0, end: 1});
	    	    	
	    	if(res.length > 0){
	    		return res[0].id;
	    	}
	    	else{
	    		return null;
	    	}
    };
	
    return {
    	isoToNSDateAddMonths : isoToNSDateAddMonths,
    	dateAddMonths: dateAddMonths,
    	empEmailToInternalId: empEmailToInternalId
    };
    
});
