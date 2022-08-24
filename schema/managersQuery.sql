SELECT 
    CONCAT (employee.first_name, ' ', employee.last_name) AS name,
        employee.id AS value,
        employee.id AS short
FROM employee;
