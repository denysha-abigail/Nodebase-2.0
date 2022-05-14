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
        message: 'Enter a role',
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter salary amount for the role',
      },
      {
        type: 'list',
        name: 'department',
        message: 'Select which Department the role belongs to',
        choices: ['Human Resources', 'Marketing', 'Finance', 'Engineering'],
      },
    ])
    .then(function (res) {
      var query = connection.query(
        'INSERT INTO role SET ? ',
        {
          title: res.title,
          salary: res.salary,
          department: res.department,
        },
        function (err) {
          if (err) throw err;
          console.table(res);
          init();
        }
      );
    });
}

// add an employee; allows user to enter first name, last name, role, and reporting manager to add to database
function addEmployee() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'firstName',
        message: 'Enter employee\s first name',
      },
      {
        type: 'input',
        name: 'lastName',
        message: 'Enter employee\s last name',
      },
      {
        type: 'list',
        name: 'role',
        message: 'Select a role for the employee',
        choices: [
          'Recruiter',
          'Administrative Assistant',
          'Copywriter',
          'Marketing Associate',
          'Financial Analyst',
          'Accountant',
          'Software Engineer',
          'Junior Software Engineer'
        ],
      },
      {
        type: 'list',
        name: 'manager',
        message: 'Select the employee\s manager',
        choices: [
          'Alexis Burgees - HR',
          'Nathalie Cooper - Marketing',
          'Nakamoto Hikari - Finance',
          'Adaline Bowen - Engineering'
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
  connection.query(
    'SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;',
    function (err, res) {
      // console.log(res)
      if (err) throw err;
      console.log(res);
      inquirer
        .prompt([
          {
            name: 'lastName',
            type: 'list',
            choices: function () {
              var lastName = [];
              for (var i = 0; i < res.length; i++) {
                lastName.push(res[i].last_name);
              }
              return lastName;
            },
            message: 'What is the employee\s last name?',
          },
          {
            name: 'role',
            type: 'list',
            message: 'What is the employee\s new title?',
            choices: selectRole(),
          },
        ])
        .then(function (val) {
          var roleId = selectRole().indexOf(val.role) + 1;
          connection.query(
            'UPDATE employee SET WHERE ?',
            {
              last_name: val.lastName,
            },
            {
              role_id: roleId,
            },
            function (err) {
              if (err) throw err;
              console.table(val);
              init();
            }
          );
        });
    }
  );
}


// Select Role title for addEmployee() prompt
var roleArr = [];
function selectRole() {
  connection.query('SELECT * FROM role', function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      roleArr.push(res[i].title);
    }

  })
  return roleArr;
}