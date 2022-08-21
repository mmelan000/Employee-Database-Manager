const fs = require('fs/promises');
const { exit } = require('process');
const inquirer = require('inquirer');
const db = require('./config/connections.js');
const cTable = require('console.table');
const { clear } = require('console');
let ugly = false;

function placeholder(data){
    console.log(data);
    exit();
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
                if (err) {console.log(err);}
                console.table(result);
                rootMenu();
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
                    if (err) {console.log(err);}
                    console.log(`
╔═════╦════════════════════════════════╦════════════════════════════════╦════════════════════════════════╦════════════════════════════════╦═════════╦═══════════════════════════════════════════════════════════════╗
║ ID# ║ First Name                     ║ Last Name                      ║ Job Title                      ║ Department                     ║ Salary  ║ Manager                                                       ║
╠═════╬════════════════════════════════╬════════════════════════════════╬════════════════════════════════╬════════════════════════════════╬═════════╬═══════════════════════════════════════════════════════════════╣`);
            
            for (var i = 0; i < result.length; i++){
                console.log(`║ ${result[i].id}`.padEnd(6) + `║ ${result[i].first_name}`.padEnd(33) + `║ ${result[i].last_name}`.padEnd(33) + `║ ${result[i].title}`.padEnd(33) + `║ ${result[i].name}`.padEnd(33) + `║ ${result[i].salary}`.padEnd(10) + `║ ${result[i].manager}`.padEnd(64) + `║`);
            }
            console.log(`╚═════╩════════════════════════════════╩════════════════════════════════╩════════════════════════════════╩════════════════════════════════╩═════════╩═══════════════════════════════════════════════════════════════╝`);       
            rootMenu();
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
            if (err) {console.log(err);}
            console.table(result);
            rootMenu();
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
            if (err) {console.log(err);}
            console.log(`
╔════════════════════════════════╦═════╦════════════════════════════════╦═════════╗
║ Job Title#                     ║ ID# ║ Department                     ║ Salary  ║
╠════════════════════════════════╬═════╬════════════════════════════════╬═════════╣`);
            
            for (var i = 0; i < result.length; i++){
                console.log(`║ ${result[i].title}`.padEnd(33) + `║ ${result[i].id}`.padEnd(6) + `║ ${result[i].name}`.padEnd(33) + `║ ${result[i].salary}`.padEnd(10) + `║`);
            }
            console.log(`╚════════════════════════════════╩═════╩════════════════════════════════╩═════════╝`);            
            rootMenu();
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
            if (err) {console.log(err);}
            console.table(result);
            rootMenu();
        }) 
    } else {
        console.clear();
        db.query(`SELECT * FROM department`, (err, result) => {
            if (err) {console.log(err);}
            console.log(`
╔═════╦════════════════════════════════╗
║ ID# ║ Department                     ║
╠═════╬════════════════════════════════╣`);

            for (var i = 0; i < result.length; i++){
                console.log(`║ ${result[i].id}`.padEnd(6) + `║ ${result[i].name}`.padEnd(33) + `║`);
            }
            console.log(`╚═════╩════════════════════════════════╝`);
            rootMenu();
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
                    placeholder(response);
                    break;
                case 'Add a role.':
                    placeholder(response);
                    break;
                case 'Add an employee.':
                    placeholder(response);
                    break;
                case 'Update an employee.':
                    placeholder(response);
                    break;
                case 'Toggle ugly mode.':
                    if (ugly) {ugly = false} else {ugly = true};
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
        }
    }, 200);
    }
}

init();