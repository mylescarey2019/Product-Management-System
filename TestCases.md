# Product-Management-System

## Node  & mySQL product ordering and management program

## Test Cases

Functionality Cases
1. Letter entered 
    1. already used
        1. message displayed showing letters already used
        2. message displayed - showing puzzle state again
    2. letter not in word - guesses remain
        1. message displayed information miss / remaining guess count
        2. message displayed - showing puzzle state again
    3. letter not in word - no guesses remain
        1. message displayed information miss / game loss
        2. message displayed - showing puzzle sovled
        3. prompt for next word - show end of game if all 44 names exhausted
        4. show next word - begin again     
    4. letter in word - puzzle not yet solved - letter appears once    
        1. message displayed information hit
        2. message displayed - showing puzzle state again
    5. letter in word - puzzle not yet solved - letter multiple times   
        1. message displayed information hits
        2. message displayed - showing puzzle state again    
    6. letter in word - puzzle solved
        1. message displayed information of win condition
        2. message displayed - showing puzzle state
        3. prompt for next word - show end of game if all 44 names exhausted
        4. show next word - begin again  
2. Edge Cases
    1. non-letter entered
    2. show message of mis-key

Results:   

[see README for test results GIF ](README.md)

