SELECT 
    role.title AS Title, 
    role.id AS ID, 
    department.name AS Department,
    role.salary AS Salary
FROM role
LEFT JOIN department ON role.department_id = department.id;