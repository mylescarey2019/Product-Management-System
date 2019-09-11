DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE department (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(50) NOT NULL,
  overhead_cost DECIMAL(11,2),
  PRIMARY KEY(department_id)
);

CREATE UNIQUE INDEX UX1_department_department_name
    ON department (department_name);

CREATE TABLE product (
  product_id INT NOT NULL AUTO_INCREMENT,
  item_code INT NOT NULL,
  product_name VARCHAR(40) NOT NULL,
  department_id INT NOT NULL,
  retail_price DECIMAL(7,2) NOT NULL,
  stock_qty INT NOT NULL DEFAULT 0,
  product_sales DECIMAL(9,2) DEFAULT 0,
  PRIMARY KEY(product_id)
);

ALTER TABLE product
ADD CONSTRAINT FK_product_department
FOREIGN KEY (department_id) REFERENCES department(department_id);

CREATE UNIQUE INDEX UX1_product_item_code
    ON product (item_code);

CREATE TABLE product_order (
  product_order_id INT NOT NULL AUTO_INCREMENT,
  order_date DATE NOT NULL,
  product_id INT NOT NULL,
  order_qty INT NOT NULL,
  retail_price DECIMAL(7,2) NOT NULL,
  extended_cost DECIMAL(10,2) NOT NULL,
  PRIMARY KEY(product_order_id)
);

ALTER TABLE product_order
ADD CONSTRAINT FK_product_order_product
FOREIGN KEY (product_id) REFERENCES product(product_id);



