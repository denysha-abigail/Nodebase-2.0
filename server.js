const inquirer = require('inquirer');
require('console.table');
const db = require('./db');
const connection = require('./db/connection')

init();

function init() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'options',
        message: 'Hello! Which option would you like to execute?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'View employees by manager',
          'View employees by department',
          'View salaries by department',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee',
          'Update a manager',
          'Delete a department',
          'Delete a role',
          'Delete an employee',
          'Done',
        ],
      },
    ])
    .then(function (startAnswer) {
      switch (startAnswer.options) {
        case 'View all departments':
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
        case 'View employees by department':
          viewByDepartment();
          break;
        case 'View salaries by department':
          viewSalaries();
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
        case 'Delete a department':
          deleteDepartment();
          break;
        case 'Delete a role':
          deleteRole();
          break;
        case 'Delete an employee':
          deleteEmployee();
          break;
        default:
          console.log('Goodbye!');
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
      validate: (departmentInput) => {
        if (departmentInput) {
          return true;
        } else {
          console.log('Please provide a department name!');
          return false;
        }
      }
    }
  ]).then(function (val) {
    var query = connection.query(
      'INSERT INTO department SET ? ',
      {
        name: val.name
      },
      function (err) {
        if (err) throw err
        console.log(`${val.name} successfully added!`);
        connection.query(
          "SELECT * FROM department;",
          function (err, res) {
            console.log(`NOW VIEWING ALL DEPARTMENTS WITH ${val.name} INCLUDED:`);
            console.table(res);
            init();
          }
        )
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
        .then(function (val) {
          var query = connection.query(
            'INSERT INTO role SET ? ',
            {
              title: val.title,
              salary: val.salary,
              department_id: val.department
            },
            function (err) {
              if (err) throw err;
              console.log(`${val.title} role successfully added!`);
              connection.query(
                "SELECT role.id, role.title AS role_title, department.name as department_name, role.salary FROM role left join department on role.department_id = department.id;",
                function (err, res) {
                  console.log(`NOW VIEWING ALL ROLES WITH ${val.title} INCLUDED:`);
                  console.table(res);
                  init();
                }
              )
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
            .then(function (val) {
              var query = connection.query(
                'INSERT INTO employee SET ? ',
                {
                  first_name: val.firstName,
                  last_name: val.lastName,
                  role_id: val.role,
                  manager_id: JSON.parse(val.manager),
                },
                function (err) {
                  if (err) throw err;
                  console.log(`${val.firstName} ${val.lastName} successfully added!`);
                  connection.query(
                    "SELECT employee.id, employee.first_name, employee.last_name, role.title AS role_title, department.name AS department_name, CONCAT(e.first_name, ' ' ,e.last_name) AS reporting_manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id ORDER BY id;",
                    function (err, res) {
                      console.log(`NOW VIEWING ALL EMPLOYEES WITH ${val.firstName} ${val.lastName} INCLUDED:`);
                      console.table(res);
                      init();
                    }
                  )
                }
              );
            });
        });
    })
}

// update employee role & manager; allows user to enter an employee id and update that employee's existing role and manager with their new role and manager before adding to database
function updateEmployee() {
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title AS role_title, department.name AS department_name, CONCAT(e.first_name, ' ' ,e.last_name) AS reporting_manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id ORDER BY id;",
    function (err, res) {
      console.log('CURRENT EMPLOYEES TABLE:');
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
                message: "Please use the above CURRENT EMPLOYEES TABLE as a reference to enter the ID number of the employee you are updating (If employee\'s new role is now a Manager position, please write: null):",
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
                message: "Please use the above CURRENT EMPLOYEES TABLE as a reference to enter the new manager\'s ID number for the employee you are updating (If employee\'s new role is now a Manager position, please write: null):",
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
                [val.newRole, JSON.parse(val.newManager), val.employeeId],
                function (err) {
                  if (err) throw err;
                  console.log(`Employee with ID of ${val.employeeId} successfully updated!`);
                  connection.query(
                    `SELECT employee.id, employee.first_name, employee.last_name, role.title AS updated_role, CONCAT(e.first_name, ' ' ,e.last_name) AS updated_manager FROM employee INNER JOIN role on role.id = employee.role_id left join employee e on employee.manager_id = e.id WHERE employee.id = ${val.employeeId};`,
                    function (err, res) {
                      console.log(`NOW VIEWING EMPLOYEE WITH ID OF ${val.employeeId} AFTER SUCCESSFUL ROLE AND MANAGER UPDATE:`);
                      console.table(res);
                      init();
                    }
                  )
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
    "SELECT employee.id, employee.first_name, employee.last_name, role.title AS role_title, department.name AS department_name, CONCAT(e.first_name, ' ' ,e.last_name) AS reporting_manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id ORDER BY id;",
    function (err, res) {
      console.log('CURRENT EMPLOYEES TABLE:');
      console.table(res);
      inquirer
        .prompt([
          {
            type: "input",
            name: "employeeId",
            message: "Please use the above CURRENT EMPLOYEES TABLE as a reference to enter the ID number for the employee who needs their manager updated:",
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
            message: "Please use the above CURRENT EMPLOYEES TABLE as a reference to enter the new manager\'s ID number for the employee you are updating (If employee\'s new role is now a Manager position, please write: null):",
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
              console.log(`Manager for employee with ID of ${val.employeeId} successfully updated!`);
              connection.query(
                `SELECT employee.id, employee.first_name, employee.last_name, CONCAT(e.first_name, ' ' ,e.last_name) AS updated_manager FROM employee INNER JOIN role on role.id = employee.role_id left join employee e on employee.manager_id = e.id WHERE employee.id = ${val.employeeId};`,
                function (err, res) {
                  console.log(`NOW VIEWING EMPLOYEE WITH ID OF ${val.employeeId} AFTER SUCCESSFUL MANAGER UPDATE:`);
                  console.table(res);
                  init();
                }
              )
            }
          );
        });
    });
}

// * bonus - allows user to view employees by manager *
// view all employees by manager; allows user to enter the ID of a manager in order to view all employees under their supervision
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
            function (err, res) {
              if (err) throw err;
              console.log(`NOW VIEWING ALL EMPLOYEES UNDER THE MANAGER WITH AN ID OF ${val.viewByManager}:`);
              console.table(res);
              init();
            }
          );
        });
    })
}

// * bonus - allows user to view employees by department *
// view all employees by department; allows user to enter the department ID in order to view all employees who work for that department
function viewByDepartment() {
  connection.query(
    "SELECT department.id AS department_id, department.name as department_name FROM department ORDER BY id;",
    function (err, res) {
      console.log('DEPARTMENTS TABLE:');
      console.table(res);
      inquirer
        .prompt([
          {
            type: "input",
            name: "viewByDepartment",
            message: "'Please choose a department_id number from the above DEPARTMENTS TABLE to view all employees who work for that department (i.e. Human Resources - 1):'",
            validate: (departmentInput) => {
              if (departmentInput) {
                return true;
              } else {
                console.log("Please enter a department_id number!");
                return false;
              }
            }
          },
        ])
        .then(function (val) {
          connection.query(
            'SELECT employee.id, employee.first_name, employee.last_name, role.title AS role_title, department.name AS department_name FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id WHERE department.id = ?;',
            [val.viewByDepartment],
            function (err, res) {
              if (err) throw err;
              console.table(res);
              console.log(`You selected to view all employees under the Department with an ID of ${val.viewByDepartment}!`);
              init();
            }
          );
        });
    })
}

// * bonus - allows user to delete departments *
// delete a department; allows user to enter the department ID in order to delete it from database
function deleteDepartment() {
  connection.query(
    "SELECT department.id AS department_id, department.name as department_name FROM department ORDER BY id;",
    function (err, res) {
      console.log('DEPARTMENTS TABLE:');
      console.table(res);
      inquirer
        .prompt([
          {
            type: "input",
            name: "deleteDepartment",
            message: "'Please choose a department_id number from the above DEPARTMENTS TABLE to delete (i.e. Human Resources - 1):'",
            validate: (deleteInput) => {
              if (deleteInput) {
                return true;
              } else {
                console.log("Please enter a department_id number!");
                return false;
              }
            }
          },
        ])
        .then(function (val) {
          connection.query(
            'DELETE FROM department WHERE id = ?;',
            [val.deleteDepartment],
            function (err, res) {
              if (err) throw err;
              console.log(`Department with ID of ${val.deleteDepartment} successfully deleted!`);
              connection.query(
                `SELECT department.id AS department_id, department.name as department_name FROM department ORDER BY id;`,
                function (err, res) {
                  console.log(`NOW VIEWING ALL DEPARTMENTS AFTER DEPARTMENT WITH ID OF ${val.deleteDepartment} WAS DELETED:`);
                  console.table(res);
                  init();
                }
              )
            }
          );
        });
    })
}

// * bonus - allows user to delete roles *
// delete a role; allows user to enter the role ID in order to delete it from database
function deleteRole() {
  connection.query(
    "SELECT role.id AS role_id, role.title AS role_title FROM role;",
    function (err, res) {
      console.log('ROLE TABLE:');
      console.table(res);
      inquirer
        .prompt([
          {
            type: "input",
            name: "deleteRole",
            message: "'Please choose a role_id number from the above ROLE TABLE to delete (i.e. HR Manager - 1):'",
            validate: (deleteInput) => {
              if (deleteInput) {
                return true;
              } else {
                console.log("Please enter a role_id number!");
                return false;
              }
            }
          },
        ])
        .then(function (val) {
          connection.query(
            'DELETE FROM role WHERE id = ?;',
            [val.deleteRole],
            function (err, res) {
              if (err) throw err;
              console.log(`Role with ID of ${val.deleteRole} successfully deleted!`);
              connection.query(
                `SELECT role.id AS role_id, role.title AS role_title FROM role;`,
                function (err, res) {
                  console.log(`NOW VIEWING ALL ROLES AFTER ROLE WITH ID OF ${val.deleteRole} WAS DELETED:`);
                  console.table(res);
                  init();
                }
              )
            }
          );
        });
    })
}

// * bonus - allows user to delete employees *
// delete an employee; allows user to enter the employee ID in order to delete him/her/them from database
function deleteEmployee() {
  connection.query(
    "SELECT employee.id, CONCAT(employee.first_name, ' ' ,employee.last_name) AS employee_name FROM employee;",
    function (err, res) {
      console.log('EMPLOYEES TABLE:');
      console.table(res);
      inquirer
        .prompt([
          {
            type: "input",
            name: "deleteEmployee",
            message: "'Please choose an employee ID number from the above EMPLOYEES TABLE to delete (i.e. Adaline Bowen - 4):'",
            validate: (deleteInput) => {
              if (deleteInput) {
                return true;
              } else {
                console.log("Please enter an employee ID number!");
                return false;
              }
            }
          },
        ])
        .then(function (val) {
          connection.query(
            'DELETE FROM employee WHERE id = ?;',
            [val.deleteEmployee],
            function (err, res) {
              if (err) throw err;
              console.log(`Employee with ID of ${val.deleteEmployee} successfully deleted!`);
              connection.query(
                `SELECT employee.id, CONCAT(employee.first_name, ' ' ,employee.last_name) AS employee_name FROM employee;`,
                function (err, res) {
                  console.log(`NOW VIEWING ALL EMPLOYEES AFTER EMPLOYEE WITH ID OF ${val.deleteEmployee} WAS DELETED:`);
                  console.table(res);
                  init();
                }
              )
            }
          );
        });
    })
}

// * bonus - allows user to view the total utilized budget of a department — in other words, the combined salaries of all employees in that department *
// view combined salaries; allows user to enter the department ID to view combined salaries of all employees in that department
function viewSalaries() {
  connection.query(
    "SELECT department.id AS department_id, department.name as department_name FROM department ORDER BY id;",
    function (err, res) {
      console.log('DEPARTMENTS TABLE:');
      console.table(res);
      inquirer
        .prompt([
          {
            type: "input",
            name: "viewSalary",
            message: "Please choose a department_id number from the above DEPARTMENTS TABLE to view the combined salaries of all employees in that department (i.e. Human Resources - 1):",
            validate: (departmentIdInput) => {
              if (departmentIdInput) {
                return true;
              } else {
                console.log("Please enter a department_id number!");
                return false;
              }
            }
          },
        ])
        .then(function (val) {
          connection.query(
            'SELECT department_id, SUM(salary) AS combined_salary FROM role WHERE department_id = ? GROUP BY department_id;',
            [val.viewSalary],
            function (err, res) {
              if (err) throw err;
              console.log(`NOW VIEWING COMBINED SALARIES IN DEPARTMENT WITH ID OF ${val.viewSalary}:`);
              console.table(res);
              init();
            }
          );
        });
    })
}