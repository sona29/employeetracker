const mysql = require("mysql2");
const inquirer = require("inquirer");

const logo = require("asciiart-logo");
const config = require("./package.json");
console.log(logo(config).render());

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "root",
  database: "employee_trackerdb",
});

const start = () => {
  inquirer
    .prompt({
      name: "userFunctions",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View All Department",
        "View All Roles",
        "View All Employees",
        "View All Employees By Manager",
        "Add a Department",
        "Add an Employee",
        "Add a Role",
        "Update Employee Role",
        "Update Employee Manager",
        "EXIT",
      ],
    })
    .then((answer) => {
      if (answer.userFunctions === "View All Department") {
        viewAllDepartment();
      } else if (answer.userFunctions === "View All Roles") {
        viewAllRoles();
      } else if (answer.userFunctions === "View All Employees") {
        viewAllEmployees();
      } else if (answer.userFunctions === "View All Employees By Manager") {
        viewAllEmployeesByManager();
      } else if (answer.userFunctions === "Add a Department") {
        addDepartment();
      } else if (answer.userFunctions === "Add a Role") {
        addRole();
      } else if (answer.userFunctions === "Add an Employee") {
        addEmployee();
      } else if (answer.userFunctions === "Update Employee Role") {
        updateEmployeeRole();
      } else if (answer.userFunctions === "Update Employee Manager") {
        updateEmployeeManager();
      } else {
        connection.end();
      }
    });
};

//function to view all departments
const viewAllDepartment = () => {
  connection.query("SELECT * FROM department", (err, results) => {
    if (err) throw err;
    console.table(results);
    start();
  });
};

//function to view all roles
const viewAllRoles = () => {
  connection.query(
    `SELECT role.title, role.salary, department.name AS department 
    FROM role 
    INNER JOIN department 
    ON role.department_id = department.id`,
    (err, results) => {
      if (err) throw err;
      console.table(results);
      start();
    }
  );
};

//function to view all employess
const viewAllEmployees = () => {
  connection.query(
    `SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name 
    FROM employee INNER JOIN role 
    ON employee.role_id = role.id 
    INNER JOIN department ON role.department_id = department.id`,
    (err, results) => {
      if (err) throw err;
      console.table(results);
      start();
    }
  );
};

//function to view all employees by manager
const viewAllEmployeesByManager = () => {
  connection.query(
    "SELECT * FROM employee WHERE manager_id IS NULL",
    (err, employees) => {
      inquirer
        .prompt([
          {
            name: "employee",
            type: "rawlist",
            choices() {
              const choiceArray = [];
              employees.forEach(({ first_name, last_name, id }) => {
                choiceArray.push({
                  name: first_name + " " + last_name,
                  value: id,
                });
              });
              return choiceArray;
            },
            message: "Please select the manager",
          },
        ])
        .then((answer) => {
          connection.query(
            `SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name 
            FROM employee INNER JOIN role 
            ON employee.role_id = role.id 
            INNER JOIN department ON role.department_id = department.id WHERE ?`,

            {
              manager_id: answer.employee,
            },
            (err, results) => {
              if (err) throw err;
              console.table(results);
              console.log("Employee listed by Manager!");
              start();
            }
          );
        });
    }
  );
};

//function to add department
const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: "Please enter the name of the new department",
      },
    ])
    .then((answer) => {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO department SET ?",

        {
          name: answer.department,
        },
        (err) => {
          if (err) throw err;
          console.log("A new department successfully!");
          start();
        }
      );
    });
};

const updateEmployeeRole = () => {
  connection.query("SELECT * FROM employee", (err, employees) => {
    connection.query("SELECT * FROM role", (err, roles) => {
      inquirer
        .prompt([
          {
            name: "employee",
            type: "rawlist",
            choices() {
              const choiceArray = [];
              employees.forEach(({ first_name, last_name, id }) => {
                choiceArray.push({
                  name: first_name + " " + last_name,
                  value: id,
                });
              });
              return choiceArray;
            },
            message: "Please select the employee to update",
          },
          {
            name: "role",
            type: "rawlist",
            choices() {
              const choiceArray = [];
              roles.forEach(({ title, id }) => {
                choiceArray.push({ name: title, value: id });
              });
              return choiceArray;
            },
            message: "Please select the new role for the employee",
          },
        ])
        .then((answer) => {
          connection.query(
            "UPDATE employee SET ? WHERE ?",

            [
              {
                role_id: answer.role,
              },
              {
                id: answer.employee,
              },
            ],

            (err) => {
              if (err) throw err;

              console.log("Employee role updated successfully!");
              start();
            }
          );
        });
    });
  });
};

const updateEmployeeManager = () => {
  connection.query("SELECT * FROM employee", (err, employees) => {
    //for managers
    let managers = employees.filter((employee) => {
      return employee.manager_id === null;
    });

    //for other employees
    let nonManagers = employees.filter((employee) => {
      return employee.manager_id !== null;
    });

    inquirer
      .prompt([
        {
          name: "employee",
          type: "rawlist",
          choices() {
            return nonManagers.map(({ first_name, last_name, id }) => {
              return {
                name: first_name + " " + last_name,
                value: id,
              };
            });
          },
          message: "Please select the employee to update manager",
        },
        {
          name: "manager",
          type: "rawlist",
          choices() {
            const choiceArray = [];
            managers.forEach(({ first_name, last_name, id }) => {
              choiceArray.push({
                name: first_name + " " + last_name,
                value: id,
              });
            });
            return choiceArray;
          },
          message: "Please select the new manager",
        },
      ])
      .then((answer) => {
        connection.query(
          "UPDATE employee SET ? WHERE ?",

          [
            {
              manager_id: answer.manager,
            },
            {
              id: answer.employee,
            },
          ],

          (err) => {
            if (err) throw err;

            console.log("Employee manager updated successfully!");
            start();
          }
        );
      });
  });
};

//function to add a role
const addRole = () => {
  connection.query("SELECT * FROM department", (err, results) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "newRole",
          type: "input",
          message: "Please enter the name of the new role",
          validate: function (answer) {
            if (answer.length < 1) {
              return console.log("You must enter the name of new role.");
            }
            return true;
          },
        },
        {
          name: "salary",
          type: "input",
          message: "Please enter the salary for this new role",
          validate: function (answer) {
            if (answer.length < 1) {
              return console.log("The salary cannot be blank.");
            }
            return true;
          },
        },
        {
          name: "department",
          type: "rawlist",
          choices() {
            const choiceArray = [];
            results.forEach(({ name, id }) => {
              choiceArray.push({ name: name, value: id });
            });
            return choiceArray;
          },
          message: "Please select the department for this new role",
        },
      ])
      .then((answer) => {
        //   inserting into role table
        connection.query(
          "INSERT INTO role SET ?",

          {
            title: answer.newRole,
            salary: answer.salary,
            department_id: answer.department,
          },
          (err) => {
            if (err) throw err;
            console.log("A new role added successfully!");
            start();
          }
        );
      });
  });
};

//function to select manager
var managersArr = [];
function selectManager() {
  connection.query(
    "SELECT first_name, last_name FROM employee WHERE manager_id IS NULL",
    function (err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        managersArr.push(res[i].first_name + " " + res[i].last_name);
      }
    }
  );
  return managersArr;
}

//function to add new employee
const addEmployee = () => {
  connection.query("SELECT * FROM role", (err, results) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "firstName",
          type: "input",
          message: "Please enter the first name",
          validate: function (answer) {
            if (answer.length < 1) {
              return console.log("You must enter the first name.");
            }
            return true;
          },
        },
        {
          name: "lastName",
          type: "input",
          message: "Please enter the last name",
          validate: function (answer) {
            if (answer.length < 1) {
              return console.log("Last name cannot be blank.");
            }
            return true;
          },
        },
        {
          name: "role",
          type: "list",
          choices() {
            const roleArray = [];
            // console.log(results);
            results.forEach(({ title, id }) => {
              roleArray.push({ name: title, value: id });
            });

            return roleArray;
          },
          message: "Please select the role for this new employee",
        },
        {
          name: "manager",
          type: "rawlist",
          choices: selectManager(),

          message: "Please select manager for this new employee",
        },
      ])
      .then((answer) => {
        var managerId = selectManager().indexOf(answer.manager) + 1;

        //   inserting into employee table
        connection.query(
          "INSERT INTO employee SET ?",

          {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: answer.role,
            manager_id: managerId,
          },
          (err) => {
            if (err) throw err;
            console.log("A new employee added successfully!");
            start();
          }
        );
      });
  });
};

module.exports = {
  viewAllDepartment,
  viewAllRoles,
  viewAllEmployees,
  viewAllEmployeesByManager,
  addDepartment,
  addRole,
  addEmployee,
  start,
};
