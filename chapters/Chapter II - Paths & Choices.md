# The Red Book of Westmarch - Chapter 2: Paths & Choices

---

## Summary
This chapter introduces the *Recipe-Based Deficit Calculation*.  
As the group travels through harsh environments with limited resupply opportunities, resource management becomes a matter of survival.  
This capability automates the comparison between required recipe ingredients and the Fellowship’s shared inventory. By clearly calculating and visualizing missing items, the system empowers the group to make informed decisions about meal preparation, avoiding wasted resources and optimizing future resupply runs. 

---

## Artifact

Link: - [The Fellowship of the Five - Artifact 2: Deciding](https://github.com/The-Fellowship-of-the-Five/The-Fellowship-of-the-Code-2026/blob/main/artifacts/artifact-2/artifact-2-deciding.md)

Resource and food planning is one of the most vital tasks for a group navigating these dangerous environments. Without an automated system, the group must manually audit every member’s inventory and estimate ingredient quantities—a slow and tedious process that is prone to mistakes.  

- This artifact describes a capability that allows the Fellowship of the Five to select a meal or recipe and automatically cross-reference the required ingredients with the group’s current inventory.  
- The system calculates exactly what ingredients are missing and the specific quantities needed. 
- This immediate feedback clarifies whether a meal can be prepared immediately or if gathering/shopping is required.  

The Flowchart covers: 

- Defining the scope of the meal (servings, days). 
- Selecting the desired recipe. 
- Comparing required ingredients against the collective inventory.  
- Based on the deficit comparison, the user gets informed about missing ingredients, they can then adjust the meal parameters, or switch to an entirely different recipe before saving and sharing the final plan. 

The Wireframe interface: 

 - The user selects the planning mode and basic meal parameters.
 - It displays a specific recipe for review.
 - It visualizes required vs. available vs. missing ingredients. 

---

## AI Assistance

 - Learning the basics of Mermaid and Wireframe. 
 - Improving Mermaid Flowchart logic and letting the AI recommend different design choices fitting the shapes.
 - Improve the overall comprehensibility and professional tone of the capability description.

---

## Lessons Learned

- We learned that limiting features is often more difficult, but more rewarding, than adding them. By deliberately excluding per-member inventories and automation, the core decision (can we cook this meal?) became much clearer and easier to design for.
- Designing the interface taught us the importance of providing context. Showing a user exactly what is missing and why a meal cannot be cooked is vastly more useful than a simple "error" or "not enough ingredients" prompt.
  
