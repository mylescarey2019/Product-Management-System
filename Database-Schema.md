# Product-Management-System

## Database Schema and SQL Queries

```mysql
CREATE DATABASE `bamazon` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

CREATE TABLE `department` (
  `department_id` int(11) NOT NULL AUTO_INCREMENT,
  `department_name` varchar(50) NOT NULL,
  `overhead_cost` decimal(11,2) DEFAULT NULL,
  PRIMARY KEY (`department_id`),
  UNIQUE KEY `UX1_department_department_name` (`department_name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `product` (
  `product_id` int(11) NOT NULL AUTO_INCREMENT,
  `item_code` int(11) NOT NULL,
  `product_name` varchar(40) NOT NULL,
  `department_id` int(11) NOT NULL,
  `retail_price` decimal(7,2) NOT NULL,
  `stock_qty` int(11) NOT NULL DEFAULT '0',
  `product_sales` decimal(9,2) DEFAULT '0.00',
  PRIMARY KEY (`product_id`),
  UNIQUE KEY `UX1_product_item_code` (`item_code`),
  KEY `FK_product_department` (`department_id`),
  CONSTRAINT `FK_product_department` FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `product_order` (
  `product_order_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_date` date NOT NULL,
  `product_id` int(11) NOT NULL,
  `order_qty` int(11) NOT NULL,
  `retail_price` decimal(7,2) NOT NULL,
  `extended_cost` decimal(10,2) NOT NULL,
  PRIMARY KEY (`product_order_id`),
  KEY `FK_product_order_product` (`product_id`),
  CONSTRAINT `FK_product_order_product` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



```

- Customer Module SQL

  ```mysql
  -- select all products
  SELECT d.department_name 
  	  ,p.item_code 
  	  ,p.product_name 
  	  ,p.retail_price 
  	  ,p.stock_qty 
  	  ,p.product_sales 
    FROM product as p 
    JOIN department as d 
  	ON p.department_id = d.department_id 
   ORDER BY d.department_name, p.product_name;
   
  -- look up product for validation
  SELECT p.item_code 
    FROM product as p 
   WHERE p.item_code = ?
   
  -- check for available qty
  SELECT p.item_code 
     FROM product as p 
    WHERE p.item_code = ? and p.stock_qty >= ?
    
  -- update product after an order
  UPDATE product 
     SET stock_qty = stock_qty - ? 
  	  ,product_sales = product_sales + (retail_price * ?) 
   WHERE item_code = ?
   
   -- insert new product
  INSERT 
    INTO product_order 
   SELECT  0 
  		,CURDATE() 
  		,p.product_id 
  		,? 
  		,p.retail_price 
  		,p.retail_price * ? 
     FROM product AS p 
    WHERE p.item_code = ?
    
  -- show results of an order
  SELECT p.item_code 
  	  ,p.retail_price 
  	  ,? as order_qty 
  	  ,p.retail_price * ? AS total_order_cost 
  	  ,p.stock_qty AS new_stock_qty 
    FROM product as p 
   WHERE p.item_code = ?  
    
  ```

  

- Manager Module SQL

  ```mysql
  -- show product list
  SELECT d.department_name 
  	    ,p.item_code 
    	  ,p.product_name 
  	    ,p.retail_price 
  	    ,p.stock_qty 
  	    ,p.product_sales 
   FROM product as p 
   JOIN department as d 
     ON p.department_id = d.department_id 
  ORDER BY d.department_name, p.product_name
  
  -- show low inventory products
  SELECT d.department_name 
  	    ,p.item_code 
  	    ,p.product_name 
  	    ,p.stock_qty 
    FROM product as p 
    JOIN department as d 
  	  ON p.department_id = d.department_id 
   WHERE p.stock_qty < 5 
   ORDER BY d.department_name, p.product_name
   
  -- check item for validation
  SELECT p.item_code 
    FROM product as p 
   WHERE p.item_code = ?
   
   -- update stock qty 
  UPDATE product 
     SET stock_qty = stock_qty + ? 
   WHERE item_code = ?
   
  -- show item after inventory update
  SELECT d.department_name 
  	  ,p.item_code 
  	  ,p.product_name 
  	  ,p.stock_qty 
    FROM product as p 
    JOIN department as d 
      ON p.department_id = d.department_id 
   WHERE p.item_code = ? 
   ORDER BY d.department_name, p.product_name
   
   -- select department name for Inquierer choice list
  SELECT d.department_name 
    FROM department AS d 
   ORDER BY d.department_name
   
   -- insert a new product
  INSERT 
    INTO product 
   SELECT 0 
  	   ,? 
  	   ,? 
  	   ,(SELECT d.department_id FROM department AS d WHERE d.department_name = ?) 
  	   ,? 
  	   ,? 
  	   ,0
  	   
  -- show new product
  SELECT d.department_name 
  	  ,p.item_code 
  	  ,p.product_name 
  	  ,p.retail_price 
  	  ,p.stock_qty 
  	  ,p.product_sales 
    FROM product as p 
    JOIN department as d 
  	  ON p.department_id = d.department_id 
   WHERE p.product_id = ? 
   ORDER BY d.department_name, p.product_name
   
   -- show orders by date range
  SELECT  o.product_order_id 
  	   ,d.department_name 
  	   ,DATE_FORMAT(o.order_date,'%Y-%m-%d') AS order_date 
  	   ,p.item_code 
  	   ,p.product_name 
  	   ,o.retail_price 
  	   ,o.order_qty 
  	   ,o.extended_cost 
    FROM product_order AS o 
    JOIN product AS p 
      ON o.product_id = p.product_id 
    JOIN department AS d 
      ON d.department_id = p.department_id 
   WHERE o.order_date BETWEEN ? AND ? 
   ORDER BY d.department_name 
  		 ,o.order_date 
  		 ,p.product_name
  ```

  

- Supervisor Module SQL

  ```mysql
  -- show department profitibility
  SELECT d.department_id 
  	  ,d.department_name 
  	  ,d.overhead_cost AS overhead_cost
  	  ,CASE 
  	     WHEN ISNULL(SUM(p.product_sales)) THEN 0 
  		   ELSE SUM(p.product_sales) 
  	   END AS total_sales 
  	 ,CASE 
  		  WHEN ISNULL(SUM(p.product_sales) - d.overhead_cost) THEN 0 
  		  ELSE SUM(p.product_sales) - d.overhead_cost 
  	  END AS total_profit 
  FROM department AS d 
  LEFT OUTER 
  JOIN product AS p 
    ON p.department_id = d.department_id 
  GROUP BY d.department_id 
  	      ,d.department_name 
  	      ,d.overhead_cost
  	      
  -- check department name for validation
  SELECT d.department_name 
    FROM department AS d 
   WHERE d.department_name = ?
   
   --  insert new department
  INSERT 
    INTO department 
  SELECT 0 
  	  ,? 
  	  ,?
  	  
  --  show department
  SELECT  d.department_name 
  	   ,d.overhead_cost 
    FROM  department AS d 
   WHERE  d.department_id = ?
  	      
  	    
  	    
  ```

  

  ​	

  