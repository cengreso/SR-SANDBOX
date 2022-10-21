SELECT
	project.entitytitle as title,
	project.projectmanager as manager,
	emp.custentity_workplace_id as workplaceid
FROM job AS project
LEFT JOIN employee AS emp
	ON project.projectmanager = emp.id
WHERE project.id = ?