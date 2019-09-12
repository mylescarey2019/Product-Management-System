// Product-Management-System  Manager module

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
  console.log("Welcome to Bamazon Product Management System - Manager Function");
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
        "View Low Inventory Products",
        "Add Inventory",
        "Add a new Product",
        "View Orders by Date Range",
        "Exit"
      ]
    })
    .then(function(answer) {
      switch (answer.option) {
        case "View Product List":
          return productList();

        case "View Low Inventory Products":
          return lowInventory();

        case "Add Inventory":
          return addInventory();

        case "Add a new Product":
          return addProduct();

        case "View Orders by Date Range":
          return viewOrders();    

        case "Exit":
            return exitSystem(); 
      }
    });
}

// Product List function
// SQL call for list of products
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

// Low Inventory Product List function
// SQL call for list of products
function lowInventory() {
// console.log("in global.lowInventory");
    var query =  "SELECT d.department_name \
                        ,p.item_code \
                        ,p.product_name \
                        ,p.stock_qty \
                    FROM product as p \
                    JOIN department as d \
                      ON p.department_id = d.department_id \
                   WHERE p.stock_qty < 5 \
                   ORDER BY d.department_name, p.product_name";
    connection.query(query, function(err, res) {
      if(err) throw err;
      console.table(res);
      main();
    })
  }




// add inventory function
// select item, added qty and update datebase
// after validating item is valid and requested qty > 0
function addInventory() {
// console.log("in global.addInvetory");
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
        name: "qtyAdded",
        type: "input",
        message: "Enter Quantity to Add",   
        validate: function(value) {
          if (value > 0) {
            return true;
          }
          return "Quantity must be > 0";
        }
      }
    ])
    .then(function(answers) {
      console.log(`<<< Updating item: ${answers.itemCode} Quantity added: ${answers.qtyAdded} >>>`);
      checkItemExists(answers.itemCode,parseInt(answers.qtyAdded));
    })  
}

// check to see if item code is valid
function checkItemExists(itemCode,qtyAdded) {
// console.log("in global.checkItemExists");
  var query =  "SELECT p.item_code \
                  FROM product as p \
                 WHERE p.item_code = ?";

  connection.query(query, [itemCode], function(err, res) {
    if(err) throw err;
    if (res.length === 0) {
      console.log(`<<< Item Code ${itemCode} does not exist >>>`);
      main();
    }
    else {
      updateQty(itemCode,qtyAdded);
    }
  });
};

// update database with added qty
function updateQty(itemCode,qtyAdded) {
// console.log("in global.updateQty");
  var query =  "UPDATE product \
                   SET stock_qty = stock_qty + ? \
                 WHERE item_code = ?";
  connection.query(query, [qtyAdded,itemCode], function(err, res) {
    if(err) throw err;
    selectItem(itemCode);
  })
};

// show item and its updated inventory
function selectItem(itemCode) {
// console.log("in global.selectItem");
    var query =  "SELECT d.department_name \
                        ,p.item_code \
                        ,p.product_name \
                        ,p.stock_qty \
                    FROM product as p \
                    JOIN department as d \
                      ON p.department_id = d.department_id \
                   WHERE p.item_code = ? \
                   ORDER BY d.department_name, p.product_name";
    connection.query(query, [itemCode], function(err, res) {
      if(err) throw err;
      console.table(res);
      main();
    })
  }





// add a new product
// user enters item_code, name, chooses a department, enters
// retail price and stock qty
// after validating item is valid and requested qty > 0
function addProduct() {
// console.log("in global.addProduct");
// query database for department domain
  connection.query("SELECT d.department_name \
                      FROM department AS d \
                     ORDER BY d.department_name", function(err, results) {
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
          name: "productName",
          type: "input",
          message: "Enter Product Name",   
          validate: function(value) {
            if (value !== null) {
              return true;
            }
            return "Product Name cannot be blank";
          }
        },
        {
          name: "departmentName",
          type: "rawlist",
          // choices: function() {
          //   var choiceArray = [];
          //   for (var i = 0; i < results.length; i++) {
          //     choiceArray.push(results[i].department_name);
          //   }
          //   return choiceArray;
          // },
          choices: function() {
            return results.map(row => row.department_name);  // my refactoring
            //return results.map(({department_name}) => department_name);  // will use this refactoring after I have studied it for understanding
          },
          message: "Enter Department",   
        },
        {
          name: "retailPrice",
          type: "input",
          message: "Enter Retail Price",   
          validate: function(value) {
            if (parseFloat(value) > 0) {
              return true;
            }
            return "Retail Price must be > 0";
          }
        },
        {
          name: "stockQty",
          type: "input",
          message: "Enter Stock Quantity",   
          validate: function(value) {
            if (value >= 0) {
              return true;
            }
            return "Stock Quantity cannot be blank";
          }
        },
      ])
      .then(function(answers) {
        // console.log(`<<< Adding item: ${answers.itemCode} : ${answers.productName} : ${answers.departmentName} : ${answers.retailPrice} : ${answers.stockQty} >>>`);
        checkItemNotExists(answers.itemCode,answers.productName,answers.departmentName,answers.retailPrice,answers.stockQty);
      })  
  })
}

// check to see if item code is unique (new)
function checkItemNotExists(itemCode,productName,departmentName,retailPrice,stockQty) {
// console.log("in global.checkItemNotExists");
  var query =  "SELECT p.item_code \
                  FROM product as p \
                 WHERE p.item_code = ?";
  connection.query(query, [itemCode], function(err, res) {
    if(err) throw err;
    if (res.length > 0) {
      console.log(`<<< Item Code ${itemCode} already exists >>>`);
      main();
    }
    else {
      insertProduct(itemCode,productName,departmentName,retailPrice,stockQty);
    }
  });
};

// insert new Product
function insertProduct(itemCode,productName,departmentName,retailPrice,stockQty) {
// console.log("in global.insertProduct");
  var query =  "INSERT \
                  INTO product \
                 SELECT 0 \
                       ,? \
                       ,? \
                       ,(SELECT d.department_id FROM department AS d WHERE d.department_name = ?) \
                       ,? \
                       ,? \
                       ,0";
  connection.query(query, [itemCode,productName,departmentName,retailPrice,stockQty], function(err, res) {
    if(err) throw err;
    if (res.affectedRows > 0) {
      console.log(`<<< Item Code ${itemCode} : ${productName} added to ${departmentName} >>>`);
      selectItemAdded(res.insertId);
    }
    else {
      console.log(`<<< Unexpected failure trying to add Item Code ${itemCode} : ${productName} to ${departmentName} >>>`);
      main();
    }
  });
};

// select results of product add
function selectItemAdded(insertId) {
  // console.log("in global.selectItemAdded");
  var query =  "SELECT d.department_name \
                      ,p.item_code \
                      ,p.product_name \
                      ,p.retail_price \
                      ,p.stock_qty \
                      ,p.product_sales \
                  FROM product as p \
                  JOIN department as d \
                    ON p.department_id = d.department_id \
                 WHERE p.product_id = ? \
                 ORDER BY d.department_name, p.product_name";
    connection.query(query,[insertId], function(err, res) {
      if(err) throw err;
      console.table(res);
      main();
    });
  };


// view orders that occured between two dates
function viewOrders() {
  // console.log("in global.viewOrders");
    inquirer
      .prompt([
        {
          name: "startDate",
          type: "input",
          message: "Enter Start Date YYYY-MM-DD",
          validate: function(value) {
            var pass = value.match(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/i);
            if (pass) {
              return true;
            } else {
              return "Please date in format YYYY-MM-DD";
            }
          }
        },
        {
          name: "endDate",
          type: "input",
          message: "Enter End Date YYYY-MM-DD",
          validate: function(value) {
            var pass = value.match(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/i);
            if (pass) {
              return true;
            } else {
              return "Please date in format YYYY-MM-DD";
            }
          }
        }
      ])
      .then(function(answers) {
        console.log(`<<< Viewing orders for ${answers.startDate} through ${answers.endDate} >>>`);
        var query =  "SELECT  o.product_order_id \
                             ,d.department_name \
                             ,DATE_FORMAT(o.order_date,'%Y-%m-%d') AS order_date \
                             ,p.item_code \
                             ,p.product_name \
                             ,o.retail_price \
                             ,o.order_qty \
                             ,o.extended_cost \
                        FROM product_order AS o \
                        JOIN product AS p \
                          ON o.product_id = p.product_id \
                        JOIN department AS d \
                          ON d.department_id = p.department_id \
                        WHERE o.order_date BETWEEN ? AND ? \
                        ORDER BY d.department_name \
                                ,o.order_date \
                                ,p.product_name";
        connection.query(query, [answers.startDate,answers.endDate], function(err, res) {
          if(err) throw err;
          console.table(res);
          main();
          })
      })  
  }; 


// Exit function()
// message good-bye & set state flag for exit
function exitSystem() {
// console.log("in global.exitSystem");
  console.log("Goodbye");
  connection.end();
} 


// // Product List function
// // SQL call for list of products
// function productList() {
// // console.log("in global.productList");
//   var query =  "SELECT p.item_code \
//                       ,p.product_name \
//                       ,p.retail_price \
//                       ,p.stock_qty \
//                       ,p.product_sales \
//                   FROM product as p \
//                   JOIN department as d \
//                     ON p.department_id = d.department_id \
//                  ORDER BY d.department_name, p.product_name";
//   connection.query(query, function(err, res) {
//     if(err) throw err;
//     console.table(res);
//     main();
//   })
// }

// // product order function
// // select item, order qty and update datebase
// // after validating item is valie and order qty > 0
// function productOrder() {
//   console.log("in global.productOrder");
//   inquirer
//     .prompt([
//       {
//         name: "itemCode",
//         type: "input",
//         message: "Enter Item Code",
//         validate: function(value) {
//           if (isNaN(value) === true) {
//             return "Item Code must be numeric";
//           }
//           return true;
//         }
//       },
//       {
//         name: "orderQty",
//         type: "input",
//         message: "Enter Order Quantity",   
//         validate: function(value) {
//           if (value > 0) {
//             return true;
//           }
//           return "Order quantity must be > 0";
//         }
//       }
//     ])
//     .then(function(answers) {
//       console.log(`Ordering item: ${answers.itemCode} Quantity ordered: ${answers.orderQty}`);
//       checkItem(answers.itemCode,parseInt(answers.orderQty));
//     })  
// }
  
// // check to see if item code is valid
// function checkItem(itemCode,orderQty) {
//   console.log("in global.checkItem");
//   var query =  "SELECT p.item_code \
//                   FROM product as p \
//                  WHERE p.item_code = ?";

//   connection.query(query, [itemCode], function(err, res) {
//     if(err) throw err;
//     if (res.length === 0) {
//       console.log(`Item Code ${itemCode} does not exist`);
//       main();
//     }
//     else {
//       checkOrderQty(itemCode,orderQty);
//     }
//   });
// };

// // check to see if order qty is available
// function checkOrderQty(itemCode,orderQty) {
//   console.log("in global.checkOrderQty");
//   var query =  "SELECT p.item_code \
//                   FROM product as p \
//                  WHERE p.item_code = ? and p.stock_qty >= ? ";
//   connection.query(query, [itemCode,orderQty], function(err, res) {
//     if(err) throw err;
//     if (res.length === 0) {
//       console.log(`Item ${itemCode} does not have quantity of ${orderQty} on hand`);
//       main();
//     }
//     else {
//       updateOrderQty(itemCode,orderQty);
//     }
//   })
// };

// // update database with order qty
// function updateOrderQty(itemCode,orderQty) {
//   console.log("in global.updateOrderQty");
//   var query =  "UPDATE product \
//                    SET stock_qty = stock_qty - ? \
//                  WHERE item_code = ?";
//   connection.query(query, [orderQty,itemCode], function(err, res) {
//     if(err) throw err;
//     selectItem(itemCode,orderQty);
//   })
// };

// // select results of order
// function selectItem(itemCode,orderQty) {
//   console.log("in global.selectItem");
//   var query =  "SELECT p.item_code \
//                       ,p.retail_price \
//                       ,? as order_qty \
//                       ,p.retail_price * ? AS total_order_cost \
//                       ,p.stock_qty AS new_stock_qty \
//                   FROM product as p \
//                  WHERE p.item_code = ?"

//   connection.query(query,[orderQty,orderQty,itemCode], function(err, res) {
//     if(err) throw err;
//     console.log("Order Succesfull:")
//     console.table(res);
//     main();
//   });
// };


// // Exit function()
//   // message good-bye & set state flag for exit
// function exitSystem() {
//   console.log("in global.exitSystem");
//   console.log("Goodbye");
//   connection.end();
// } 