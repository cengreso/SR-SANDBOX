SELECT employee.id AS employeeid
	, supervisor.custentity_employeetree + 1 AS employeetree
FROM employee
INNER JOIN employee supervisor
	ON employee.supervisor = supervisor.id
WHERE employee.isinactive = 'F'
	AND employee.supervisor IN ({ids})