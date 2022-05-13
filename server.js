const inquirer = require('inquirer');
require('console.table');
// automatically goes to index file
const db = require('./db');
const connection = require('./db/connection')

// inquirer questions go here
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
  inquirer.prompt([
      {
        name: "name",
        type: "input",
        message: "What Department would you like to add?",
        validate: (departInput) => {
          if (departInput) {
            return true;
          } else {
            console.log("Please provide a department name");
            return false;
          }
        }
      }
  ]).then(function(res) {
      var query = connection.query(
          "INSERT INTO department SET ? ",
          {
            name: res.name
          },
          function(err) {
              if (err) throw err
              console.table(res);
              console.log(`${res.name} successfully added!`);
              init();
          }
      )
  })
}