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
        type: 'list',
        name: 'options',
        message: 'Which would you like to view?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee',
          'Done',
        ],
      },
    ])

    .then(function (startAnswer) {
      switch (startAnswer.options) {
        case 'View all departments':
          //run the view departments function
          viewAllDepartments();
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee':
          updateEmployee();
          break;
        default:
          process.exit();
      }
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

// add department; allows user to enter name of department to add to database
function addDepartment() {
  inquirer.prompt([
      {
        name: 'name',
        type: 'input',
        message: 'What Department would you like to add?',
        validate: (departInput) => {
          if (departInput) {
            return true;
          } else {
            console.log('Please provide a department name!');
            return false;
          }
        }
      }
  ]).then(function(res) {
      var query = connection.query(
          'INSERT INTO department SET ? ',
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
};

// add role; allows user to enter name, salary, and name of department to add to database
function addRole() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Please enter a role title:',
        validate: (roleInput) => {
          if (roleInput) {
            return true;
          } else {
            console.log('Please provide a role title!');
            return false;
          }
        }
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Please enter salary amount for the role:',
        validate: (salaryInput) => {
          if (salaryInput) {
            return true;
          } else {
            console.log('Please provide a salary amount!');
            return false;
          }
        }
      },
      {
        type: 'list',
        name: 'department',
        message: 'Please select which Department the role belongs to (Human Resources - 1, Marketing - 2, Financing - 3, Engineering - 4)',
        choices: ['1', '2', '3', '4'],
      },
    ])
    .then(function (res) {
      var query = connection.query(
        'INSERT INTO role SET ? ',
        {
          title: res.title,
          salary: res.salary,
          department_id: res.department
        },
        function (err) {
          if (err) throw err;
          console.table(res);
          console.log(`${res.title} role successfully added!`);
          init();
        }
      );
    });
};

// add an employee; allows user to enter first name, last name, role, and reporting manager to add to database
function addEmployee() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'firstName',
        message: "Please enter employee\'s first name",
        validate: (firstNameInput) => {
          if (firstNameInput) {
            return true;
          } else {
            console.log("Please provide the employee\'s first name!");
            return false;
          }
        }
      },
      {
        type: 'input',
        name: 'lastName',
        message: "Please enter employee\'s last name",
        validate: (lastNameInput) => {
          if (lastNameInput) {
            return true;
          } else {
            console.log("Please provide the employee\'s last name!");
            return false;
          }
        }
      },
      {
        type: 'list',
        name: 'role',
        message: 'Please select a role for the employee (HR Manager - 1, Brand Marketing Manager - 2, Financial Manager - 3, Senior Software Engineer - 4, Recruiter - 5, Administrative Assistant - 6, Copywriter - 7, Marketing Associate - 8, Financial Analyst - 9, Accountant - 10, Software Engineer - 11, Junior Software Engineer - 12)',
        choices: [
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '10',
          '11',
          '12'
        ],
      },
      {
        type: 'list',
        name: 'manager',
        message: "Please select the employee\'s manager (Alexis Burgees (Human Resources) - 1, Nathalie Cooper (Marketing) - 2, Nakamoto Hikari (Finance) - 3, Adaline Bowen (Engineering) - 4, If employee is a Manager - null)",
        choices: [
          '1',
          '2',
          '3',
          '4',
          'null'
        ],
      },
    ])
    .then(function (res) {
      console.log(res)
      console.log(res.manager)
      var query = connection.query(
        'INSERT INTO employee SET ? ',
        {
          first_name: res.firstName,
          last_name: res.lastName,
          role_id: res.role,
          manager_id: JSON.parse(res.manager),
        },
        function (err) {
          if (err) throw err;
          console.table(res);
          init();
        }
      );
    });
}

// update employee role; allows user to select an employee and update their existing role with a new role and add to database
function updateEmployee() {
      inquirer
        .prompt([
          {
            type: "input",
            name: "employeeId",
            message: "Please enter the employee\'s ID number? ",
            validate: (idInput) => {
              if (idInput) {
                return true;
              } else {
                console.log("Please enter the employee\'s ID number!");
                return false;
              }
            }
          },
          {
            type: 'list',
            name: 'currentRole',
            message: "Please select the employee\'s current role (HR Manager - 1, Brand Marketing Manager - 2, Financial Manager - 3, Senior Software Engineer - 4, Recruiter - 5, Administrative Assistant - 6, Copywriter - 7, Marketing Associate - 8, Financial Analyst - 9, Accountant - 10, Software Engineer - 11, Junior Software Engineer - 12)",
            choices: [
              '1',
              '2',
              '3',
              '4',
              '5',
              '6',
              '7',
              '8',
              '9',
              '10',
              '11',
              '12'
            ],
          },
          {
            type: 'list',
            name: 'currentManager',
            message: "Please select the employee\'s current manager (Alexis Burgees (Human Resources) - 1, Nathalie Cooper (Marketing) - 2, Nakamoto Hikari (Finance) - 3, Adaline Bowen (Engineering) - 4, If employee is currently a Manager - null)",
            choices: [
              '1',
              '2',
              '3',
              '4',
              'null'
            ],
          },
          {
            type: 'list',
            name: 'newRole',
            message: "Please select the employee\'s new role (HR Manager - 1, Brand Marketing Manager - 2, Financial Manager - 3, Senior Software Engineer - 4, Recruiter - 5, Administrative Assistant - 6, Copywriter - 7, Marketing Associate - 8, Financial Analyst - 9, Accountant - 10, Software Engineer - 11, Junior Software Engineer - 12)",
            choices: [
              '1',
              '2',
              '3',
              '4',
              '5',
              '6',
              '7',
              '8',
              '9',
              '10',
              '11',
              '12'
            ],
          },
          {
            type: 'list',
            name: 'newManager',
            message: "Please select the employee\'s new manager (Alexis Burgees (Human Resources) - 1, Nathalie Cooper (Marketing) - 2, Nakamoto Hikari (Finance) - 3, Adaline Bowen (Engineering) - 4, If employee got promoted to a Manager position - null)",
            choices: [
              '1',
              '2',
              '3',
              '4',
              'null'
            ],
          },
        ])
        .then(function (val) {
          console.log(val)
          console.log(val.newManager)
          connection.query(
            'UPDATE employee SET role_id = ?, manager_id = ? WHERE role_id = ? AND manager_id = ? AND id = ?;',
            {
              role_id: val.newRole,
              manager_id: JSON.parse(val.newManager)
            },
            {
              role_id: val.currentRole,
              manager_id: JSON.parse(val.currentManager),
              id: val.employeeId
            },
            function (err) {
              if (err) throw err;
              console.table(val);
              init();
            }
        );
    });
}

// updateEmployee()
// 'UPDATE employee SET role_id = ?, manager_id = ? WHERE role_id = ? AND manager_id = ? AND id = ?;',