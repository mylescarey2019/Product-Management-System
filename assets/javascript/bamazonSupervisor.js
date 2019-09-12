// Product-Management-System  Supervisor module

// require for inquier
var inquirer = require("inquirer");

// require for mySQL
var mysql = require("mysql");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});


// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  console.log("Welcome to Bamazon Product Management System - Supervisor Function");
  main();
});

// main recursive function
function main() {
  inquirer
    .prompt({
      name: "option",
      type: "list",
      message: "Select Option",
      choices: [
        "View Department Sales",
        "Add a new Department",
        "Exit"
      ]
    })
    .then(function(answer) {
      switch (answer.option) {
        case "View Department Sales":
          return viewDepartmentSales();

        case "Add a new Department":
          return addDepartment(); 

        case "Exit":
            return exitSystem(); 
      }
    });
};


// Department Sales function
// SQL call for Department Sales
function viewDepartmentSales() {
  console.log("in global.viewDepartmentSales");
  var query = "SELECT d.department_id \
                     ,d.department_name \
                     ,d.overhead_cost \
                     ,CASE \
                        WHEN ISNULL(SUM(p.product_sales)) THEN 0 \
                        ELSE SUM(p.product_sales) \
                      END AS total_sales \
                     ,CASE \
                        WHEN ISNULL(SUM(p.product_sales) - d.overhead_cost) THEN 0 \
                        ELSE SUM(p.product_sales) - d.overhead_cost \
                      END AS total_profit \
                FROM department AS d \
                LEFT OUTER \
                JOIN product AS p \
                  ON p.department_id = d.department_id \
               GROUP BY d.department_id \
                       ,d.department_name \
                       ,d.overhead_cost";
  connection.query(query, function(err, res) {
    if(err) throw err;
    console.table(res);
    main();
  });
 };

// Add Department function
// SQL call for Department Insert
function addDepartment() {
  console.log("in global.addDepartment");
  inquirer
    .prompt([
      {
        name: "departmentName",
        type: "input",
        message: "Enter Department Name",
        validate: function(value) {
          if (value === null) {
            return "Department Name cannot be blank";
          }
          return true;
        }
      },
      {
        name: "overheadCost",
        type: "input",
        message: "Enter Overhead Cost",   
        validate: function(value) {
          if (parseFloat(value) > 0) {
            return true;
          }
          return "Overhead Cost must be > 0";
        }
      }
    ])
  .then(function(answers) {
    console.log(`<<< Adding department: ${answers.departmentName} : ${answers.overheadCost} >>>`);
    checkDeptNotExists(answers.departmentName,answers.overheadCost);
  })  
};

// check to see if department name is unique (new)
function checkDeptNotExists(departmentName,overheadCost) {
// console.log("in global.checkDeptNotExists");
  var query =  "SELECT d.department_name \
                  FROM department AS d \
                WHERE d.department_name = ?";
  connection.query(query, [departmentName], function(err, res) {
    if(err) throw err;
    if (res.length > 0) {
      console.log(`<<< Department ${departmentName} already exists >>>`);
      main();
    }
    else {
      insertDepartment(departmentName,overheadCost);
    }
  });
};

// insert new Department
function insertDepartment(departmentName,overheadCost) {
// console.log("in global.insertDepartment");
  var query =  "INSERT \
                  INTO department \
                SELECT 0 \
                      ,? \
                      ,?";
  connection.query(query, [departmentName,overheadCost], function(err, res) {
    if(err) throw err;
    if (res.affectedRows > 0) {
      console.log(`<<< Department ${departmentName} : ${overheadCost} added >>>`);
      selectDepartment(res.insertId);
    }
    else {
      console.log(`<<< Unexpected failure trying to add Item Code ${itemCode} : ${productName} to ${departmentName} >>>`);
      main();
    }
  });
};

// select results of department add
function selectDepartment(insertId) {
// console.log("in global.selectDepartment");
  var query =  "SELECT  d.department_name \
                      ,d.overhead_cost \
                  FROM  department AS d \
                WHERE  d.department_id = ?";
  connection.query(query,[insertId], function(err, res) {
    if(err) throw err;
    console.table(res);
    main();
  });
};











// Exit function()
// message good-bye & set state flag for exit
function exitSystem() {
  // console.log("in global.exitSystem");
    console.log("Goodbye");
    connection.end();
  }; 


