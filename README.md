# Employee Dashboard Generator  
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)   

## Description  

The purpose of this is to allow a manager to enter their information as well as their employees, which will then be compiled into a viewable html dashboard.

**User Story**
```
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business
```

**Acceptance Criteria**
```
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
```  

## Table of Contents  
1. [Description](#description)  
2. [Installation](#installation)  
3. [Dependencies](#dependencies)
4. [Usage](#usage)  
5. [Questions](#questions)  
6. [Contributing](#contributing)  
7. [Tests](#tests)  
8. [License](#license)
## Installation  

1. Download. 
2. Login to your **mysql** shell and run schema.sql. Optionally, you may also run the seeds.sql.
3. Create a .env file in the root and enter the following information:
    ```DB_NAME=employees_db  
    DB_USERNAME="YOUR_MYSQL_USERNAME_GOES_HERE" (default is root)  
    DB_PASSWORD="YOUR_MYSQL_PASSWORD_GOES_HERE"  
    ```
4. Run ```npm i``` from the terminal while in the folder location. 
5. Enter the command ```node index.js```.  

## Dependencies

- [console.table@0.10.0]()
- [dotenv@16.0.1]()
- [inquirer@8.2.4]()
- [mysql2@2.3.3]()

## Usage  

**[Walkthrough Video](https://drive.google.com/file/d/1QaviwklVCTNazefBhnmVNIgdwy2Qhaf4/view?usp=sharing)**

![App Screenshot](./Assets/images/SS1.png) 

![App Screenshot](./Assets/images/SS2.png) 

## Contributing  

Follow best practices for naming conventions, indentation, quality comments, etc.  

## Tests  

The program uses Jest for testing. There are pre-built tests inculded in the repository. If you would like to adjust the test, adjust the global variables to whatever you desire to test, then ```npm run test```  

## Questions  

If you have any questions, please reach out to me either on Github or by Email.
  - **Github:** [mmelan000](https://github.com/mmelan000)
  - **Email:** [m.melanson000@gmail.com](mailto:m.melanson000@gmail.com)

## License  

- [MIT](https://opensource.org/licenses/MIT)

* Update employee managers.

* View employees by manager.

* View employees by department.

* Delete departments, roles, and employees.

* View the total utilized budget of a department&mdash;in other words, the combined salaries of all employees in that department.