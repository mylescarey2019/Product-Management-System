# Product-Management-System

## Node  & mySQL product ordering and management program

## Description

This node.js mySQL program simulates a retailer ordering and product management system leveraging mySQL database as backend product database.  Node inquirer command line prompts which allow for simulation of customer ordering, inventory and sales reporting functions.  

### Database Model

1. Database model consists of department, product and product_order entities 

   - a department has 0 to many products
   - a product has 1 department
   - in this simulation product_order has 1 product per row (if more realistic there would be an order header and order line item  to support a many to many relationship between orders and products)
   - data model is normalized

2. Table Design

   - surrogate keys using identity columns are the primary keys for the tables:  department_id, product_id and product_order_id.  Using surrogate keys can have advantages such as ease and speed of tables joins, key permanence allowing alternate key or natural key to change, migration of keys to linkage/junction tables when many to many relationships become necessary (for exanple:  orders to items yielding an item-order linkage table) 

   - item_code has been added to the product table as it is common to have an alterate key for ordering that in some instances can have business intellegence encoded (item code ranges for instance).  item code has a unique index (UK)
   
     ```mysql
     CREATE UNIQUE INDEX UX1_product_item_code
         ON product (item_code);
     ```
   
   - Normally an order code key would have an internal assignment module, but for the scope of this project the user will be responsible for entering unique item codes when adding new products to the system.
   
   - product_sales on the product table has a default value of 0
   
   - department_name on department table is the alternate/natural key.  When adding a new department the user must choose a unique name, i.e. department_name has a unique index (UK)
   
     ```mysql
     CREATE UNIQUE INDEX UX1_department_department_name
         ON department (department_name);
     ```
   
3. Relationships

   - product table has a foreign key: department_id (FK) to relate it to the department table

     ```mysql
     ALTER TABLE product
     ADD CONSTRAINT FK_product_department
     FOREIGN KEY (department_id) REFERENCES department(department_id);
     ```

   - product_order table has a foreign key: product_id (FK) to relate it to the product table

     ```mysql
     ALTER TABLE product_order
     ADD CONSTRAINT FK_product_order_product
     FOREIGN KEY (product_id) REFERENCES product(product_id);
     ```

     

### System Functions

1. Customer

   - module allows user to place order by entering item code & quantity
     - item code is validated to ensure it exists and ordered quantity is checked against on-hand quantity
     - following successful order the on-hand qty is decremented and user is shown order detail recap

2. Manager

   - module allows user to perform multiple functions:
     1. view list of products for sale
     2. view list of products with low inventory
     3. add inventory to an item - enter item code and quantity; item code is validated to ensure it exists
        - on hand quantity in incremented and report of updated item is shown
     4. add new product - user enters attributes for a new item
        - item code is validated - it must be unique;  after successful entry report of new item is shown
     5. view product orders by date range
        - start and end dates must be valid - format YYYY-MM-DD
        - list of orders shown that occured between the start and end dates inclusive

3. Supervisor

   - module allows user to:

     1. view product sales and profit grouped by department
     2. add new department - user enters attributes for new department

     - department name is validated - must be unique; after successful entry report of new department is shown

## User Stories / Use Cases

1.  user starts bash session and runs either Customer, Manager or Supervisor js files

2.  **bamazonCustomer**
  
    1.  user is presented with initial prompt with options:  "See Product List", "Place order", "Exit"
    2.  "See Product List"
        1.  list is displayed: department name, item code, product name,  retail price of item, on hand quantity and product sales
    3.  "Place Order"
        1.    user is prompted to:
            1.  "Enter Item Code"
            1. item code is validated - must be numeric
            2.  "Enter Order Quantity"
                1. order quantity is validated - must be numeric and > 0
        2.  Order  is validated 
            1. if item code does not exist or ordered qty is > on hand qty user is informed "Item does not exist"  or "Insufficent on-hand quantity, on-hand"
                1. return to initial prompt
            2. if order qty <= on hand qty then on-hand qty is decremented by order qty
                1. user is shown message "Successful Order item code: <item code>, quantity <qty> total cost = <computed cost>"
                2. return to initial prompt 
    4.  "Exit" - program exits to terminal
    
3. **bamazonManager**

    1. user is presented with initial prompt with options: "View Products", "View Low Inventory Products", "Update Inventory", "Add a new Product", "Exit"

    2. "View Products"

        1.  product list is display ordered by department name, product_name
            1.  list appears in table form:  department name, item code, product name,  retail price of item, on hand quantity and product sales

    3. "View Low Inventory Products"

        1.  product list is displayed for all items with stock_qty < 5
            1.  list appears in table form:  department name, item code, product name,  retail price of item, on hand quantity and product sales
            2.  return to initial prompt

    4. "Update Inventory"

        1.   user is prompted to:
           1. "Enter Item Code"
              1. item code must be numeric > 0
           2. "Enter Quantity to Add "
              1. Quantity is validated - must be numeric and > 0
        2. Validation - if item code does not exist or add qty not > 0 transaction is cancelled
        3.   Message displayed the product and updated quantity:  Department Name, Product Name Retail Price, Old Quantity, New  Quantity, Product Sales
        4.   return to initial prompt

    5. "Add a new Product"

        1.  user is prompted for:
            1.  "Enter Item Code"  - is validated must be numeric > 0
            2.  "Enter Product Name" - is validated, cannot be null - user prompted to re-enter if not
            3.  "Choose Department" (SQL join to department table will present list of valid choice)
            4.  "Enter Retail Price" - is validated, must be numeric > 0 - user prompted to re-enter if not
            5.  "Enter Stock Quantity" - is validated, must be numeric, can be 0 - users prompted to re-enter if not
        2.  Validation - if item code already exist the transaction is cancelled
        3.  Message showing new Product is shown: Department Name, Product Id, Item Code, Product Name, Retail Price, Stock Quantity, Product Sales
        4.  return to initial prompt

    6. "View Orders by Date Range"

        1. user is prompted to:

            1. enter start date - is validated - must be format YYYY-MM-DD

            2. enter end date - is validated - must be format YYYY-MM-DD

            3. list of orders ocurring within those dates is shown in format:

                product_order_id, department_name, order date, item code, product name, retail price, order qty, extended cost

    7. Exit" - program exits to terminal

      ​    

4. **bamazonSupervisor**
    
1. user is presented with initial prompt with options: "View Departement Sales", "Add new Department", "Exit"
    
2. "View Department Sales"
    
       1. user is prompted to:
          1. "Choose Department" (SQL join to department table will present list of valid choice)
          2. Results shown:  Department Id, Department Name, Overhead Cost, Department Sales, Profit
          3. - Department Sales is a computed value: SQL join to product table for given department and compute SUM(product.product_sales)
             - Profit is a computed value:  SQL join to product table for given department and compute Overhead cost - SUM(product.product_sales)
   2. return to initial prompt
    
3. "Add new Department"
    
   user is prompted for:
    
       1. "Enter Department Name"  - is validated, cannot be null - user prompted to re-enter if so
       2. "Enter Overhead Cost" - is validated, must be numeric > 0 - user prompted to re-enter if not
       3. Message showing new Deparment is shown: Department Id, Department Name, Overhead Cost 
      4. Validation - if department name already exists - transaction is cancelled
   5. return to initial prompt
   
    4. Exit" - program exits to terminal

### Psuedo Code - details TBD

1. bamazonCustomer.js 
    1. menu function with inquirer options for See Products, Place Order, Exit
       1. function for See Product  - SQL read for all products
       2. function for Place Order - SQL to check item code exists, SQL to update stock qty and sales, SQL insert into order table
       3. function to exit - end connection
2. bamazonManager.js
          1. menu function with inquirer options for See Products, See Low Inventory Item, Add to Inventory, Add New Product, See Orders by Date Range, Exit
             1. function for See Product  - SQL read for all products
             2. function for See Low Inventory Items - SQL read of all products with stock qty < 5
             3. function for Add to Inventory - SQL to check item code, SQL to add to stock_qty 
             4. function for Add New Product - SQL to check item code, SQL to insert into product table
             5. function See Orders by Date Range - SQL to retrieve from order table all orders with order date between the user entered start and end dates
             6. function to exit - end connection
  
2. bamazonSupervisor.js
    1. menu function with inquirer options for See Department Sales, Add new Department, Exit
    2. function for See Department Sales - joins the deparment and product tables to get the total sales for all item grouped by department;  subtract a department's total sales from its overhead cost to show a computed total profit.  Use outer left join and CASE in select to account for the possibility of a department not having any products yet - the resultant row will show null in total sales and profit but will show overhead cost
    3. function for Add new Department - SQL to check that department name does not exist, SQL to insert into department table
    4. function to exit - end connection
