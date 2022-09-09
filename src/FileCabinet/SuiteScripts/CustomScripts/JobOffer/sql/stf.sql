SELECT joblevel.custrecord_stf_ratio_guideline AS stf
FROM customrecord_sr_job_profile_level AS jobprofilelevel
INNER JOIN customrecord_sr_job_level AS joblevel
	ON jobprofilelevel.custrecord_jpl_joblevel = joblevel.id
WHERE jobprofilelevel.custrecord_jpl_jobprofile = {{id}}
{{}}