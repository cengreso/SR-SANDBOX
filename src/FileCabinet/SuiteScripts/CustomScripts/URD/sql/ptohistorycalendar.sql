SELECT 'NETSUITE-' || timeoffrequest.id AS id 
	, 1.0 AS version
	, 'create' AS action
	, employee.firstname AS firstname 
	, employee.lastname AS lastname
	, employee.email AS email
	, BUILTIN.DF(employee.location) AS location
	, CASE WHEN timeoffrequest.approvalstatus = 7 THEN 'planned'
		WHEN timeoffrequest.approvalstatus = 8 THEN 'approved'
		ELSE 'Test'
	 END AS status
	, TO_CHAR( timeoffrequest.startdate, 'YYYY' )  || '-'|| TO_CHAR( timeoffrequest.startdate, 'MM' ) || '-'|| TO_CHAR( timeoffrequest.startdate, 'DD' )  AS startdate 
	, TO_CHAR( timeoffrequest.enddate, 'YYYY' )  || '-'|| TO_CHAR( timeoffrequest.enddate, 'MM' ) || '-'|| TO_CHAR( timeoffrequest.enddate, 'DD' ) AS enddate
	,  employee.firstname  || ' ' || employee.lastname || ' on PTO.' AS summary
	, 'This event is sync from Netsuite.' AS description
	, CASE WHEN employee.location = 11 THEN 'Asia/Kolkata' /*Bengaluru*/
		WHEN employee.location = 3 THEN 'Asia/Kuala_Lumpur' /*KL*/
		WHEN employee.location = 6 THEN 'Asia/Singapore' /*SG*/
		WHEN employee.location = 9 THEN 'Australia/Queensland' /*QLD*/
		WHEN employee.location = 10 THEN 'Australia/Victoria' /*VIC*/
		WHEN employee.location = 2 THEN 'Australia/NSW' /*NSW*/
		WHEN employee.location = 4 THEN 'Europe/London' /*London*/
		WHEN employee.location = 7 THEN 'America/Toronto' /*TOR*/
		WHEN employee.location = 35 THEN 'America/Chicago' /*AUS*/
		WHEN employee.location = 38 THEN 'America/Chicago' /*DAL*/
		WHEN employee.location = 29 THEN 'America/New_York' /*BOS*/
		WHEN employee.location = 36 THEN 'America/New_York' /*PIT*/
		WHEN employee.location = 37 THEN 'America/Los_Angeles' /*POR*/
		WHEN employee.location = 1 THEN 'America/Los_Angeles' /*SF*/
		WHEN employee.location = 27 THEN 'America/Los_Angeles' /*SEA*/
		WHEN employee.location = 5 THEN 'America/Santiago' /*Santiago*/
		ELSE 'Asia/Kuala_Lumpur' END AS timezone
	, 'True' AS reminders
	, supervisor.email AS manageremail
FROM timeoffrequest
INNER JOIN employee
	ON timeoffrequest.employee = employee.id
INNER JOIN employee supervisor
	ON employee.supervisor = supervisor.id
WHERE  timeoffrequest.approvalstatus = 8 
	AND ((timeoffrequest.startdate= BUILTIN.RELATIVE_RANGES('TODAY', 'END', 'DATE') 
		OR timeoffrequest.enddate= BUILTIN.RELATIVE_RANGES('TODAY', 'END', 'DATE')))
	AND timeoffrequest.id < 8464
ORDER BY timeoffrequest.id DESC