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
                console.log("Gooodbye!");
                db.end();
                break;
        }
    })
}


const viewEmployees = () => {
    const sql = 'SELECT * FROM employees';
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
    const sql = 'SELECT * FROM roles';
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
              console.log('Please enter a name for your department!');
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
    askQuestions();
}

const addEmployee = () => {
    askQuestions();
}

const updateEmployee = () => {
    askQuestions();
}


askQuestions();