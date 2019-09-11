# Product-Management-System

## Node  & mySQL product ordering and management program

## Test Cases

Functionality Cases
1. bamazonCustomer

    1. exit	- expect program to exit to terminal
    2. see product list - expect product list to be displayed with items
    3. see product list when no items exist - expect empty display grid
    4. place order - item code does not exist - expect cancelled transaction
    5. place order - item code exists
        1. expect prompt for order quantity
            1. enter non-numer - expect prompt for re-entry
            2. enter 0 - expect prompt for re-entry
        2. valid order quantity entered
            1. order qty = on hand qty
                1. expect results showing order  and database reflects 0 on hand qty
            2. order qty < on hand qty
                1. expect results showing order and database reflect on hand qty that has been decremented by order qty - return to initial prompt
            3. order qty > on hand qty
                1. expect message Insuffient qty - return to initial prompt

2. bamazonManager

    1. exit	- expect program to exit to terminal
    2. view products - expect list of products ordered by department name, product name - empty grid if no products
    3. view products low inventory - expect list of products ordered by department name, product name where on hand qty < 5 - expect empty grid if no products in low inventory status
    4. update inventory - TBD
    5. add new product - TBD

3. bamazonSupervisor

    1. exit	- expect program to exit to terminal
    2. view department sales - TBD
    3. add new department - TBD

    

Results:   

1. Customer gif
2. Manager gif
3. Supervisor gif