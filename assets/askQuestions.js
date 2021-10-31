//For inquirer, console.table, and connection to MySQL
const inquirer = require("inquirer");
const cTable = require('console.table');
const db = require('../db/connection');


//Asks for user input and selects correct function
const askQuestions = () => {
    inquirer.prompt({
        message: "What would you like to do?",
        type: "list",
        choices: ["View all employees", "View all departments", "View all roles", "Add a department", "Add a role", "Add an employee", "Update an employee role", "View utilized department budget", "Exit"],
        name: "pick",
        loop: false
    }).then(response => {
        let userChoice = response.pick;

        switch(userChoice) {
            case "View all employees":
                viewEmployees();
                break;
            case"View all departments":
                viewDepartments();
                break;
            case "View all roles":
                viewRoles();
                break;
            case "Add a department":
                addDepartment();
                break;
            case "Add a role":
                addRole();
                break;
            case "Add an employee":
                addEmployee();
                break;
            case "Update an employee role":
                updateEmployee();
                break;
            case "View utilized department budget":
                viewBudgetUtil();
                break;
            default:
                console.log("Goodbye!");
                db.end();
                break;
        }
    })
}

//Gets data from detailed query to console employee information
const viewEmployees = async () => {
    const sql = await getDetailedInfo();

    console.table("Current employees", sql);
    askQuestions();
}

//Consoles departments
const viewDepartments = () => {
    const sql = 'SELECT * FROM departments ORDER BY id';
    db.query(sql, (err, rows) => {
        if(err) {
            console.log("An error occurred!");
            askQuestions();
        } else {
            console.table("Current departments", rows);
            askQuestions();
        }
    })
}

//Consoles Roles with department table data
const viewRoles = () => {
    const sql = 'SELECT roles.id as role_id, roles.title, roles.salary, departments.name AS department_name FROM roles JOIN departments on roles.department_id = departments.id ORDER BY roles.id';
    db.query(sql, (err, rows) => {
        if(err) {
            console.log("An error occurred!");
            askQuestions();
        } else {
            console.table("Current roles", rows);
            askQuestions();
        }
    })
}

//Adds a department based on user input
const addDepartment = () => {
    inquirer.prompt({
        message: "What is the name of the department you would like to add?",
        type: 'input',
        name: 'name',
        validate: hasName => {
            if (hasName) {
              return true;
            } else {
              console.log('Please enter a name for your new department!');
              return false;
            }
        }
    }).then(result => {
        let departmentName = result.name;

        const sql = 'INSERT INTO departments (name) VALUES (?)';
        db.query(sql, departmentName, (err, rows) => {
            if(err) {
                console.log("An error occurred!");
                askQuestions();
            } else {
                console.table("New department created!");
                askQuestions();
            }
        })
    })
}

//Adds a role based on user input
const addRole = async () => {
    let rolesArray = await getRoleNames(); 

    console.table("Current roles:", rolesArray);

    inquirer.prompt([
        {
        message: "What is the title of the role you would like to add?",
        type: 'input',
        name: 'title',
        validate: hasTitle => {
            if (hasTitle) {
              return true;
            } else {
              console.log('Please enter a title for your new role!');
              return false;
            }
        }}, {
        message: "What is the salary of the role you would like to add?",
        type: 'input',
        name: 'salary',
        validate: hasSalary => {
            if (hasSalary>0) {
              return true;
            } else {
              console.log('Please enter salary for your new role!');
              return false;
            }
        }},
        {
        message: "What is the department ID of the role you would like to add?",
        type: 'input',
        name: 'departmentID',
        validate: hasID => {
            if (hasID) {
              return true;
            } else {
              console.log('Please enter a department ID for your new role!');
              return false;
            }
        }}
    ]).then(result => {
        let newRole = [result.title, result.salary, result.departmentID];

        const sql = 'INSERT INTO roles (title,salary,department_id) VALUES (?,?,?)';
        db.query(sql, newRole, (err, rows) => {
            if(err) {
                console.log("An error occurred! Ensure you are using a valid department ID.");
                
            } else {
                console.table("New role created!");
                askQuestions();
            }
        })
    })
}

//Adds an employee based on user input
const addEmployee = async () => {
    let rolesArray = await getRoleNames();
    let employeesArray = await getEmployeeNames();

    console.table("Current roles:", rolesArray);
    console.table("Current employees:", employeesArray);

    inquirer.prompt([
        {
        message: "What is the first name of the new employee?",
        type: 'input',
        name: 'firstName',
        validate: hasFirstName => {
            if (hasFirstName) {
              return true;
            } else {
              console.log('Please enter a first name for your new employee!');
              return false;
            }
        }},{
        message: "What is the last name of the new employee?",
        type: 'input',
        name: 'lastName',
        validate: hasLastName => {
            if (hasLastName) {
              return true;
            } else {
              console.log('Please enter a last name for your new employee!');
              return false;
            }
        }}, {
        message: "What is the role ID for your new employee?",
        type: 'input',
        name: 'roleID',
        validate: hasRoleID => {
            if (hasRoleID) {
              return true;
            } else {
              console.log('Please enter a valid role ID for your new employee!');
              return false;
            }
        }},
        {
        message: "If your new employee has a manager, enter the manager's ID. Otherwise enter 0",
        type: 'input',
        name: 'managerID',
        validate: hasID => {
            if (hasID) {
              return true;
            } else {
              console.log('Please enter a valid manager ID!');
              return false;
            }
        }}
    ]).then(result => {
        let newEmployee = [];

        if(result.managerID == 0) {
            newEmployee  = [result.firstName, result.lastName, result.roleID, null];
        } else {
            newEmployee  = [result.firstName, result.lastName, result.roleID, result.managerID];
        }

        const sql = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)';
        db.query(sql, newEmployee, (err, rows) => {
            if(err) {
                console.log("An error occurred! Ensure you are using a valid data.");
                askQuestions();
            } else {
                console.table("New employee added!");
                askQuestions();
            }
        })
    })
}

//Updates Employees
const updateEmployee = async () => {
    let employeesArray = await getEmployeeNames();

    let concatName = [];

    employeesArray.forEach(employee => {
        concatName.push(employee.first_name + " " + employee.last_name)
    });

    console.table("Current employees", employeesArray);

    inquirer.prompt([
        {
            type: "list",
            message: "Please select an employee:",
            name: "employee",
            choices: concatName
        },
        {
            message: "Enter the ID of the employee's new role",
            type: 'input',
            name: 'roleID',
            validate: roleID => {
                if (roleID) {
                    return true;
                } else {
                    console.log('Please enter a valid role ID!');
                    return false;
                }
            }
        },
        {
            message: "Who is the employee's new manager? Enter 0 for no manager",
            type: 'input',
            name: 'newManagerID',
            validate: managerID => {
                if (managerID) {
                    return true;
                } else {
                    console.log('Please enter a valid role ID!');
                    return false;
                }
            }
        }
    ]).then(result => {
        let employeeName = result.employee.split(" ");

        let employeeID = null;

        for(let i = 0; i < employeesArray.length; i++) {
            if((employeesArray[i].first_name === employeeName[0]) && (employeesArray[i].last_name === employeeName[1])) {
                employeeID = employeesArray[i].id;
                employeeManagerID = employeesArray[i].managerID;
                break;
            }
        }

        console.log(employeeID)

        if(result.newManagerID == 0) {
            result.newManagerID = null;
        }

        let updateEmployee = [result.roleID, employeeID];

        const sql = 'UPDATE employees SET role_id = ? WHERE id = ?';
        db.query(sql, updateEmployee, (err, rows) => {
            if(err) {
                console.log("An error occurred! Ensure you are using a valid data.");
                
            } else {
                console.log("Employee updated!");
            }
        })

        let updateManagerID = [result.newManagerID, employeeID];

        console.log("we are here");

        const sqlManagerID = 'UPDATE employees SET manager_id = ? WHERE id = ?';
        db.query(sqlManagerID, updateManagerID, (err, rows) => {
            if(err) {
                console.log("An error occurred! Ensure you are using a valid data.");
                
            } else {
                console.log("Employee's manager updated!");
            }
        })


        console.log("we are here 2");
        askQuestions();
    });  
}

const viewBudgetUtil = async () => {
    let detailedInfoArray =  await getDetailedInfo();
    let departmentsArray = await getDepartmentNames();

    let departmentChoices = [];

    departmentsArray.forEach(department => {
        departmentChoices.push(department.name);
    });

    inquirer.prompt([
        {
            type: "list",
            message: "Select one of the following departments to view the current utilized budget",
            name: "choice",
            choices: departmentChoices
        }
    ]).then( result => {
        let sumOfSalaries = 0;


        detailedInfoArray.forEach(employee => {
            if(employee.department_name == result.choice) {
                let salary = Number(employee.salary)
                sumOfSalaries += salary;
            }
        });

        console.table("The total utilized budget of " + result.choice + " is: $" + sumOfSalaries);
        askQuestions();
    })
}

//Below are several getter functions to aid in adding features. Useful to manipulate to console specific information

//Gets employee names with roles
const getEmployeeNames = () => {
    let employeesArray = [];

    return new Promise ((resolve, reject) => {
        db.query('SELECT * FROM employees JOIN roles on employees.role_id = roles.id', (err, rows) => {
            if(err) {
                reject(err);
                return;
            } 
            for(let i = 0; i < rows.length; i++) {
                employeesArray.push(rows[i]);
            }
            resolve(employeesArray);
        })
    })
}

//Gets roles and role names with department table data
const getRoleNames = () => {
    let roleArray = [];

    return new Promise ((resolve, reject) => {
        db.query('SELECT roles.id as role_id, roles.title, roles.salary, departments.id AS department_id, departments.name AS department_name FROM roles JOIN departments on roles.department_id = departments.id ORDER BY roles.id', (err, rows) => {
            if(err) {
                reject(err);
                return;
            } 
            for(let i = 0; i < rows.length; i++) {
                roleArray.push(rows[i]);
            }
            resolve(roleArray);
        })
    })
}

//Gets very detailed info. Used to show table of employees with manager
const getDetailedInfo = () => {
    let infoArray = [];

    return new Promise ((resolve, reject) => {
        db.query('SELECT employees.id, employees.first_name, employees.last_name, roles.id AS role_id, roles.title AS role_title, roles.salary, employees.manager_id, CONCAT(e.first_name, " ", e.last_name) AS manager_name, departments.name AS department_name FROM employees JOIN roles ON employees.role_id = roles.id LEFT JOIN employees e ON employees.manager_id = e.id JOIN departments ON roles.department_id = departments.id ORDER BY employees.id', (err, rows) => {
            if(err) {
                reject(err);
                return;
            } 
            for(let i = 0; i < rows.length; i++) {
                infoArray.push(rows[i]);
            }
            resolve(infoArray);
        })
    })
}

//Gets department names
const getDepartmentNames = () => {
    let deptArray = [];

    return new Promise ((resolve, reject) => {
        db.query('SELECT * FROM departments', (err, rows) => {
            if(err) {
                reject(err);
                return;
            } 
            for(let i = 0; i < rows.length; i++) {
                deptArray.push(rows[i]);
            }
            resolve(deptArray);
        })
    })
}

askQuestions();