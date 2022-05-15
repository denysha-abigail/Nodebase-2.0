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
          'View employees by manager',
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
        case 'View employees by manager':
          viewByManager();
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
    console.log('NOW VIEWING ALL DEPARTMENTS:')
    console.table(data)
  }).then(() => init())
}

function viewAllRoles() {
  db.findRoles().then(([data]) => {
    console.log('NOW VIEWING ALL ROLES:')
    console.table(data)
  }).then(() => init())
}

function viewAllEmployees() {
  db.findEmployees().then(([data]) => {
    console.log('NOW VIEWING ALL EMPLOYEES:')
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
  ]).then(function (res) {
    var query = connection.query(
      'INSERT INTO department SET ? ',
      {
        name: res.name
      },
      function (err) {
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
  connection.query(
    'SELECT department.id AS department_id, department.name as department_name FROM department ORDER BY id;',
    function (err, res) {
      console.log('DEPARTMENTS TABLE:');
      console.table(res);
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
            type: 'input',
            name: 'department',
            message: 'Please choose a department_id number from the above DEPARTMENTS TABLE that corresponds to the department the new role title belongs to (i.e. Human Resources - 1):',
            validate: (departmentInput) => {
              if (departmentInput) {
                return true;
              } else {
                console.log('Please enter a department_id number!');
                return false;
              }
            }
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
    });
};

// add an employee; allows user to enter first name, last name, role, and reporting manager to add to database
function addEmployee() {
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title AS role_title, department.name AS department_name, CONCAT(e.first_name, ' ' ,e.last_name) AS reporting_manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id WHERE e.id IS NULL ORDER BY id;",
    function (err, res) {
      console.log('CURRENT MANAGERS TABLE:');
      console.table(res);
      connection.query(
        'SELECT role.id AS role_id, role.title AS role_title FROM role;',
        function (err, res) {
          console.log('ROLE TABLE:');
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
                message: "Please choose a role_id number from the above ROLE TABLE that corresponds to the employee\'s new role title (i.e. If employee\'s new role is HR Manager, write 1):",
                validate: (roleInput) => {
                  if (roleInput) {
                    return true;
                  } else {
                    console.log("Please enter a role_id number from the above ROLE TABLE!");
                    return false;
                  }
                }
              },
              {
                type: 'input',
                name: 'manager',
                message: "Please use the above CURRENT MANAGERS TABLE as a reference to enter the new manager\'s employee_id number for the employee you are updating (If employee\'s new role is now a Manager position, please write: null):",
                validate: (managerInput) => {
                  if (managerInput) {
                    return true;
                  } else {
                    console.log("Please enter the new manager\'s employee_id number!");
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
        });
    })
}

// update employee role & manager; allows user to enter an employee id and update that employee's existing role and manager with their new role and manager before adding to database
function updateEmployee() {
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title AS role_title, department.name AS department_name, CONCAT(e.first_name, ' ' ,e.last_name) AS reporting_manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id WHERE e.id IS NULL ORDER BY id;",
    function (err, res) {
      console.log('CURRENT MANAGERS TABLE:');
      console.table(res);
      connection.query(
        'SELECT role.id AS role_id, role.title AS role_title FROM role;',
        function (err, res) {
          console.log('ROLE TABLE:');
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
                message: "Please choose a role_id number from the above ROLE TABLE that corresponds to the employee\'s new role title (i.e. If employee\'s new role is HR Manager, write 1):",
                validate: (newRoleInput) => {
                  if (newRoleInput) {
                    return true;
                  } else {
                    console.log("Please enter a role_id number from the above ROLE TABLE!");
                    return false;
                  }
                }
              },
              {
                type: 'input',
                name: 'newManager',
                message: "Please use the above CURRENT MANAGERS TABLE as a reference to enter the new manager\'s employee_id number for the employee you are updating (If employee\'s new role is now a Manager position, please write: null):",
                validate: (newManagerInput) => {
                  if (newManagerInput) {
                    return true;
                  } else {
                    console.log("Please enter the new manager\'s employee_id number!");
                    return false;
                  }
                }
              },
            ])
            .then(function (val) {
              connection.query(
                'UPDATE employee SET role_id = ?, manager_id = ? WHERE id = ?;',
                [val.newRole, JSON.parse(val.newManager), val.employeeId],
                function (err) {
                  if (err) throw err;
                  console.table(val);
                  console.log(`Employee with ID of ${val.employeeId} successfully updated!`);
                  init();
                }
              );
            });
        });
    });
}

// * bonus - allows user to update employee managers *
// update a manager; allows user to enter an employee id and update that employee's existing manager with their new manager before adding to database
function updateManager() {
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title AS role_title, department.name AS department_name, CONCAT(e.first_name, ' ' ,e.last_name) AS reporting_manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id WHERE e.id IS NULL ORDER BY id;",
    function (err, res) {
      console.log('CURRENT MANAGERS TABLE:');
      console.table(res);
      inquirer
        .prompt([
          {
            type: "input",
            name: "employeeId",
            message: "Please enter the ID number for the employee who needs their manager updated:",
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
            name: 'newManager',
            message: "Please use the above CURRENT MANAGERS TABLE as a reference to enter the new manager\'s ID number for the employee you are updating (If employee\'s new role is now a Manager position, please write: null):",
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
            'UPDATE employee SET manager_id = ? WHERE id = ?;',
            [JSON.parse(val.newManager), val.employeeId],
            function (err) {
              if (err) throw err;
              console.table(val);
              console.log(`Manager for employee with ID of ${val.employeeId} successfully updated!`);
              init();
            }
          );
        });
    });
}

// * bonus - allows user to view employees by manager *
function viewByManager() {
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title AS role_title, department.name AS department_name, CONCAT(e.first_name, ' ' ,e.last_name) AS reporting_manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id WHERE e.id IS NULL ORDER BY id;",
    function (err, res) {
      console.log('CURRENT MANAGERS TABLE:');
      console.table(res);
      inquirer
        .prompt([
          {
            type: "input",
            name: "viewByManager",
            message: "Please use the above CURRENT MANAGERS TABLE as a reference to enter the manager\'s ID number (i.e. If you want to view all employees under Adaline Bowen (id = 4), write 4):",
            validate: (managerInput) => {
              if (managerInput) {
                return true;
              } else {
                console.log("Please enter the manager\'s ID number!");
                return false;
              }
            }
          },
        ])
        .then(function (val) {
          connection.query(
            'SELECT * FROM employee WHERE manager_id = ?;',
            [JSON.parse(val.viewByManager)],
            function (err) {
              if (err) throw err;
              console.table(val);
              console.log(`You selected to view all employees under the Manager with an ID of ${val.viewByManager}!`);
              init();
            }
          );
        });
    })
}

// * bonus - allows user to view employees by department *



// * bonus - allows user to delete departments, roles, and employees *



// * bonus - allows user to view the total utilized budget of a department — in other words, the combined salaries of all employees in that department *




