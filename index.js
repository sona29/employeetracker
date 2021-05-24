const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");

const lib = require("./lib");

// create the connection information for the sql database
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "employee_trackerdb",
});

// connect to the mysql server and sql database
connection.connect((err) => {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  lib.start();
});
