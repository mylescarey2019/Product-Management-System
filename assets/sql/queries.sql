--  Bamazon Product Management System SQL Queries

-- Customer Functions

-- Read Product List
SELECT p.item_code
      ,p.product_name
      ,p.retail_price
      ,p.stock_qty
      ,p.product_sales
  FROM product as p
  JOIN department as d
    ON p.department_id = d.department_id
 ORDER BY d.department_name, p.product_name

-- insert product_order
INSERT 
  INTO product_order
 SELECT 0 
       ,'2019-09-11'
	   ,3
	   ,13
	   ,29.99;

-- Manager Functions


-- Supervisor Functions



