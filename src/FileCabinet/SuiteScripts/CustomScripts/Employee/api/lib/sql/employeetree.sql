SELECT employee.id AS internalid
	, employee.entityid
	, employee.custentity_employeetree AS employeelevel
	, supervisor.custentity_employeetree AS supervisorlevel
FROM employee
INNER JOIN employee AS supervisor
	ON employee.supervisor = supervisor.id
WHERE employee.id = {{id}}
{{}}
SELECT employee.id AS internalid
	, employee.entityid
	, employee.custentity_employeetree AS employeelevel
	, supervisor.custentity_employeetree AS supervisorlevel
FROM employee
INNER JOIN employee AS supervisor
	ON employee.supervisor = supervisor.id
WHERE employee.supervisor IN ({{ids}})