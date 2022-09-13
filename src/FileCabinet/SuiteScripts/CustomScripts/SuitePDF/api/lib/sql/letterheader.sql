SELECT custrecord_sr_doc_title AS title
	, custrecord_sr_doc_sectionheading AS seactionhead
	, custrecord_sr_doc_intro AS introduction
	, custrecord_sr_doc_footer AS footer
FROM customrecord_sr_doc
WHERE id = ?