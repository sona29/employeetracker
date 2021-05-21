DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL, 
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,  
  department_id INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL, 
  last_name VARCHAR(30) NOT NULL,   
  role_id INT NOT NULL,
  manager_id INT NULL,
  PRIMARY KEY (id)
);

INSERT INTO department (name)
VALUES ("Engineering");

INSERT INTO role (title,department_id)
VALUES ("Sales Lead",1);

INSERT INTO role (title,department_id)
VALUES ("Sales Person",1);

INSERT INTO role (title,department_id)
VALUES ("Lead Engineer",2);

INSERT INTO role (title,department_id)
VALUES ("Software Engineer",2);

INSERT INTO role (title,department_id)
VALUES ("Trainee Engineer",2);

INSERT INTO role (title,department_id)
VALUES ("Accountant",3);

INSERT INTO role (title,department_id)
VALUES ("Financial Planner",3);

INSERT INTO role (title,department_id)
VALUES ("Financial Advisor",3);

INSERT INTO role (title,department_id)
VALUES ("Legal Team Lead",4);

INSERT INTO role (title,department_id)
VALUES ("Lawyer",4);

ALTER TABLE role
ADD salary DECIMAL(10,2) NOT NULL;



select role.title, role.salary, department.name from role inner join department on role.department_id = department.id;


-- Manager
INSERT INTO employee (first_name,last_name,role_id)
VALUES ("Samantha","Smith",1);

INSERT INTO employee (first_name,last_name,role_id)
VALUES ("John","Doe",3);

INSERT INTO employee (first_name,last_name,role_id)
VALUES ("Venissa","Clarke",6);

INSERT INTO employee (first_name,last_name,role_id)
VALUES ("Lee","Hunyh",9);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Ruth","Hapeta",2,1);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Eva","Vancea",2,1);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Cheryl","Cunanan",4,2);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("Helen","Tamang",5,2);

SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name
FROM employee
INNER JOIN role ON employee.role_id = role.id
INNER JOIN department ON roll.department_id = department.id;