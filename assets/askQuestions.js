const inquirer = require("inquirer");
const cTable = require('console.table');
const db = require('../db/connection');


const askQuestions = () => {
    inquirer.prompt({
        message: "What would you like to do?",
        type: "list",
        choices: ["View all employees", "View all departments", "View all roles", "Add a department", "Add a role", "Add an employee", "Update an employee role", "Exit"],
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
            default:
                console.log("Goodbye!");
                db.end();
                break;
        }
    })
}


const viewEmployees = () => {
    const sql = 'SELECT employees.id, employees.first_name, employees.last_name, roles.title, roles.salary, departments.name FROM employees JOIN roles on employees.role_id = roles.id JOIN departments on roles.department_id = departments.id';
    db.query(sql, (err, rows) => {
        if(err) {
            console.log("An error occurred!");
            return;
        } else {
            console.table("Current employees", rows);
            askQuestions();
        }
    })
}

const viewDepartments = () => {
    const sql = 'SELECT * FROM departments';
    db.query(sql, (err, rows) => {
        if(err) {
            console.log("An error occurred!");
            return;
        } else {
            console.table("Current departments", rows);
            askQuestions();
        }
    })
}

const viewRoles = () => {
    const sql = 'SELECT roles.id as role_id, roles.title, roles.salary, roles.department_id, departments.name FROM roles JOIN departments on roles.department_id = departments.id';
    db.query(sql, (err, rows) => {
        if(err) {
            console.log("An error occurred!");
            return;
        } else {
            console.table("Current roles", rows);
            askQuestions();
        }
    })
}


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
                return;
            } else {
                console.table("New department created!");
                askQuestions();
            }
        })
    })
}


const addRole = () => {
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
        console.log(result);
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

const addEmployee = () => {
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
        console.log(result);

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
                
            } else {
                console.table("New role created!");
                askQuestions();
            }
        })
    })
}

const getEmployees = () => {
    let employeesArray = [];

    return new Promise ((resolve, reject) => {
        db.query('SELECT CONCAT(first_name, " ", last_name) AS Name FROM employees', (err, rows) => {
            if(err) {
                reject(err);
                return;
            } 
            console.log("sql", rows);
            for(let i = 0; i < rows.length; i++) {
                employeesArray.push(rows[i].Name);
            }
            resolve(employeesArray);
        })
    })

}

const updateEmployee = async () => {
    let employeesArray = await getEmployees();
    console.log("Passed array", employeesArray);
    console.log("element 0", employeesArray[0].Name);


    return new Promise((resolve, reject) => {
        inquirer.prompt([
            {
                type: "list",
                message: "Please select an employee:",
                name: "employee",
                choices: employeesArray
            },
            {
                message: "Enter the ID of the employee's new role",
                type: 'input',
                name: 'employeeID',
                validate: roleID => {
                    if (roleID) {
                      return true;
                    } else {
                      console.log('Please enter a valid role ID!');
                      return false;
                    }
                }
            }
        ]).then( (result) => {
            console.log(result);
            resolve();
        });
    });
}


askQuestions();