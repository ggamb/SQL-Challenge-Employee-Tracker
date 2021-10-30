INSERT INTO departments (name)
VALUES
    ("Test department"),
    ("Tester"),
    ("Testest"),
    ("Testitestst");

INSERT INTO roles (title, salary, department_id)
VALUES
    ("Test manager", 200000, 1),
    ("Test scrub", 50, 1),
    ("Test CEO", 1000000, 1);


INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ("Manager", "Manager", 1, null),
    ("Scrub", "Scrub", 2, 1),
    ("CEO", "CEO", 3, null);