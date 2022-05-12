const connection =  require('./connection')

class Data {
    constructor(connection){
        this.connection = connection
    }

    findDepartments(){
        return this.connection.promise().query('SELECT * FROM department;')
    }

    findRoles(){
        // Table with: role id, job title, department name, and salary
        return this.connection.promise().query('SELECT role.id, role.title, department.name as department_name, role.salary FROM role left join department on role.department_id = department.id;')
    }

    findEmployees(){
       // employee data: employee ids, first, last, job titles, department name, salaries, and managers full name that employees report to (look into CONCAT() mysql)
       //employee table: employee.id, employee.first_name, employee.last_name
       // role table: role.title, role.salary, 
        return this.connection.promise().query('SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary FROM employee left join role on employee.role_id = role.id;');
    }
}

module.exports = new Data(connection)