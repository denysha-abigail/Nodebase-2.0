USE employees;

INSERT INTO department(name)
VALUES 
    ('Human Resources'),
    ('Marketing'),
    ('Finance'),
    ('Engineering');

INSERT INTO role(title, salary, department_id)
VALUES 
    ('HR Manager', 100000, 1),
    ('Brand Marketing Manager', 75000, 2),
    ('Financial Manager', 130000, 3),
    ('Senior Software Engineer', 150000, 4),
    ('Recruiter', 50000, 1),
    ('Administrative Assistant', 45000, 1),
    ('Copywriter', 55000, 2),
    ('Marketing Associate', 50000, 2),
    ('Financial Analyst', 80000, 3),
    ('Accountant', 70000, 3),
    ('Software Engineer', 90000, 4),
    ('Junior Software Engineer', 60000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id) 
VALUES  
    ('Alexis', 'Burgees', 1, NULL),
    ('Nathalie', 'Cooper', 2, NULL),
    ('Nakamoto', 'Hikari', 3, NULL),
    ('Adaline', 'Bowen', 4, NULL),
    ('Theodore', 'Jenkins', 5, 1),
    ('Mike', 'Nunez', 6, 1),
    ('Nicolas', 'Gomez', 7, 2),
    ('Antonio', 'Vargas', 8, 2),
    ('Genesis', 'Rodriguez', 9, 3),
    ('Xiang', 'Li', 10, 3),
    ('Noah', 'Mendoza', 11, 4),
    ('Wolf', 'Schmidt', 12, 4);