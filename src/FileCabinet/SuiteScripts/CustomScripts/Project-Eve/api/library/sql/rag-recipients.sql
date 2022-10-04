SELECT
	project.entitytitle as title,
	project.datecreated as datecreated,
	project.projectmanager as manager_id,
	BUILTIN.DF(project.projectmanager) as manager_name,
FROM job AS project
LEFT JOIN employee AS emp
	ON project.projectmanager = emp.id
WHERE
	project.datecreated <= TO_DATE( BUILTIN.RELATIVE_RANGES( 'LW', 'START'), 'DD-MM-YYYY')
	AND
	custentity_rag_summary IS NULL
	AND
	emp.custentity_workplace_id = ?