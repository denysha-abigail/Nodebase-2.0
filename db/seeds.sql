USE employees;

INSERT INTO department(name)
VALUES
    ('HR'),
    ('Sales'),
    ('Engineering'),
    ('Finances'),
    ('Production');

INSERT INTO role(title, salary, department_id)
VALUES
    ('Manager', 150000, 1),
    ('Representative', 50000, 1),
    ('Manager', 150000, 2),
    ('Representative', 50000, 2),
    ('Manager', 150000, 3),
    ('Engineer', 80000, 3),
    ('Intern', 30000, 3),
    ('Manager', 150000, 4),
    ('Accountant', 70000, 4),
    ('Manager', 150000, 5), 
    ('Factory Worker', 45000, 5),
    ('Representative', 50000, 5);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
    ('Anitta', 'Gonzalez', 1, NULL),
    ('Geronimo', 'Perez', 3, 1),
    ('John', 'Smith', 4, 2),
    ('John', 'Joe', 1, 3),
    ('Christian', 'Gomez', 1, 4);


--     INSERT INTO department(name)
-- VALUES 
--     ('Customer Service'),
--     ('Engineering'),
--     ('Marketing'),
--     ('Finance');

-- INSERT INTO role(title, salary, department_id)
-- VALUES 
--     ('Customer Service Rep', 40000, 1),
--     ('Software Developer', 110000, 2),
--     ('Marketer', 90000, 3),
--     ('Accountant', 70000, 4),
--     ('Customer Manager', 75000, 1),
--     ('Developer Manager', 90000, 2),
--     ('Marketing Manager', 100000, 3),
--     ('Accounting Manager', 120000, 4);

-- INSERT INTO employee(first_name, last_name, role_id, manager_id) 
-- VALUES  
--     ('Bethany', 'Christian', 5, NULL),
--     ('Chandler', 'Acevedo', 6, NULL),
--     ('Bob', 'Smith', 7, NULL),
--     ('Sally', 'Fields', 8, NULL),
--     ('Mariella', 'Lewis', 1, 5),
--     ('Lola', 'Morris', 2, 6),
--     ('Shelly', 'Dixon', 3, 7),
--     ('Yasir', 'Sargent', 4, 8);