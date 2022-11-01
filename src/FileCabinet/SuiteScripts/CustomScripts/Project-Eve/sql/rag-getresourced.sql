SELECT
    project.id as id,
	project.entityid as projectid,
	project.companyname as projectname,
	BUILTIN.RELATIVE_RANGES( 'TODAY', 'END' ) as today,
	BUILTIN.DF(project.projectmanager) as projectmanagername,
	emp.custentity_workplace_id as workplaceid,
	ragstat.id as ragid,
	CASE WHEN project.projectmanager = emp.id THEN 'true'
	ELSE 'false'
	END AS isManager
FROM job AS project
LEFT JOIN customrecord_rag_status ragstat
	ON project.custentity_rag_summary = ragstat.id
LEFT JOIN jobResources resource
	ON resource.project = project.id
LEFT JOIN employee AS emp
	ON resource.jobResource = emp.id
WHERE
	project.projectmanager IS NOT NULL
	AND
		project.entityid = ?
	AND
	(
		emp.custentity_workplace_id = ?
	AND
		resource.jobResource = emp.id
	)