SELECT
	project.id as id,
	project.entitytitle as title,
	project.projectmanager as manager_id,
	BUILTIN.DF(project.projectmanager) as manager_name,
	emp.custentity_workplace_id as workplaceid
FROM job AS project
LEFT JOIN employee AS emp
	ON project.projectmanager = emp.id
WHERE project.entitytitle = ?