SELECT custentity_employeetree AS level
	, id AS id
	, entityid AS name
	, supervisor as parentid
	, '' AS team
	, '' AS ids
FROM employee
WHERE isinactive != 'T' 
ORDER BY custentity_employeetree DESC