INSERT INTO department (name)
VALUES ("Engineering"),
       ("Finance"),
       ("Legal"),
       ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES ("Account Manager", 160000, 2),
       ("Accountant", 125000, 2),
       ("Lawyer", 190000, 3),
       ("Lead Engineer", 150000, 1),
       ("Legal Team Lead", 250000, 3),
       ("Salesperson", 80000, 4),
       ("Sales Manager", 140000, 4),
       ("Software Engineer", 120000, 1);
       
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 7, null),
       ("Mike", "Chan", 6, 1),
       ("Ashley", "Rodriguez", 4, null),
       ("Kevin", "Tupik", 8, 3),
       ("Kunal", "Singh", 1, null),
       ("Malia", "Brown", 2, 5),
       ("Sarah", "Lourd", 5, null),
       ("QKunal", "Singh", 3, null),
       ("WMalia", "Brown", 3, 5),
       ("ASarah", "Lourd", 7, null),
       ("Tom", "Allen", 3, 7);