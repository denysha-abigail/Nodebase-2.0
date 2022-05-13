const inquirer = require('inquirer');
require('console.table');
// automatically goes to index file
const db = require('./db');

// inquirer questions go here
const inquirer = require("inquirer");
require("console.table");
const db = require("./db");

init();

function init() {
  inquirer
    .prompt([
      //start questions
      {
        type: "list",
        name: "options",
        message: "Which would you like to view?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee",
          "Done",
        ],
      },
    ])

    .then(function (startAnswer) {
      switch (startAnswer.options) {
        case "View all departments":
          //run the view departments function
          viewAllDepartments();
          break;
        case "View all roles":
          viewAllRoles();
          break;
        case "View all employees":
          viewAllEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
         
          break;
        case "Add an employee":
         
          break;
        case "Update an employee":
         
          break;
        default:
          process.exit();
      }

      //VIEW ALL DEPARTMENTS
      // Make a table with a list of deparments and id's: Customer Service, Developers, Marketing, Sales

      //VIEW ALL ROLES
      // Table with: role id, job title, department name, and salary

      //VIEW ALL EMPLOYEES
      //Table with employee data: employee ids, first, last, job titles, departments, salaries, and managers that employees report to

      //ADD A DEPARTMENT
      //enter name of department; add to the database
    });
}

function viewAllDepartments() {
    db.findDepartments().then(([data]) => {
        console.table(data)
    }).then(()=> init())
}

function viewAllRoles() {
    db.findRoles().then(([data]) => {
        console.table(data)
    }).then(() => init())
}

function viewAllEmployees() {
    db.findEmployees().then(([data]) => {
        console.table(data)
    }).then(() => init())
}

function addDepartment() {
  inquirer
    .prompt([
      //start questions
      {
        type: "input",
        name: "addDepart",
        message: "Enter department name",
        validate: (departInput) => {
          if (departInput) {
            return true;
          } else {
            console.log("Please provide a department name");
            return false;
          }
        },
      },
    ])
    .then(function (res) {
      const sql = `INSERT INTO department SET ?`;
      const params = [res.addDepart];

      connection.query(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }
        res.json({
          message: "success",
          data: row,
        });
      });
      // console.log(res.addDepart);
    });
}