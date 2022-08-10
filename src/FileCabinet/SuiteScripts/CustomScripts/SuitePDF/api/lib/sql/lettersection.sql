SELECT CONCAT( sectionlink.custrecord_dsl_sectionnumber, CONCAT ('. ', section.custrecord_sr_docsec_heading)) AS heading
	, section.custrecord_sr_docsec_body  AS body
FROM customrecord_sr_docsec_link sectionlink
INNER JOIN customrecord_sr_docsection section
	ON sectionlink.custrecord_sr_docsec_list = section.id
WHERE sectionlink.custrecord_sr_doc = ? 
	AND (sectionlink.custrecord_dsl_specificsubsidiary = 1 
		OR sectionlink.custrecord_dsl_specificsubsidiary IS NULL
		OR sectionlink.custrecord_dsl_specificsubsidiary = ?)
ORDER BY sectionlink.custrecord_dsl_sectionnumber