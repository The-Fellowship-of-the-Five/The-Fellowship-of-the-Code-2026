# Artifact 4 - Logic & State

---

## System Capability

We continue with the same capability as in Assignment 2 and 3: **Recipe Based Deficit Calculation**

### Which system capability are we implementing?

The capability lets the Quartermaster or any of the five members pick a recipe, then automatically compares the recipe's required ingredients against the Fellowship's shared inventory (*the inventory is a feature not implemented yet*) and shows what is missing and in what quantity.  
In Assignment 3 this was a static, partially finished click through layout.  
In Assignment 4 the same screens are improved upon and now actually react, choosing a mode, entering parameters, selecting a recipe and running the comparison all change real state and update the UI.

### What state does this capability depend on or modify?

All user decisions live in one explicit state object (`appState` in `logic.js`):

- `mode` – planning mode: `"single"`, `"multi"` or `null` (start)
- `source` – active recipe source tab: `"all"`, `"saved"`, `"history"`
- `selectedRecipe` – name of the chosen recipe: (`null` = nothing selected)
- `people`, `days`, `buffer` – the numeric parameters from the input fields: (default 9 / 3 / 1)
- `saved`, `shared` – whether the result was saved or shared

One single shared inventory is the source. The available amounts never change between recipes, whether a meal is feasible falls out of the comparison itself, which keeps the model honest and the UI consistent.

### Why this capability matters for the Fellowship at this stage of the journey

The Fellowship is moving through hostile wilderness with scarce, unreliable resupply. Food is now a survival resource that must be planned, not improvised. A manual check is slow and error prone under pressure. Exactly what the group cannot afford. Turning the static mock up into a working comparison means a decision that used to require remembering everything correctly now, happens quietly and reliably in a few taps.

---

## Interface Artifact

[Artifact 4 - Interface](https://the-fellowship-of-the-five.github.io/The-Fellowship-of-the-Code-2026/artifacts/artifact-4/src/interface.html)

**Source files:**
- [interface.html](https://github.com/The-Fellowship-of-the-Five/The-Fellowship-of-the-Code-2026/blob/main/artifacts/artifact-4/src/interface.html)
- [style.css](https://github.com/The-Fellowship-of-the-Five/The-Fellowship-of-the-Code-2026/blob/main/artifacts/artifact-4/src/style.css)
- [logic.js](https://github.com/The-Fellowship-of-the-Five/The-Fellowship-of-the-Code-2026/blob/main/artifacts/artifact-4/src/logic.js)

---

## Design Rationale

### How does the logic support the intent and value from Assignment 1?

Assignment 1 asked for a system that relieves the group from chaotic manual checks and supports quiet, fast decisions. The logic delivers exactly that. The user picks a recipe and presses one button, and the system answers the survival question, is it feasible or not, and what is missing, without any mental arithmetic.  
Keeping a single, readable state object means every decision is captured in one place and the UI always reflects the current truth.

### How does the implemented behavior reflect the flow and wireframe from Assignment 2?

The flow from Assignment 2 is preserved. Selecting *single* vs. *multi* mode sets `appState.mode` and the pagination dots are generated dynamically to match the number of steps for that mode. The recipe-source tabs (`all` / `saved` / `history`) update `appState.source` and the active tab. Picking a recipe card stores `selectedRecipe`, pressing "compare" runs the calculation and renders the result tables on the feasibility screens, switching to the "success" or the "not feasible" screen depending on the data. This mirrors the wireframe screens directly, now driven by state instead of static links.

### What constraints or assumptions shaped the logic?

- Plain JavaScript only, no frameworks: State is a single object, the DOM is updated through small helper functions, and screens are switched with a CSS class. No build step, no libraries.
- Mobile only assumption carried over from Assignment 3: The phone-shell layout and touch oriented inputs stay unchanged.
- Two inventory snapshots instead of live data: A normal stock and a reduced stock are hard coded so both the feasible case and the deficit (red) case can be demonstrated without a backend.

### What did we deliberately not implement yet?

- Backend calculations: As of now adding more people, days or buffer days to the parameters will not change the amount of food necessary to complete a recipe. 
- Real persistence: `saved` and `shared` are state flags only, nothing is written to storage or sent anywhere yet.
- Inventory sync, map, threats and task tracker: Remain out of scope, exactly as defined for this single capability.
- No new visuals: The interface reuses the plain visual design from Assignment 3 (system font, neutral palette), Assignment 4 only adds behavior, state and the result screens already defined in the Assignment 2 wireframe.
