const inquirer = require('inquirer');
require('console.table');
const db = require('./db');
const connection = require('./db/connection')

// initialization function
init();

function init() {
  inquirer
    .prompt([
      //start questions
      {
        type: 'list',
        name: 'options',
        message: 'Which option would you like to execute?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee',
          'Update a manager',
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
        case 'Update a manager':
          updateManager();
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
            console.log('Please enter a role title!');
            return false;
          }
        }
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Please enter a salary amount for the role:',
        validate: (salaryInput) => {
          if (salaryInput) {
            return true;
          } else {
            console.log('Please enter a salary amount!');
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
  connection.query(
    'SELECT employee.*, role.title AS role_title FROM employee INNER JOIN role on role.id = employee.role_id;',
    function (err, res) {
    console.table(res);
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'firstName',
        message: "Please enter the new employee\'s first name:",
        validate: (firstNameInput) => {
          if (firstNameInput) {
            return true;
          } else {
            console.log("Please enter the new employee\'s first name!");
            return false;
          }
        }
      },
      {
        type: 'input',
        name: 'lastName',
        message: "Please enter the new employee\'s last name:",
        validate: (lastNameInput) => {
          if (lastNameInput) {
            return true;
          } else {
            console.log("Please enter the new employee\'s last name!");
            return false;
          }
        }
      },
      {
        type: 'input',
        name: 'role',
        message: "Please choose a role_id number from the above table that corresponds to the new employee\'s role title (i.e. If new employee\'s role is HR Manager, write 1):",
        validate: (roleInput) => {
          if (roleInput) {
            return true;
          } else {
            console.log("Please enter a role_id number from the above table!");
            return false;
          }
        }
      },
      {
        type: 'input',
        name: 'manager',
        message: "Please enter the reporting manager\'s ID number (If new employee\'s role is a Manager position write null):",
        validate: (managerInput) => {
          if (managerInput) {
            return true;
          } else {
            console.log("Please enter the reporting manager\'s ID number!");
            return false;
          }
        }
      },
    ])
    .then(function (res) {
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
          console.log(`${res.firstName} ${res.lastName} successfully added!`)
          init();
        }
      );
  });
})
}

// update employee role & manager; allows user to enter an employee id and update that employee's existing role and manager with their new role and manager before adding to database
function updateEmployee() {
    connection.query(
    'SELECT employee.*, role.title AS role_title FROM employee INNER JOIN role on role.id = employee.role_id;',
    function (err, res) {
      console.table(res);
      inquirer
        .prompt([
          {
            type: "input",
            name: "employeeId",
            message: "Please enter the employee\'s ID number:",
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
            type: 'input',
            name: 'newRole',
            message: "Please choose a role_id number from the above table that corresponds to the employee\'s new role title (i.e. If employee\'s new role is HR Manager, write 1):", 
            validate: (newRoleInput) => {
              if (newRoleInput) {
                return true;
              } else {
                console.log("Please enter a role_id number from the above table!");
                return false;
              }
            }
          },
          {
            type: 'input',
            name: 'newManager',
            message: "Please enter the new manager\'s ID number (If employee\'s new role is now a Manager position write null):",
            validate: (newManagerInput) => {
              if (newManagerInput) {
                return true;
              } else {
                console.log("Please enter the new manager\'s ID number!");
                return false;
              }
            }
          },
        ])
        .then(function (val) {
          connection.query(
            'UPDATE employee SET role_id = ?, manager_id = ? WHERE id = ?;',
            [val.newRole, JSON.parse(val.newManager),val.employeeId],
            function (err) {
              if (err) throw err;
              console.table(val);
              console.log(`Employee with ID of ${val.employeeId} successfully updated!`);
              init();
            }
          );
      });
  });
}

function updateManager() {
  connection.query(
    'SELECT * FROM employee;',
    function (err, res) {
      console.log(res);
      inquirer
        .prompt([
          {
            type: "input",
            name: "employeeId",
            message: "Please enter the employee\'s ID number:",
            validate: (employeeIdInput) => {
              if (employeeIdInput) {
                return true;
              } else {
                console.log("Please enter the employee\'s ID number!");
                return false;
              }
            }
          },
          {
            type: "input",
            name: "managerId",
            message: "Please enter the new manager\'s ID number:",
            validate: (managerIdInput) => {
              if (managerIdInput) {
                return true;
              } else {
                console.log("Please enter the new managers\'s ID number!");
                return false;
              }
            }
          },
        ])
        .then(function (ans) {
          connection.query(
            'UPDATE employee SET manager_id = ? WHERE id = ?;',
            [ans.managerIdInput, ans.employeeIdInput],
            function (err) {
              if (err) throw err;
              console.table(ans);
              console.log(`Employee manager successfully updated!`);
              init();
            }
          );
      });
    });
}