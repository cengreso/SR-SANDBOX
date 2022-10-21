SELECT
    project.id as id,
	project.entityid as projectid,
	project.companyname as projectname,
	project.datecreated as datecreated,
	project.projectmanager as managerid,
	BUILTIN.DF(project.projectmanager) as managername,
	emp.custentity_workplace_id as workplaceid,
	ragstat.id as ragid,
FROM job AS project
LEFT JOIN employee AS emp
	ON project.projectmanager = emp.id
LEFT JOIN customrecord_rag_status ragstat
	ON project.custentity_rag_summary = ragstat.id
WHERE
	project.projectmanager IS NOT NULL
	AND
	emp.custentity_workplace_id = ?