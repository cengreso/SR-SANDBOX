SELECT
    project.id as id,
	project.entitytitle as title,
	project.datecreated as datecreated,
	project.projectmanager as manager_id,
	BUILTIN.DF(project.projectmanager) as manager_name,
	emp.custentity_workplace_id as workplaceid,
	ragstat.id as ragid
FROM job AS project
LEFT JOIN employee AS emp
	ON project.projectmanager = emp.id
LEFT JOIN customrecord_rag_status ragstat
	ON project.custentity_rag_summary = ragstat.id
WHERE
	project.datecreated <= TO_DATE( BUILTIN.RELATIVE_RANGES( 'LW', 'START'), 'DD-MM-YYYY')
	AND
	project.custentity_rag_summary IS NULL
	AND
	project.projectmanager IS NOT NULL
	AND
	ROWNUM <= 5