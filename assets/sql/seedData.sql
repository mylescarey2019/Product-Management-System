use bamazon;

INSERT INTO department (department_name,overhead_cost)
VALUES('Pet Supplies',15000000.00),
      ('Electronics',2000000.00),
      ('Toys & Games',8000000.00);
      

INSERT INTO product (item_code,product_name,department_id,retail_price,stock_qty)
VALUES(500000,'Ultra Cat Litter', 1,5.99,10),
	  (500213,'Dog Doo Bags',1,4.79,8),
      (500214,'Pink Plush Dog Toy',1,29.99,10),
      (506735,'Rocco & Roxie Stain and Order Control',1,8.59,20),
      (509011,'Deluxe Cat Tree',1,139.95,3),
      (509012,'Pork Ear Dog Treat',1,0.99,15);

UPDATE product SET product_sales = 5000000 WHERE product_id = 1;        
UPDATE product SET product_sales = 950000 WHERE product_id = 2;  
UPDATE product SET product_sales = 23100 WHERE product_id = 3;  
UPDATE product SET product_sales = 8000000 WHERE product_id = 6;  

INSERT INTO product (item_code,product_name,department_id,retail_price,stock_qty)
VALUES(7800,'Fire Stick',2,39.99,3),
	  (7801,'Wisz Security Camera',2,50.00,8),
      (7802,'Logitech Wireless Keyboard',2,42.75,12),
      (10200,'Visio 55 LCD TV',2,429.95,20),
      (10205,'Bamazon Surge Protector',2,9.95,7),
      (11013,'Circa 1999 MP3 Player',2,15.95,2),
      (12710,'Ember Paper White Reader',2,89.99,0),
      (12742,'Smart Wifi Router',2,49.95,4);

UPDATE product SET product_sales = 200000 WHERE product_id = 7;        
UPDATE product SET product_sales = 100000 WHERE product_id = 8;  
UPDATE product SET product_sales = 70000 WHERE product_id = 9;  
UPDATE product SET product_sales = 3000000 WHERE product_id = 10;  
UPDATE product SET product_sales = 25000 WHERE product_id = 11; 
UPDATE product SET product_sales = 390000 WHERE product_id = 14;       


INSERT INTO product (item_code,product_name,department_id,retail_price,stock_qty)
VALUES(202200,'Play Doh',3,9.99,10),
	  (200201,'Lego Harry Potter',3,50.00,8),
      (200202,'Jenga',3,19.75,8),
      (200505,'First Blocks',3,9.95,20),
      (201510,'Catan',3,39.99,200),
      (207833,'Exploding Kittens',3,22.95,4),
      (290550,'Imploding Kittens - Expansion',3,17.99,0),
      (295325,'Totoro - Plush',3,13.50,9);

UPDATE product SET product_sales = 17000 WHERE product_id = 15;        
UPDATE product SET product_sales = 130000 WHERE product_id = 16;  
UPDATE product SET product_sales = 5000 WHERE product_id = 19;  
UPDATE product SET product_sales = 8500 WHERE product_id = 20;  
UPDATE product SET product_sales = 155000 WHERE product_id = 24;       