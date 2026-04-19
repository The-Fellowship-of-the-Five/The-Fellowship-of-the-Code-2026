# The Red Book of Westmarch - Chapter 2: Paths & Choices

## Summary
This chapter introduces the *Recipe-Based Deficit Calculation*. As the group travels through harsh environments with limited resupply opportunities, resource management becomes a matter of survival.This capability automates the comparison between required recipe ingredients and the Fellowship’s shared inventory. By clearly calculating and visualizing missing items, the system empowers the group to make informed decisions about meal preparation, avoiding wasted resources and optimizing future resupply runs. 

## Artifact

Link: - [The Fellowship of the Five - Artifact 2: Deciding](https://github.com/The-Fellowship-of-the-Five/The-Fellowship-of-the-Code-2026/blob/main/artifacts/artifact-2/artifact-2-deciding.md)

*Capability: Recipe-Based Deficit Calculation* Resource and food planning is one of the most vital tasks for a group navigating these dangerous environments. Without an automated system, the group must manually audit every member’s inventory and estimate ingredient quantities—a slow and tedious process that is prone to mistakes. 

- This capability allows the Fellowship to select a meal or recipe and automatically cross-reference the required ingredients with the group’s current, collective inventory.
- The system calculates exactly what ingredients are missing and the specific quantities still needed.
- This immediate feedback loop clarifies whether a meal can be prepared immediately or if a gathering/shopping phase is required. 

*System Flow (Mermaid Flowchart)* The workflow covers: 

- Defining the scope of the meal (servings, days). 
- Selecting the desired recipe. 
- Comparing required ingredients against the collective inventory. 
- **Branching Paths:** Based on the deficit calculation, the user can handle missing ingredients by syncing them to a shopping list, adjusting the meal parameters, or switching to an entirely different recipe before saving and sharing the final plan. 

*Wireframe Interface & Design Rationale* The interface is built around answering one primary question: Can the Fellowship prepare a selected meal with current supplies? To achieve this, the wireframe follows a clear, step-by-step flow: 

1. *Parameter Entry:* The user selects the planning mode and basic meal parameters.
2. *Recipe Selection:* A specific recipe is chosen for review.
3. *Deficit Comparison:* The core of the design. It visualizes required vs. available vs. missing ingredients. 

## AI Assistance

 - We learned that limiting features is more difficult. Adding too many, even though they work hand in hand, made the creation of the Flowchart quite difficult. By deliberately excluding adding to a shopping list and other automation features, the core decision (can we cook this meal?) became clearer and easier to design.
 - Designing the interface taught us the importance of providing context. Showing a user exactly what is missing and why a meal cannot be cooked is more useful than a simple "error" or "not enough ingredients" prompt.
 - The group doesn't just want to view data; they want to plan. Integrating "next actions" directly into the deficit comparison screen shifted the design from a static information dashboard into an active decision-making tool. 

## Lessons Learned

- We learned that limiting features is often more difficult, but more rewarding, than adding them. By deliberately excluding per-member inventories and automation, the core decision (can we cook this meal?) became much clearer and easier to design for.
- Designing the interface taught us the importance of providing context. Showing a user exactly what is missing and why a meal cannot be cooked is vastly more useful than a simple "error" or "not enough ingredients" prompt.
  
