SELECT
    project.id as id,
	project.entityid as projectid,
	project.companyname as projectname,
	project.datecreated as projdatecreated,
	ragstat.custrecord_rgs_date as ragdatecreated,
	project.projectmanager as managerid,
	BUILTIN.DF(project.projectmanager) as projectmanagername,
	emp.custentity_workplace_id as workplaceid,
	ragstat.id as ragid,

	CASE WHEN project.projectmanager = emp.id THEN 'true'
	    ELSE 'false'
	    END AS isManager,

	BUILTIN.DF(emp.id) as employeename,
	emp.id as employeeid,

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
	(BUILTIN.RELATIVE_RANGES( 'TODAY', 'START' )
		NOT BETWEEN
			TO_DATE(
				(CASE
					WHEN ragstat.id IS NULL
					THEN project.datecreated
					ELSE ragstat.custrecord_rgs_date
					END
			),  'DD-Mon-YYYY' )
			AND
			TO_DATE(
				(CASE
					WHEN ragstat.id IS NULL
					THEN project.datecreated+7
					ELSE ragstat.custrecord_rgs_date+7
					END
			),  'DD-Mon-YYYY' )
	)
	AND emp.custentity_workplace_id = ?
	AND
		resource.jobResource = emp.id
	AND
		project.entitystatus != 1
	AND
		project.entitystatus != 4
