const inquirer = require('inquirer');
const db = require('./config/connections.js');
const cTable = require('console.table');
const { exit } = require('process');
let ugly = false;
// renders table that shows current salary spending by department
function budgetByDepartment() {
    console.clear();
    db.promise().query(`SELECT
                            department.name AS 'Department',
                            SUM(role.salary) AS 'Budget' 
                        FROM role 
                        LEFT JOIN department on role.department_id = department.id
                        LEFT JOIN employee on employee.role_id = role.id
                        GROUP BY department_id`)
        .then((response) => {
            if (ugly) {
                console.table(response[0]);
                rootMenu();
                return;
            } else {
                console.log(`
╔═════════════╦════════════════════╗
║ Department  ║ Total Budget Spend ║
╠═════════════╬════════════════════╣`);

            for (var i = 0; i < response[0].length; i++) {
                console.log(`║ ${response[0][i].Department}`.padEnd(14) + `║ ${response[0][i].Budget}`.padEnd(21) + `║`);
            }
            console.log(`╚═════════════╩════════════════════╝`);
            rootMenu();
            return;

            }
        })

}
// prompts list of available employees to delete as well as an option to cancel
function deleteEmployee() {
    console.clear();
    db.promise().query(`SELECT 
                CONCAT (employee.first_name, ' ', employee.last_name) AS 'name',               
                employee.id AS 'value', 
                employee.id AS 'short'
                FROM employee`)
    .then((employee) =>{
        employee[0].push({ name: 'Cancel', value: null, short: null });
        inquirer
            .prompt(
                {
                    type: 'list',
                    name: 'employee',
                    message: "Please select which Employee you wish to delete:",
                    choices: employee[0]
                }
            )
            .then((response) => {
                db.query(`DELETE FROM employee WHERE employee.id = ?`, [response.employee], function (err, result) {
                    if (err) { console.log(err); }
                    renderEmployeeTable();
                    return;
                })
            return;
            });
    return;
    })
return;
}
// prompts list of available roles to delete as well as an option to cancel
function deleteRole() {
    console.clear();
    db.promise().query(`SELECT 
                role.title AS 'name',               
                role.id AS 'value', 
                role.id AS 'short'
                FROM role`)
    .then((role) =>{
        role[0].push({ name: 'Cancel', value: null, short: null });
        inquirer
            .prompt(
                {
                    type: 'list',
                    name: 'role',
                    message: "Please select which Role you wish to delete:",
                    choices: role[0]
                }
            )
            .then((response) => {
                db.query(`DELETE FROM role WHERE role.id = ?`, [response.role], function (err, result) {
                    if (err) { console.log(err); }
                    viewRoles();
                    return;
                })
            });
        return;
    })
    return;
}
// prompts list of available departments to delete as well as an option to cancel
function deleteDepartment() {
    console.clear();
    db.promise().query(`SELECT 
                department.name AS 'name',                
                department.id AS 'value', 
                department.id AS 'short'
                FROM department`)
    .then((department) =>{
        department[0].push({ name: 'Cancel', value: null, short: null });
        inquirer
            .prompt(
                {
                    type: 'list',
                    name: 'department',
                    message: "Please select which Department you wish to delete:",
                    choices: department[0]
                }
            )
            .then((response) => {
                db.query(`DELETE FROM department WHERE department.id = ?`, [response.department], function (err, result) {
                    if (err) { console.log(err); }
                    viewDepartments();
                    return;
                })
            });
        return;
    })
    return;
}
// clears console, renders employee table based off of table view and sort criteria, redirects back to rootMenu
function renderEmployeeTable(sortBy, ascDesc) {
    if (!sortBy) {sortBy = 'e.id'; ascDesc = `ASC`};
    if (ugly) {
        console.clear();
        db.query(`SELECT 
                    e.id as 'ID#',
                    e.first_name AS 'First Name',
                    e.last_name AS 'Last Name',
                    role.title AS 'Role',
                    department.name AS 'Department',
                    role.salary AS 'Salary',
                    CONCAT (m.first_name, ' ', m.last_name) AS 'Manager'
                FROM employee e
                LEFT JOIN role ON e.role_id = role.id 
                LEFT JOIN department ON role.department_id = department.id
                LEFT JOIN employee m ON m.id = e.manager_id
                ORDER BY ${sortBy} ${ascDesc}`,
            (err, result) => {
                if (err) { console.log(err); }
                console.table(result);
                rootMenu();
                return;
            }
        )
    } else {
        console.clear();
        db.query(`SELECT 
                    e.id,
                    e.first_name,
                    e.last_name,
                    role.title,
                    department.name,
                    role.salary,
                    CONCAT (m.first_name, ' ', m.last_name) as manager
                FROM employee e
                LEFT JOIN role ON e.role_id = role.id 
                LEFT JOIN department ON role.department_id = department.id
                LEFT JOIN employee m ON m.id = e.manager_id
                ORDER BY ${sortBy} ${ascDesc}`,
            (err, result) => {
                if (err) { console.log(err); }
                console.log(`
╔═════╦════════════════════════════════╦════════════════════════════════╦════════════════════════════════╦════════════════════════════════╦═════════╦═══════════════════════════════════════════════════════════════╗
║ ID# ║ First Name                     ║ Last Name                      ║ Job Title                      ║ Department                     ║ Salary  ║ Manager                                                       ║
╠═════╬════════════════════════════════╬════════════════════════════════╬════════════════════════════════╬════════════════════════════════╬═════════╬═══════════════════════════════════════════════════════════════╣`);

                for (var i = 0; i < result.length; i++) {
                    console.log(`║ ${result[i].id}`.padEnd(6) + `║ ${result[i].first_name}`.padEnd(33) + `║ ${result[i].last_name}`.padEnd(33) + `║ ${result[i].title}`.padEnd(33) + `║ ${result[i].name}`.padEnd(33) + `║ ${result[i].salary}`.padEnd(10) + `║ ${result[i].manager}`.padEnd(64) + `║`);
                }
                console.log(`╚═════╩════════════════════════════════╩════════════════════════════════╩════════════════════════════════╩════════════════════════════════╩═════════╩═══════════════════════════════════════════════════════════════╝`);
                rootMenu();
                return;
            })
    }
}
// allows user to update existing employee's manager to different exisiting employee or null manager.
function updateEmployeeManager() {
    console.clear();
    db.promise().query(`SELECT 
                            CONCAT (employee.first_name, ' ', employee.last_name) AS name,
                            employee.id AS value,
                            employee.id AS short
                        FROM employee`)
    .then((employeeQuery) => {
        inquirer
            .prompt(
                {
                    type: 'list',
                    name: 'employee',
                    message: 'Which employee would you like to update?',
                    choices: employeeQuery[0]
                })
            .then((selectedEmployee) => {
                const findEmployeeIndex = employeeQuery[0].findIndex(object => object.short === selectedEmployee.employee);

                employeeQuery[0].splice(findEmployeeIndex, 1);
                employeeQuery[0].push({ name: 'No Manager', value: null, short: null });

                inquirer
                    .prompt(
                        {
                            type: 'list',
                            name: 'manager',
                            message: 'Who will they be reporting to?',
                            choices: employeeQuery[0]
                        }
                    )
                    .then((response) => {
                        db.query(`UPDATE employee SET manager_id = ? WHERE id = ?`, [response.manager, selectedEmployee.employee], function (err, result) {
                            if (err) {console.log(err);}
                            renderEmployeeTable();
                            return;
                        })
                    });
                return;
            })
        return;
    })
    return;
}
// allows user to update existing employee with a new existing role.
function updateEmployeeRole() {
    console.clear();
    db.promise().query(`SELECT 
                            CONCAT (employee.first_name, ' ', employee.last_name) AS name,
                            employee.id AS value,
                            employee.id AS short
                        FROM employee`)
    .then((employeeQuery) => {
        db.promise().query(`SELECT 
                                role.title as name, 
                                role.id as value, 
                                role.id as short 
                            FROM role`)
        .then((roleQuery) => {
            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'employee',
                        message: 'Which employee would you like to update?',
                        choices: employeeQuery[0]
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'What role will they be moving to?',
                        choices: roleQuery[0]
                    }
                ])
                .then((response) => {
                    db.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [response.role, response.employee], function (err, result) {
                        if (err) {console.log(err);}
                        renderEmployeeTable();
                        return;
                    })
                });
            return;
        })
        return;
    })
    return;
}
// asks first name, last name, parent role, and manager. then ships it off the mysql, continues on to render table to confirm for user it was successful
function addEmployee() {
    console.clear();
    db.promise().query(`SELECT 
                            CONCAT (employee.first_name, ' ', employee.last_name) AS name,
                            employee.id AS value,
                            employee.id AS short
                        FROM employee`)
    .then((managerQuery) => {
        managerQuery[0].push({ name: 'No Manager', value: null, short: null });
        db.promise().query(`SELECT 
                                role.title as name, 
                                role.id as value, 
                                role.id as short 
                            FROM role`)
        .then((roleQuery) => {
            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'firstName',
                        message: "Please enter the first name of the employee:",
                        validate(value) {
                            if (value.length > 30) {
                                return 'Must be under 30 characters';
                            } else if (!value) {
                                return 'Please enter a name.'
                                } else {
                                    return true;
                                }
                        }
                    },
                    {
                        type: 'input',
                        name: 'lastName',
                        message: "Please enter the last name of the employee:",
                        validate(value) {
                            if (value.length > 30) {
                                return 'Must be under 30 characters';
                            } else if (!value) {
                                return 'Please enter a name.'
                            } else {
                                return true;
                            }
                        }
                    },
                    {
                        type: 'list',
                        name: 'role',
                        message: 'Which role will this employee be filling?',
                        choices: roleQuery[0]
                    },
                    {
                        type: 'list',
                        name: 'manager',
                        message: 'Who will they be reporting to?',
                        choices: managerQuery[0]
                    }
                ])
                .then((response) => {
                    db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`, [response.firstName, response.lastName, response.role, response.manager], function (err, result) {
                        if (err) {console.log(err);}
                        renderEmployeeTable();
                        return;
                    })
                });
            return;
        })
        return;
    })
    return;
}
// asks name, salary, and parent department. then ships it off the mysql, continues on to render table to confirm for user it was successful
function addRole() {
    console.clear();
    db.promise().query(`SELECT 
                            department.name as name, 
                            department.id as value, 
                            department.id as short 
                        FROM department`)
        .then((departmentQuery) => {
            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'title',
                        message: "Please enter the name of the Role:",
                        validate(value) {
                            if (value.length > 30) {
                                return 'Must be under 30 characters';
                            } else if (!value) {
                                return 'Please enter a name.'
                            } else {
                                return true;
                            }
                        }
                    },
                    {
                        type: 'input',
                        name: 'salary',
                        message: "Please enter the salary of the Role:",
                        validate(value) {
                            if (!Number.isInteger(parseInt(value))) {
                                return 'Please enter a number.'
                            } else if (parseInt(value) < 0) {
                                return 'Please enter a value of 0 or greater.'
                            } else {
                                return true;
                            }
                        }
                    },
                    {
                        type: 'list',
                        name: 'department',
                        message: 'Which department does this role belong to?',
                        choices: departmentQuery[0]
                    }
                ])
                .then((response) => {
                    db.query(`INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`, [response.title, parseInt(response.salary), response.department], function (err, result) {
                        if (err) { console.log(err); }
                        viewRoles();
                        return;
                    })
                });
            return;
        })
}
// asks name of department, ships it off the mysql, continues on to render table to confirm for user it was successful
function addDepartment() {
    console.clear();
    inquirer
        .prompt(
            {
                type: 'input',
                name: 'name',
                message: "Please enter the name of the Department:",
                validate(value) {
                    if (value.length > 30) {
                        return 'Must be under 30 characters';
                    } else if (!value) {
                        return 'Please enter a name.'
                    } else {
                        return true;
                    }
                }
            }
        )
        .then((response) => {
            db.query(`INSERT INTO department (name) VALUE (?)`, response.name, function (err, result) {
                if (err) { console.log(err); }
                viewDepartments();
                return;
            })
        });
}
// menu to sort employee table by different criteria
function viewEmployees() {
    inquirer
        .prompt([
            {
                type: `list`,
                name: `viewBy`,
                message: `Sort By?`,
                choices: [
                    `ID`,
                    `First Name`,
                    `Last Name`,
                    `Job Title`,
                    `Department`,
                    `Salary`,
                    `Manager`
                ],
            }
        ])
        .then((response) => {
            switch (response.viewBy) {
                case `ID`:
                    renderEmployeeTable(`e.id`, `ASC`);
                    break;
                case `First Name`:
                    renderEmployeeTable(`e.first_name`, `ASC`);
                    break;
                case `Last Name`:
                    renderEmployeeTable(`e.last_name`, `ASC`);
                    break;
                case `Job Title`:
                    renderEmployeeTable(`e.role_id`, `ASC`);
                    break;
                case `Department`:
                    renderEmployeeTable(`department.name`, `ASC`);
                    break;
                case `Salary`:
                    renderEmployeeTable(`role.salary`, `DESC`);
                    break;
                case `Manager`:
                    renderEmployeeTable(`m.first_name`, `ASC`);
                    break;
            }
        })


}
// clears console, renders role table based off of table view, redirects back to rootMenu
function viewRoles() {
    if (ugly) {
        console.clear();
        db.query(`SELECT 
                    role.title AS 'Job Title', 
                    role.id AS 'ID#', 
                    department.name AS 'Department',
                    role.salary AS 'Salary'
                FROM role
                LEFT JOIN department ON role.department_id = department.id`, (err, result) => {
            if (err) { console.log(err); }
            console.table(result);
            rootMenu();
            return;
        })
    } else {
        console.clear();
        db.query(`SELECT 
                    role.title, 
                    role.id, 
                    department.name, 
                    role.salary 
                FROM role
                LEFT JOIN department ON role.department_id = department.id`, (err, result) => {
            if (err) { console.log(err); }
            console.log(`
╔════════════════════════════════╦═════╦════════════════════════════════╦═════════╗
║ Job Title#                     ║ ID# ║ Department                     ║ Salary  ║
╠════════════════════════════════╬═════╬════════════════════════════════╬═════════╣`);

            for (var i = 0; i < result.length; i++) {
                console.log(`║ ${result[i].title}`.padEnd(33) + `║ ${result[i].id}`.padEnd(6) + `║ ${result[i].name}`.padEnd(33) + `║ ${result[i].salary}`.padEnd(10) + `║`);
            }
            console.log(`╚════════════════════════════════╩═════╩════════════════════════════════╩═════════╝`);
            rootMenu();
            return;
        })
    }
}
// clears console, renders department table base off of table view, redirects back to rootMenu
function viewDepartments() {
    if (ugly) {
        console.clear();
        db.query(`SELECT 
                    department.id AS 'ID#', 
                    department.name AS 'Department'
                FROM department`, (err, result) => {
            if (err) { console.log(err); }
            console.table(result);
            rootMenu();
            return;
        })
    } else {
        console.clear();
        db.query(`SELECT * FROM department`, (err, result) => {
            if (err) { console.log(err); }
            console.log(`
╔═════╦════════════════════════════════╗
║ ID# ║ Department                     ║
╠═════╬════════════════════════════════╣`);

            for (var i = 0; i < result.length; i++) {
                console.log(`║ ${result[i].id}`.padEnd(6) + `║ ${result[i].name}`.padEnd(33) + `║`);
            }
            console.log(`╚═════╩════════════════════════════════╝`);
            rootMenu();
            return;
        })
    }
}
// i dont like console.table, so i made my own and put this in so i could meet my projects AC
function toggleTables() {
    if (ugly) {
        ugly = false;
        console.log(`Pretty tables enables.`);
    } else {
        ugly = true;
        console.log(`Simple tables enabled.`);
    }
    rootMenu();
    return;
}
// core list menu that directs to differnet app functionalites
function rootMenu() {
    inquirer
        .prompt([
            {
                type: `list`,
                name: `sendTo`,
                message: `What would you like to do?`,
                choices: [
                    `View all departments.`,
                    `View all roles.`,
                    `View all employees.`,
                    `Add a department.`,
                    `Add a role.`,
                    `Add an employee.`,
                    `Update an employee's role.`,
                    `Update an employee's manager.`,
                    `Delete a department.`,
                    `Delete an employee.`,
                    `Delete a role.`,
                    `View Total Budget Spend.`,
                    `Toggle table mode.`,
                    `Exit.`
                ],
            }
        ])
        .then((response) => {
            switch (response.sendTo) {
                case `View all departments.`:
                    viewDepartments();
                    break;
                case `View all roles.`:
                    viewRoles();
                    break;
                case `View all employees.`:
                    viewEmployees();
                    break;
                case `Add a department.`:
                    addDepartment();
                    break;
                case `Add a role.`:
                    addRole();
                    break;
                case `Add an employee.`:
                    addEmployee();
                    break;
                case `Update an employee's role.`:
                    updateEmployeeRole();
                    break;
                case `Update an employee's manager.`:
                    updateEmployeeManager();
                    break;
                case `Delete a department.`:
                    deleteDepartment();
                    break;
                case `Delete an employee.`:
                    deleteEmployee();
                    break;
                case `Delete a role.`:
                    deleteRole();
                    break;
                case `View Total Budget Spend.`:
                    budgetByDepartment();
                    break;
                case `Toggle table mode.`:
                    toggleTables();
                    break;
                case `Exit.`:
                    exit();
            }
        })
}
// loads pointless header, moves onto rootMenu
function init() {
    console.clear();
    const unnecessary = ["",
        "    _/_/_/_/                            _/                                              _/      _/                                                              ",
        "   _/        _/_/_/  _/_/    _/_/_/    _/    _/_/    _/    _/    _/_/      _/_/        _/_/  _/_/    _/_/_/  _/_/_/      _/_/_/    _/_/_/    _/_/    _/  _/_/   ",
        "  _/_/_/    _/    _/    _/  _/    _/  _/  _/    _/  _/    _/  _/_/_/_/  _/_/_/_/      _/  _/  _/  _/    _/  _/    _/  _/    _/  _/    _/  _/_/_/_/  _/_/        ",
        " _/        _/    _/    _/  _/    _/  _/  _/    _/  _/    _/  _/        _/            _/      _/  _/    _/  _/    _/  _/    _/  _/    _/  _/        _/           ",
        "_/_/_/_/  _/    _/    _/  _/_/_/    _/    _/_/      _/_/_/    _/_/_/    _/_/_/      _/      _/    _/_/_/  _/    _/    _/_/_/    _/_/_/    _/_/_/  _/            ",
        "                         _/                            _/                                                                          _/                           ",
        "                        _/                        _/_/                                                                        _/_/                              ",
        ""
    ];
    let counter = 0;
    const i = setInterval(function () {
        console.log(unnecessary[counter]);
        counter++;
        if (counter === unnecessary.length) {
            clearInterval(i);
            rootMenu();
            return;
        }
    }, 200);
}

init();