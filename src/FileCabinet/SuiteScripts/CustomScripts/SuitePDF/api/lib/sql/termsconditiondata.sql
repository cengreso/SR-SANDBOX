SELECT entityid AS name
	, employee.subsidiary AS subsidiaryid
	, BUILTIN.DF(employee.subsidiary) AS subsidiary
FROM employee
WHERE id = ?