SELECT 
    e.id as ID,
    e.first_name AS First,
    e.last_name AS Last,
    role.title AS Role,
    department.name AS Department,
    role.salary AS Salary,
    CONCAT (m.first_name, ' ', m.last_name) AS Manager
FROM employee e
LEFT JOIN role ON e.role_id = role.id 
LEFT JOIN department ON role.department_id = department.id
LEFT JOIN employee m ON m.id = e.manager_id;
