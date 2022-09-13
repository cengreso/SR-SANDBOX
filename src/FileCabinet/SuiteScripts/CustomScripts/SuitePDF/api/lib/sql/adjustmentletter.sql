SELECT adjustment.name AS adjustmentid
	, BUILTIN.DF(adjustment.custrecord_sr_adjust_rocketeer) AS name
	, compenhistory.custrecord_sr_hist_effective_date AS date
	, currency.displaysymbol AS  currencysymbol
	, compenhistory.custrecord_sr_hist_base_wage AS newsalary
	, compenhistory.custrecord_sr_annual_variable_target  AS newstf
	, compenhistory.custrecord_sr_total_target_comp AS newtcc
FROM customrecord_sr_rocketeer_adjustment adjustment
INNER JOIN customrecord_sr_compensation_history compenhistory 
	ON adjustment.custrecord_sr_adjust_comp_history= compenhistory.id
INNER JOIN employee
	ON adjustment.custrecord_sr_adjust_rocketeer= employee.id
INNER JOIN currency
	ON employee.currency = currency.id
WHERE adjustment.id = {{id}}
{{}}
SELECT custrecord_sr_doc_title AS title
	, custrecord_sr_doc_sectionheading AS seactionhead
	, custrecord_sr_doc_intro AS introduction
	, custrecord_sr_doc_footer AS footer
FROM customrecord_sr_doc
WHERE id = {{id}}
{{}}
SELECT CONCAT( sectionlink.custrecord_dsl_sectionnumber, CONCAT ('. ', section.custrecord_sr_docsec_heading)) AS heading
	, section.custrecord_sr_docsec_body  AS body
FROM customrecord_sr_docsec_link sectionlink
INNER JOIN customrecord_sr_docsection section
	ON sectionlink.custrecord_sr_docsec_list = section.id
WHERE sectionlink.custrecord_sr_doc = {{id}}
ORDER BY sectionlink.custrecord_dsl_sectionnumber