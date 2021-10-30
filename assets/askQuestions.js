const inquirer = require("inquirer")
const db = require('../db/connection.js');
const cTable = require('console.table');

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
            case"View all departments":
            case "View all roles":
            case "Add a department":
            case "Add a role":
            case "Add an employee":
            case "Update an employee role":
            default:
                console.log("Gooodbye!");
                db.end();


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
        }
    })
}

askQuestions();