// Product-Management-System  Customer module

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
  //start();
});

// message "welcome to bamazon Customer Order System"
// main function()

  // prompt to See Product List, Place Order, Exit
    // inquirer prompt
    // choices[product list, order, exit]
    // then promise
    //     switch
    //        product list function()
    //        order function()
    //        exit function() 
    //
    //
    //  recursive call to main function




// Product List function()
  // SQL call for list of products



// Order function()
  // message to place order
  // inquirer
    // prompt for item code
    // validation( SQL check to see if item code exists - if not then ask for another item code)
    // prompt for qty
    // validation > 0
  // then promise
    // mySQL call to:  decrement on-hand-qty by order-qty
    //   trap for mySQL number of rows affected - expecting 1 if 0 that means the item_code does not exist 
    //   the above won't be needed if i can make the validation at the time of entry into inquirer work
    //
    // mySQL call to:  display order result



// Exit function()
  // message good-bye & set state flag for exit