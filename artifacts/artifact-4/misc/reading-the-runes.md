# Reading the Runes – Code Analysis
---
## Introduction  
The purpose of this JavaScript Code is to track the number of available rations in a small web application.  
Users can type a number into an input field and either add rations or eat rations by pressing the corresponding buttons.  
After each interaction, the page should correctly update the displayed number of available rations.   
 
Although the code appears simple at first, it contains several important issues related to data types, logic order, and user interface updates.  
These problems affect the correctness of the application and could become much more serious in a larger software system. The following explanation shows the most important issues found in the code, why they happen, and why they matter.  

Issue 1: Wrong Assumption About Data Types 
Where the issue occurs: The first issue occurs in the line `let rations = "10";` and in the event listener for the add button where the value from the input field is used directly without converting it into a number. 
What the code intends to do: The code is supposed to take the number entered by the user and add it to the current ration amount. For example, if there are 10 rations and the user enters 8, the result should be 18. 
What happens instead: Instead of performing mathematical addition, JavaScript treats the values as strings. This happens because the variable `rations` was initialized with quotation marks, which makes it a string rather than a number. Additionally, `amountInput.value` also returns a string by default. As a result, JavaScript concatenates the values instead of adding them. For example, adding 8 to 10 results in `108` instead of `18`. 
Why this matters: This issue directly affects the user experience because the displayed ration amount becomes incorrect. A user would expect the program to calculate the total properly, but instead the application produces confusing results. 
In a larger system, incorrect assumptions about data types could lead to serious calculation errors. If similar logic were used in banking systems, inventory management, or booking systems, incorrect calculations could result in financial losses, wrong stock numbers, or unreliable records. This demonstrates why understanding and validating data types is an important part of programming. 
Issue 2: Incorrect Logic Order and Inconsistent UI Updates 
Where the issue occurs: The second issue occurs in the event listener for the eat button. The function `updateStatus()` is called before the ration amount is updated. 
What the code intends to do: The intention of the code is to subtract the entered amount from the available rations and then update the displayed value so the user can see the correct remaining amount. 
What happens instead: The program updates the user interface before the subtraction happens. This means the displayed ration amount still shows the old value even though the internal value has already changed in the background.  
 
For example, if the user starts with 10 rations and eats 8, the actual remaining value becomes 2. However, the UI still displays 10 because the update happened too early. If the user then tries to eat another 4 rations, the program suddenly displays an error message saying there are not enough rations available, even though the interface previously showed 10. 
Why this matters: This creates confusion because the displayed information does not match the actual state of the application. Users rely on the interface to make decisions, and inconsistent UI updates reduce trust in the program.  
 
In larger applications, incorrect logic orders can create even bigger problems. Different parts of a system may depend on accurate and synchronized data. If one part updates too early or too late, the system can become inconsistent. For example, in online shopping systems this could cause incorrect stock information, duplicated orders, or failed transactions. 
Possible Fixes 
The identified issues can be corrected with a few simple improvements: 
•	Use numbers instead of strings when storing ration values. 
•	Convert user input into numbers using `Number()` before performing calculations. 
•	Move `updateStatus()` so that it only runs after the ration amount has been updated successfully. 
•	Add validation to prevent invalid inputs such as letters or negative numbers. 
AI Assistance Reflection 
I used AI to better understand what each part of the code does. After identifying the errors, AI helped explain what exactly was wrong with the code, why the errors happened, and how the code could be corrected. 
AI was especially helpful for understanding JavaScript rules, such as how strings and numbers are handled differently and why the order of code execution is important. It showed how even a small mistake can lead to incorrect results in the program. 
Overall, AI was mainly used to answer the “why” questions during the error analysis. This helped improve my understanding of JavaScript and basic coding logic, even though the program itself was relatively small. 

<img width="454" height="693" alt="image" src="https://github.com/user-attachments/assets/bdb567c5-dd08-45c4-bd3d-f35e1554aa6d" />

