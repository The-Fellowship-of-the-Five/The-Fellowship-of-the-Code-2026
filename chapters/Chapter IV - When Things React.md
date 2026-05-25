# The Red Book of Westmarch - Chapter 4: When Things React

---

## Summary

This chapter brings the static interface of Lord of the Things (LoTs) to life.  
After making the meal planning capability visible in Chapter III, we now make it behave.  
The same screens, the same scope, but now wired with logic.  
  
The slice in focus is the recipe based feasibility check. A member selects a recipe, the system compares it against the shared inventory and answers the one question that matters in the wild: can we cook this, and if not, what are we missing?  
No new visuals were added. This chapter is about behavior, state and the constraints.

---

## Artifact

Link: [The Fellowship of the Five - Artifact 4: Logic & State](https://github.com/The-Fellowship-of-the-Five/The-Fellowship-of-the-Code-2026/blob/main/artifacts/artifact-4/artifact-4-logic-state.md)

Turning a static prototype into a functional one is where design meets reality. Decisions that looked fine on a wireframe suddenly have to hold up against actual clicks and changing values.
  
This artifact extends the Chapter III interface with a JavaScript layer that introduces explicit state (selected mode, recipe, parameters) and reacts to user interaction.

---

## AI Assistance

- We expected the hard part to be writing logic, but most bugs were not logic at all: a dead Compare button turned out to be a single undefined variable, which AI traced instantly.  
  
- AI occasionally pushed features beyond our scope, like calculating the correct amounts by people and days. It only made sense to impliment it, but once we saw the limit of the assignment, which was to not create a backend, we removed it again.  
  
- A big lesson for us, was that we should check the browser console first when nothing happens. Finding the error codes fast, solved a lot of our problems.  

---

## Lessons Learned

- A few design decisions. Removing the people and days calculations as well as an improved upon UI with new color was uncomfortable, but matching the code to what the assignment wanted, lead us to concentrating on more important parts.
