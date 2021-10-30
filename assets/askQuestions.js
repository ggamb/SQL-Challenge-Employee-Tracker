const inquirer = require("inquirer")

const askQuestions = () => {
    inquirer.prompt({
        message: "What would you like to do?",
        type: "list",
        choices: ["View all employees", "View all departments", "View all roles", "Add a department", "Add a role", "Add an employee", "Update an employee role", "Exit"],
        name: "pick"
    }).then(response => {
        let userChoice = response.pick;

        if(userChoice === "View all employees") {
            

        } else if(userChoice === "View all departments") {

        } else if(userChoice === "View all roles") {
            
        } else if(userChoice === "Add a department") {
            
        } else if(userChoice === "Add a role") {
            
        } else if(userChoice === "Add an employee") {
            
        } else if(userChoice === "Update an employee role") {
            
        }else {
            console.log("Goodbye!");
        }
    })
}

askQuestions();