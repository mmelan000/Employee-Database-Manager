const inquirer = require('inquirer');
const db = require('./config/connections.js');
const cTable = require('console.table');
const console = require('console');
const { clear } = require('console');
const { exit } = require('process');
let ugly = false;

function placeholder(data) {
    console.log(data);
    exit();
}

// db.promise().query('SELECT department.name as name, department.id as value, department.id as short from department')
//     .then((data) => console.log(data[0]))

function addRole() {
    console.clear();
    db.promise().query('SELECT department.name as name, department.id as value, department.id as short from department')
        .then((data) => {
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
                        choices: data[0]
                    }
                ])
                .then((response) => {
                    console.log(response);
                    db.query(`INSERT INTO role (title, salary, department_id) VALUES (?,?,?)`, [response.title, parseInt(response.salary), response.department], function (err, result) {
                        if (err) { console.log(err); }
                        viewRoles();
                        return;
                    })
                });
            return;
        })
}

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

function viewEmployees() {
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
                    LEFT JOIN employee m ON m.id = e.manager_id;`,
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
                    LEFT JOIN employee m ON m.id = e.manager_id;`,
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

function rootMenu() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'sendTo',
                message: 'What would you like to do?',
                choices: [
                    'View all departments.',
                    'View all roles.',
                    'View all employees.',
                    'Add a department.',
                    'Add a role.',
                    'Add an employee.',
                    'Update an employee.',
                    'Toggle ugly mode.',
                    'Exit.'
                ],
            }
        ])
        .then((response) => {
            switch (response.sendTo) {
                case 'View all departments.':
                    viewDepartments();
                    break;
                case 'View all roles.':
                    viewRoles();
                    break;
                case 'View all employees.':
                    viewEmployees();
                    break;
                case 'Add a department.':
                    addDepartment();
                    break;
                case 'Add a role.':
                    addRole(response);
                    break;
                case 'Add an employee.':
                    placeholder(response);
                    break;
                case 'Update an employee.':
                    placeholder(response);
                    break;
                case 'Toggle ugly mode.':
                    if (ugly) { ugly = false } else { ugly = true };
                    console.clear();
                    init();
                    break;
                case 'Exit.':
                    exit();
            }
        })
}

function init() {
    if (ugly) {
        console.log('Employee Manager... powered by console.table');
        rootMenu();
        return;
    } else {
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
}

init();