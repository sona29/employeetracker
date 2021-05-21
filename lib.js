const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost', 
    port: 3306,      
    user: 'root',    
    password: 'root',
    database: 'employee_trackerdb',
  });

  
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
  connection.query('SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id', (err, results) => {
      if (err) throw err;
      console.table(results);
  });

} ;

 //function to view all employess
 const viewAllEmployeesByDepartment = () =>{
  connection.query('SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id', (err, results) => {
      if (err) throw err;
      console.table(results);
  });

} ;

 module.exports = { viewAllDepartment,viewAllRoles, viewAllEmployees ,viewAllEmployeesByDepartment};