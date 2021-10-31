INSERT INTO departments (name)
VALUES
    ("Scrub department"),
    ("Keep Grinding Department"),
    ("Pretty High Up Department"),
    ("Highest Department");

INSERT INTO roles (title, salary, department_id)
VALUES
    ("Mr. Manager", 200000, 1),
    ("Scrub", 50, 2),
    ("Worker", 100, 3),
    ("CEO", 1000000, 4);


INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ("Manager", "Manager", 1, null),
    ("Scrub", "Scrub", 2, 1),
    ("Worker", "Worker", 3, 1),
    ("CEO", "CEO", 4, null);