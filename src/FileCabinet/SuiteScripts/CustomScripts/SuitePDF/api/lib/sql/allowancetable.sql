SELECT
	BUILTIN.DF(subsidiary.country) || ' ' || custrecord_sr_subsidiary_flag  as country,
	BUILTIN.DF(allowance.custrecord_sr_allowance_subsidiary) as subsidiary,
	BUILTIN.DF(allowance.custrecord_sr_subsidiary_allowance_type) as allowance,
	currency. displaysymbol || TO_CHAR(allowance.custrecord_sr_subsidiary_allowance_amt, '99,999,999.00') as amount,
	allowance.custrecord_sr_allowance_effective_date as effective_date

FROM
	CUSTOMRECORD_SR_SUBSIDIARY_ALLOWANCE_AMT allowance, Subsidiary subsidiary, Currency
where
allowance.custrecord_sr_allowance_subsidiary = subsidiary.id
and allowance.custrecord_sr_allowance_crrncy = currency.id
and
 allowance.isinactive = 'F'
and allowance.custrecord_sr_allowance_effective_date = 

 (
 select  MAX(allowance2.custrecord_sr_allowance_effective_date)
	from CUSTOMRECORD_SR_SUBSIDIARY_ALLOWANCE_AMT allowance2 where
	allowance.custrecord_sr_subsidiary_allowance_type = allowance2.custrecord_sr_subsidiary_allowance_type and
	allowance.custrecord_sr_allowance_subsidiary = allowance2.custrecord_sr_allowance_subsidiary
	)
and BUILTIN.DF(allowance.custrecord_sr_subsidiary_allowance_type) not in ('Wellness Allowance 1.0')

ORDER BY
BUILTIN.DF(subsidiary.country) ,	BUILTIN.DF(allowance.custrecord_sr_allowance_subsidiary) ,
	BUILTIN.DF(allowance.custrecord_sr_subsidiary_allowance_type) ,
	allowance.custrecord_sr_allowance_effective_date