SELECT
    department.name,
    SUM(role.salary) 
FROM role 
LEFT JOIN department on role.department_id = department.id
LEFT JOIN employee on employee.role_id = role.id
GROUP BY department_id;