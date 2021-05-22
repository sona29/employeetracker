const mysql = require('mysql2');
const inquirer = require('inquirer');

// const start = require("./server");



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

 //function to add department
 const addDepartment = () =>{
    inquirer
    .prompt([
      {
        name: 'department',
        type: 'input',
        message: 'Please enter the name of the new department',
      },    
      
    ])
    .then((answer) => {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        'INSERT INTO department SET ?',
        // QUESTION: What does the || 0 do?
        {
          name: answer.department,
          
        },
        (err) => {
          if (err) throw err;
          console.log('A new department successfully!');
          // re-prompt the user for if they want to bid or post
        //   start.start();
        }
      );
    });
  
  } ;

  //function to add a role
 const addRole = () =>{
    connection.query('SELECT * FROM department', (err, results) => {
        if (err) throw err;
    inquirer
    .prompt([
      {
        name: 'newRole',
        type: 'input',
        message: 'Please enter the name of the new role',
        validate: function (answer) {
            if (answer.length < 1) {
                return console.log("You must enter the name of new role.");
            }
            return true;
        }
      }, 
      {
        name: 'salary',
        type: 'input',
        message: 'Please enter the salary for this new role',
        validate: function (answer) {
            if (answer.length < 1) {
                return console.log("The salary cannot be blank.");
            }
            return true;
        }
      },  
      {
        name: 'department',
        type: 'rawlist',
        choices() {
          const choiceArray = [];
          results.forEach(({ name,id }) => {
            choiceArray.push({name:name, value: id});
          });
          return choiceArray;
        },
        message: 'Please select the department for this new role',
      },   
      
    ])
    .then((answer) => {
        
    //   inserting into role table
      connection.query(
        'INSERT INTO role SET ?',
        // QUESTION: What does the || 0 do?
        {
          title: answer.newRole,
          salary:answer.salary,
          department_id:answer.department
          
        },
        (err) => {
          if (err) throw err;
          console.log('A new role added successfully!');
          // re-prompt the user for if they want to bid or post
        //   start.start();
        }
      );
    });
});
  
  } ;

  const getManager = () =>{
    connection.query('SELECT * FROM employee WHERE id=1 OR id=2 OR id=3 OR id=4', (err, results) => {
      if (err) throw err;
      for(let i=0;i<results.length;i++){

        console.log(results[i].first_name+ ' '+ results[i].last_name);
      }
      
    });

  }


  //function to add new employee
 const addEmployee = () =>{
    connection.query('SELECT * FROM role', (err, results) => {
        if (err) throw err;
    inquirer
    .prompt([
      {
        name: 'firstName',
        type: 'input',
        message: 'Please enter the first name',
        validate: function (answer) {
            if (answer.length < 1) {
                return console.log("You must enter the first name.");
            }
            return true;
        }
      }, 
      {
        name: 'lastName',
        type: 'input',
        message: 'Please enter the last name',
        validate: function (answer) {
            if (answer.length < 1) {
                return console.log("Last name cannot be blank.");
            }
            return true;
        }
      },  
      {
        name: 'role',
        type: 'list',
        choices() {
          const roleArray = [];
          // console.log(results);
          results.forEach(({ title,id }) => {
            roleArray.push({name:title, value: id});
          });
          
     
          return roleArray;
         
        },
        message: 'Please select the role for this new employee',
      },   
      
    ])
    .then((answer) => {    
        
    //   inserting into role table
      connection.query(
        'INSERT INTO employee SET ?',
        // QUESTION: What does the || 0 do?
        {
          first_name: answer.firstName,
          last_name:answer.lastName,
          role_id:answer.role
          
        },
        (err) => {
          if (err) throw err;
          console.log('A new employee added successfully!');
          // re-prompt the user for if they want to bid or post
        //   start.start();
        }
      );
    });
});
  
  } ;

 module.exports = { viewAllDepartment,viewAllRoles, viewAllEmployees ,viewAllEmployeesByDepartment, addDepartment, addRole,addEmployee, getManager};