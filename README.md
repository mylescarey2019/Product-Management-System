# Product-Management-System

## Node  & mySQL product ordering and management program


Utlizing Node.js, mySQL, javascript ES6 and npm packages

## Description

This node.js mySQL program simulates a retailer ordering and product management system leveraging mySQL database as backend product database.  Node inquirer command prompts allow for simulation of customer ordering, inventory and sales functions.

## Details:

- #### Github project :    <a href="https://github.com/mylescarey2019/Product-Management-System">Product-Management-System Repository</a>

- #### For further design and development details see: 

  - ####  [UseCases and Psuedo Code](UseCases-PsuedoCode.md)

  - ####  [Test Cases](TestCases.md)  - includes unit test result screenshots
  
  - #### [Database Schema and SQL Queries](Database-Schema.md)

- #### Data Model & Design Whiteboard:

  - Entity Data Model:  Department, Product and Product Order
  - Addional functions added:
    - Customer Orders save to product order table
    - Manager can view orders by date range

![bamazon-design-sml](./assets/images/data-model-sml.jpg)

#### Demo walkthru GIF :  ![bamazon-demo](./assets/images/bamazon-demo.gif)



## Getting Started

### Native and NPM Packages Used
1.  inquirer  - for interactive command line response 
2.  mysql - for database connectivity


### Dependencies

* none 

### Installing

* none necessary 

### Executing program

* open terminal session
  1. run program:   node bamazonCustomer.js
  2. run program:   node bamazonManager.js
  3. run program:   node bamazonSupervisor.js
  

#### Possible Enhancements

- [x] expand the data model by adding order table to track every order (simple design: 1 order : 1 product)
- [ ] expand the data model further by changing to order design to instead use tables for order line item and order total  -  allowing a many to many relationship between products and ordersexpand function to 
- [ ] support multi item orders using above data model

- [ ] add item code assignment stored procedure with simulated business rules instead of having user pick new item codes
- [ ] refactoring with purpose of consolidating duplicate quiries across the 3 js modules



## Authors

Myles Carey 
mylescarey2019@gmail.com 

## Version History

* 1.0 - Initial Release

## License


## Acknowledgments

Thanks to beta testers - my 15yo & 17yo daughters and wife 

