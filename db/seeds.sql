INSERT INTO departments (name)
VALUES
    ("Scrub Department"),
    ("Keep Grinding Department"),
    ("Pretty High Up Department"),
    ("Highest Department");

INSERT INTO roles (title, salary, department_id)
VALUES
    ("Scrub", 50, 1),
    ("Mr. Manager", 150000, 2),
    ("Major", 200000, 3),
    ("CEO", 1000000, 4);


INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ("Bobby", "Tables", 1, 2),
    ("Manager", "Manager", 2, 3),
    ("Major", "Major", 3, 4),
    ("George", "Bluth", 4, null);