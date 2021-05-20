const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

// create the connection information for the sql database
const connection = mysql.createConnection({
    host: 'localhost', 
    port: 3306,      
    user: 'root',    
    password: 'root',
    database: 'employee_trackerdb',
  });

// function which prompts the user for what action they should take
const start = () => {
    inquirer
      .prompt({
        name: 'userFunctions',
        type: 'list',
        message: 'What would you like to do?',
        choices: ['View All Department','View All Roles','View All Employees', 'View All Employees By Department', 'View All Employees By Manager','Add an Employee','Update Employee Role','EXIT'],
      })
      .then((answer) => {
        // based on their answer, either call the bid or the post functions
        if (answer.userFunctions === 'View All Department') {
          viewAllDepartment();
        } else if (answer.userFunctions === 'View All Roles') {
            viewAllRoles();
        } else if (answer.userFunctions === 'View All Employees') {
          viewAllEmployees();
        }
        else {
          connection.end();
        }
      });
  };


  //function to view all departments
 const viewAllDepartment = () =>{
    connection.query('SELECT * FROM department', (err, results) => {
        if (err) throw err;
        console.table(results);
    });

 } ;

  //function to view all roles
  const viewAllRoles = () =>{
    connection.query('SELECT role.title, role.salary, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id', (err, results) => {
        if (err) throw err;
        console.table(results);
    });

 } ;

 //function to view all employess
 const viewAllEmployees = () =>{
  connection.query('SELECT employee.first_name, role.salary, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id', (err, results) => {
      if (err) throw err;
      console.table(results);
  });

} ;

  // connect to the mysql server and sql database
connection.connect((err) => {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
  });
  