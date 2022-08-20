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

function viewDepartments () {
    if (ugly) {
        db.query(`SELECT * FROM department`, (err, result) => {
            if (err) {console.log(err);}
            console.table(result);
            rootMenu();
        }) 
    } else {
        db.query(`SELECT * FROM department`, (err, result) => {
            if (err) {console.log(err);}
            console.log(`
╔════════════════╦═══════════════════════════════╗
║ Department ID# ║ Department Name               ║
╠════════════════╬═══════════════════════════════╣`);

            for (var i = 0; i < result.length; i++){
                console.log(`║ ${result[i].id}`.padEnd(17) + `║ ${result[i].name}`.padEnd(32) + `║`);
            }
            console.log(`╚════════════════╩═══════════════════════════════╝`);
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
                    'Turn on/off ugly mode.',
                    'Exit.'
                ],
            }
        ])
        .then((response) => {
            switch (response.sendTo) {
                case 'View all departments.':
                    viewDepartments(response);
                    break;
                case 'View all roles.':
                    placeholder(response);
                    break;
                case 'View all employees.':
                    placeholder(response);
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
                case 'Turn on/off ugly mode.':
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
        console.log('Employee Manager');
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