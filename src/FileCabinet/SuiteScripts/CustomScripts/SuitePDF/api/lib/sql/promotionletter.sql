SELECT promotion.name AS promotionid
	, BUILTIN.DF(promotion.custrecord_sr_rocketeer) AS name
	, compenhistory.custrecord_sr_hist_effective_date AS date
	, BUILTIN.DF(promotion.custrecord_rp_newjobprofile) AS jobprofile
	, employee.basewage AS currentsalary
	, compenhistory.custrecord_sr_hist_base_wage AS newsalary,
	, compenhistory.custrecord_sr_annual_variable_target  AS newstf
	, compenhistory.custrecord_sr_total_target_comp  AS newtcc
	, employee.compensationcurrency AS currency
	, currency.displaysymbol AS  currencysymbol
	, BUILTIN.DF(employee.subsidiary) AS subsidiary
	, CASE WHEN promotion.custrecord_rp_newmanager IS NULL THEN BUILTIN.DF(employee.supervisor)
		ELSE BUILTIN.DF(promotion.custrecord_rp_newmanager) END AS supervisor
	, CASE WHEN promotion.custrecord_rp_newmanager IS NULL THEN BUILTIN.DF(currentsupervisor.job)
		ELSE BUILTIN.DF(newsupervisor.job) END AS supervisorjob
	, BUILTIN.DF(hrmanager.custentity_atlas_chr_hr_rep) AS hrmanager	
	, stockoption.name AS commitnumber
	, stockoption.custrecord_sr_commit_qty AS stockquantity
FROM customrecord_sr_rocketeer_promotion promotion
INNER JOIN customrecord_sr_compensation_history compenhistory 
	ON promotion.custrecord_sr_comp_history = compenhistory.id
INNER JOIN customrecord_sr_stock_option_commit stockoption 
	ON promotion.custrecord_sr_stock_commitment = stockoption.id
INNER JOIN employee
	ON promotion.custrecord_sr_rocketeer = employee.id
INNER JOIN employee currentsupervisor
	ON employee.supervisor = currentsupervisor.id
LEFT JOIN employee newsupervisor
	ON promotion.custrecord_rp_newmanager = newsupervisor.id
LEFT JOIN employee hrmanager
	ON promotion.custrecord_sr_rocketeer = hrmanager.id
INNER JOIN currency
	ON employee.currency = currency.id
WHERE promotion.id = {{id}}
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