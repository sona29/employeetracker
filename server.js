const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

const express = require('express');
const sequelize = require('./config/connection');

const lib = require("./lib");

const app = express();


const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// create the connection information for the sql database
// const connection = mysql.createConnection({
//     host: 'localhost', 
//     port: 3306,      
//     user: 'root',    
//     password: 'root',
//     database: 'employee_trackerdb',
//   });

// function which prompts the user for what action they should take
const start = () => {
    inquirer
      .prompt({
        name: 'userFunctions',
        type: 'list',
        message: 'What would you like to do?',
        choices: ['View All Department','View All Roles','View All Employees', 'View All Employees By Department', 'View All Employees By Manager','Add a Department','Add an Employee','Add an Role','Update Employee Role','EXIT'],
      })
      .then((answer) => {
        // based on their answer, either call the bid or the post functions
        if (answer.userFunctions === 'View All Department') {
          lib.viewAllDepartment();
        } else if (answer.userFunctions === 'View All Roles') {
            lib.viewAllRoles();
        } else if (answer.userFunctions === 'View All Employees') {
          lib.viewAllEmployees();
        } else if (answer.userFunctions === 'View All Employees By Department') {
          lib.viewAllEmployeesByDepartment();
        } else if (answer.userFunctions === 'Add a Department') {
        lib.addDepartment();
      }
        else {
          // connection.end();
        }
      });
  };




  

  // connect to the mysql server and sql database
// connection.connect((err) => {
//     if (err) throw err;
//     // run the start function after the connection is made to prompt the user
//     start();
//   });

  sequelize.sync().then(() => {
    app.listen(PORT, () => start());
  });
  
  module.exports = { start};
  