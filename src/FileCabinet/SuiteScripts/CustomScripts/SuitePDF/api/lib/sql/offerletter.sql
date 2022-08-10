SELECT employee.entityid AS name
	, BUILTIN.DF(employee.subsidiary) AS subsidiary
	, BUILTIN.DF(employee.job) AS jobprofile
	, BUILTIN.DF(employee.employeetype) AS employeetype
	, classification.name AS class
	, employee.custentity_primarypractice AS practice
	, employee.custentity_joexpirydate AS expirydate
	, BUILTIN.DF(employee.supervisor) AS supervisor
	, BUILTIN.DF(employee.custentity_atlas_chr_hr_rep) AS hrmanager
	, NVL(employee.basewage, 0) AS newsalary,
	, NVL(employee.custentity_st_total_annual_compensation, 0)  AS newtcc
	, NVL(employee.custentity_sr_total_annual_bonus, 0)  AS newstf
	, employee.compensationcurrency AS currency
	, currency.displaysymbol AS  currencysymbol
	, employee.hiredate AS startdate
	, CASE WHEN entityaddress.state IS NOT NULL
			THEN BUILTIN.DF(entityaddress.city) || ' ' || BUILTIN.DF(entityaddress.state)
		ELSE 
			BUILTIN.DF(entityaddress.city) 
	  END AS location
	, BUILTIN.DF(subsidiary.country) AS country
	, BUILTIN.DF(classification.custrecord_plan_budget_owner) AS budgetowner
	, stockoption.name AS commitnumber
	, stockoption.custrecord_sr_commit_qty AS stockquantity
	, subsidiary.custrecord_sr_payroll_day_of_month AS payrolldate
FROM employee
INNER JOIN currency
	ON employee.currency = currency.id
INNER JOIN subsidiary
	ON employee.subsidiary= subsidiary.id
INNER JOIN classification
	ON employee.class = classification.id
INNER JOIN employeeaddressbook addressbook
	ON employee.id = addressbook.entity
INNER JOIN employeeaddressbookentityaddress entityaddress
	ON addressbook.addressbookaddress = entityaddress.nkey
LEFT JOIN customrecord_sr_stock_option_commit stockoption
	ON employee.custentity_stockcommitment = stockoption.id
WHERE employee.id = {{id}}