SELECT BUILTIN.DF(allowance.custrecord_sr_allowance_subsidiary) AS subsidiary_grouped
	, SUM(CASE WHEN BUILTIN.DF(allowance.custrecord_sr_subsidiary_allowance_type) = 'Tech Choice 2.0 Level 1' 
			THEN allowance.custrecord_sr_subsidiary_allowance_amt  ELSE 0 END) AS  level1
	, SUM(CASE WHEN BUILTIN.DF(allowance.custrecord_sr_subsidiary_allowance_type) = 'Tech Choice 2.0 Level 2' 
			THEN allowance.custrecord_sr_subsidiary_allowance_amt  ELSE 0 END) AS  level2
	, SUM(CASE WHEN BUILTIN.DF(allowance.custrecord_sr_subsidiary_allowance_type) = 'Tech Choice 2.0 Level 3' 
			THEN allowance.custrecord_sr_subsidiary_allowance_amt  ELSE 0 END) AS  level3
	, MAX(allowance.custrecord_sr_allowance_effective_date) AS effective_date
	, BUILTIN.DF(allowance.custrecord_sr_allowance_crrncy) AS currency_name
	, currency.symbol AS currency_code
	, currency.displaysymbol AS currency_symbol
FROM customrecord_sr_subsidiary_allowance_amt allowance
INNER JOIN currency
	ON allowance.custrecord_sr_allowance_crrncy = currency.id
WHERE allowance.custrecord_sr_allowance_effective_date <= CURRENT_DATE
GROUP BY BUILTIN.DF(allowance.custrecord_sr_allowance_subsidiary)
	, BUILTIN.DF(allowance.custrecord_sr_allowance_crrncy)
	, currency.symbol	
	, currency.displaysymbol
ORDER BY BUILTIN.DF(allowance.custrecord_sr_allowance_subsidiary)