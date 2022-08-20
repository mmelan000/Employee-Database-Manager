const fs = require('fs/promises');
const { exit } = require('process');
const inquirer = require('inquirer');
const db = require('./config/connections.js')

function placeholder(data){
    console.log(data.sendTo);
    exit();
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
                    'Exit.'
                ],
            }
        ])
        .then((response) => {
            switch (response.sendTo) {
                case 'View all departments.':
                    placeholder(response);
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
                case 'Exit.':
                    exit();

            }
        })
}

function init() {
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

init();