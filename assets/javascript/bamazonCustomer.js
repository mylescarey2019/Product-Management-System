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
  console.log("Welcome to Bamazon Product Management System - Customer Function");
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
        "View Product List",
        "Place Product Order",
        "Exit"
      ]
    })
    .then(function(answer) {
      switch (answer.option) {
        case "View Product List":
          return productList();

        case "Place Product Order":
          return productOrder();

        case "Exit":
            return exitSystem(); 
      }
    });
}


// Product List function
function productList() {
// console.log("in global.productList");
  var query =  "SELECT d.department_name \
                      ,p.item_code \
                      ,p.product_name \
                      ,p.retail_price \
                      ,p.stock_qty \
                      ,p.product_sales \
                  FROM product as p \
                  JOIN department as d \
                    ON p.department_id = d.department_id \
                 ORDER BY d.department_name, p.product_name";
  connection.query(query, function(err, res) {
    if(err) throw err;
    console.table(res);
    main();
  })
}

// product order function
// select item, order qty and update datebase
// after validating item is valie and order qty > 0
function productOrder() {
// console.log("in global.productOrder");
  inquirer
    .prompt([
      {
        name: "itemCode",
        type: "input",
        message: "Enter Item Code",
        validate: function(value) {
          if (isNaN(value) === true) {
            return "Item Code must be numeric";
          }
          return true;
        }
      },
      {
        name: "orderQty",
        type: "input",
        message: "Enter Order Quantity",   
        validate: function(value) {
          if (value > 0) {
            return true;
          }
          return "Order quantity must be > 0";
        }
      }
    ])
    .then(function(answers) {
      // console.log(`<<< Ordering item: ${answers.itemCode} Quantity ordered: ${answers.orderQty} >>>`);
      checkItem(answers.itemCode,parseInt(answers.orderQty));
    })  
}
  
// check to see if item code is valid
function checkItem(itemCode,orderQty) {
// console.log("in global.checkItem");
  var query =  "SELECT p.item_code \
                  FROM product as p \
                 WHERE p.item_code = ?";

  connection.query(query, [itemCode], function(err, res) {
    if(err) throw err;
    if (res.length === 0) {
      console.log(`<<< Item Code ${itemCode} does not exist - try order again >>>`);
      main();
    }
    else {
      checkOrderQty(itemCode,orderQty);
    }
  });
};

// check to see if order qty is available
function checkOrderQty(itemCode,orderQty) {
// console.log("in global.checkOrderQty");
  var query =  "SELECT p.item_code \
                  FROM product as p \
                 WHERE p.item_code = ? and p.stock_qty >= ? ";
  connection.query(query, [itemCode,orderQty], function(err, res) {
    if(err) throw err;
    if (res.length === 0) {
      console.log(`<<< Item ${itemCode} does not have quantity of ${orderQty} on hand - try order again >>>`);
      main();
    }
    else {
      updateOrderQty(itemCode,orderQty);
    }
  })
};

// update database with order qty & update product_sales
function updateOrderQty(itemCode,orderQty) {
// console.log("in global.updateOrderQty");
  var query =  "UPDATE product \
                   SET stock_qty = stock_qty - ? \
                      ,product_sales = product_sales + (retail_price * ?) \
                 WHERE item_code = ?";
  connection.query(query, [orderQty,orderQty,itemCode], function(err, res) {
    if(err) throw err;
    insertOrder(itemCode,orderQty);
  })
};

// insert into product_order table
function insertOrder(itemCode,orderQty) {
  // console.log("in global.insertOrder");
  var query =  "INSERT \
                  INTO product_order \
                 SELECT  0 \
                        ,CURDATE() \
                        ,p.product_id \
                        ,? \
                        ,p.retail_price \
                        ,p.retail_price * ? \
                   FROM product AS p \
                  WHERE p.item_code = ?";
  connection.query(query, [orderQty,orderQty,itemCode], function(err, res) {
    if(err) throw err;
    if (res.affectedRows > 0) {
      selectItem(itemCode,orderQty);
    }
    else {
      console.log(`<<< Unexpected failure trying to add product_order for ${itemCode} >>>`);
      main();
    }
  })
};

// select results of order
function selectItem(itemCode,orderQty) {
// console.log("in global.selectItem");
  var query =  "SELECT p.item_code \
                      ,p.retail_price \
                      ,? as order_qty \
                      ,p.retail_price * ? AS total_order_cost \
                      ,p.stock_qty AS new_stock_qty \
                  FROM product as p \
                 WHERE p.item_code = ?"

  connection.query(query,[orderQty,orderQty,itemCode], function(err, res) {
    if(err) throw err;
    // console.log(`<<< product_order for ${itemCode} inserted completed >>>`);
    console.table(res);
    main();
  });
};


// Exit function()
  // message good-bye & set state flag for exit
function exitSystem() {
// console.log("in global.exitSystem");
  console.log("<<< Goodbye >>>");
  connection.end();
} 