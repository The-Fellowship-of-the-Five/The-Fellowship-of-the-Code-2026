# Artifact 2 - Deciding

---

## Recipe-Based deficit calculation

This capability allows the Fellowship to select a meal or recipe and automatically compare the required ingredients with the group’s current inventory.  
The system calculates what ingredients are missing and how much of each item is still needed. This helps the group understand whether they can prepare a meal with their current supplies or if they need to gather or buy additional ingredients.  

We chose this capability because resource and food planning is one of the most important tasks for a group traveling through dangerous environments. The Fellowship needs to know not only what food they currently have but also whether it is enough to prepare meals for the entire group.  
Without this system, the quartermaster would need to manually check every member’s inventory and estimate ingredient quantities, which is slow and prone to mistakes.

At this stage of the journey the Fellowship is traveling through areas where resupply opportunities are limited and uncertain. Because of this, planning meals and managing food supplies becomes critical.
This capability helps them plan their next resupply more efficiently, avoids unnecessary purchases and limits resource wasting.

---

## Mermaid Flowchart

The flowchart below describes how the *Recipe-Based Deficit Calculation* works from the Quartermaster/User's perspective.  
It covers the scope of the meal, the recipe and the required ingredients compared to the Fellowship's collective inventory.  
Branching paths show how the user handles missing ingredients, syncing with a shopping list, adjusting parameters or completely switching recipes before saving the plan and optionally sharing it with the group. 

```mermaid
flowchart TB
    Start(["Quartermaster opens 'Planning a Meal'"])
    Start --> Q{Single meal or multi-day plan?}
    Q -->|Single meal| C
    Q -->|Multi-day plan| B
    C{Browse all or pick from presets?}
    C -->|Browse all| R
    C -->|Pick from preset| X[[Often prepared and favorite meals]] --> |Browse| H
    B[Enter meal parameters] --> D[Number of People]
    D --> E[Number of Days]
    E --> F[Buffer day]
    F --> G[[Show recipes that fit]]
    R[[Show all recipes]]
    G -->|Browse| H
    R -->|Browse| H
    H[Select recipe] --> H2[[Display required ingredients]]
    H2 --> Z[(Read collective inventory)]
    Z --> I{Ingredients missing?}
    I -->|Yes| L[Deficit list: item + quantity]
    I -->|No| M[Recipe is completeable]
    L -->|Add to shopping list| K[[Sync to shopping list]]
    L -->|Adjust parameters| B
    L -->|Pick different recipe| H
    L -->|Cancel| ZZ
    M -->|Save| N[(Save recipe)]
    M -->|Pick different recipe| H
    M -->|Cancel| ZZ
    N --> S{Share to group?}
    S -->|Yes| O[[Shared with group]]
    S -->|No| ZZ
    K --> ZZ
    O --> ZZ
    ZZ([End])

     classDef decision fill:#fff8e1,stroke:#f57c00,stroke-width:2px,color:#000
    classDef system fill:#e3f2fd,stroke:#1565c0,color:#000
    classDef data fill:#f3e5f5,stroke:#6a1b9a,color:#000
    classDef user fill:#e8f5e9,stroke:#2e7d32,color:#000
    classDef endpoint fill:#eceff1,stroke:#37474f,stroke-width:2px,color:#000
    class Q,C,I,S decision
    class G,R,H2,K,O,X,L,M system
    class Z,N data
    class B,D,E,F,H user
    class Start,ZZ endpoint
```

---

## Wireframe Interface

Create one wireframe that represents this capability.

Low-fidelity is sufficient (boxes, labels, structure)

Drawn, exported from a tool, created with simple shapes

This wireframe answers: "What does the user see and interact with?"

---

## Design Rationale
Explain your design decisions:
How does this design support the intent and value defined in your Assignment 1?
What did you deliberately leave out?
What assumptions or constraints influenced your design?
Clarity over completeness. Structure over cleverness.
