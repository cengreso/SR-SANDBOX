SELECT custrecord_bi_employee as empid
	,BUILTIN.DF(custrecord_bi_employee) as name
	,id as bankinfoid

FROM customrecord_bankinformation
WHERE custrecord_bi_employee = ?