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
            console.log('Please provide a department name');
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
        message: 'Please enter a role',
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Please enter salary amount for the role',
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
      },
      {
        type: 'input',
        name: 'lastName',
        message: "Please enter employee\'s last name",
      },
      {
        type: 'list',
        name: 'role',
        message: 'Please select a role for the employee (Recruiter - 5, Administrative Assistant - 6, Copywriter - 7, Marketing Associate - 8, Financial Analyst - 9, Accountant - 10, Software Engineer - 11, Junior Software Engineer - 12)',
        choices: [
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
        message: "Please select the employee\'s manager (Alexis Burgees (Human Resources) - 1, Nathalie Cooper (Marketing) - 2, Nakamoto Hikari (Finance) - 3, Adaline Bowen (Engineering) - 4)",
        choices: [
          '1',
          '2',
          '3',
          '4'
        ],
      },
    ])
    .then(function (res) {
      var query = connection.query(
        'INSERT INTO employee SET ? ',
        {
          first_name: res.firstName,
          last_name: res.lastName,
          manager_id: res.manager,
          role_id: res.role,
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
            message: "Please select the employee\'s current manager (Alexis Burgees (Human Resources) - 1, Nathalie Cooper (Marketing) - 2, Nakamoto Hikari (Finance) - 3, Adaline Bowen (Engineering) - 4, If employee is currently a Manager - NULL)",
            choices: [
              '1',
              '2',
              '3',
              '4',
              'NULL'
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
            message: "Please select the employee\'s new manager (Alexis Burgees (Human Resources) - 1, Nathalie Cooper (Marketing) - 2, Nakamoto Hikari (Finance) - 3, Adaline Bowen (Engineering) - 4, If employee got promoted to a Manager position - NULL)",
            choices: [
              '1',
              '2',
              '3',
              '4',
              'NULL'
            ],
          },
        ])
        .then(function (val) {
          console.log(val);
          connection.query(
            'UPDATE employee SET role_id = ?, manager_id = ? WHERE role_id = ? AND manager_id = ? AND id = ?;',
            {
              role_id: val.newRole,
              manager_id: val.newManager
            },
            {
              role_id: val.currentRole,
              manager_id: val.currentManager,
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