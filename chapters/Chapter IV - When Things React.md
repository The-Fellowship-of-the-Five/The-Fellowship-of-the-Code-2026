# The Red Book of Westmarch - Chapter 4: When Things React

*`"It's the job that's never started as takes longest to finish." - Sam Gamgee`*

**Table of Contents**

* [The Red Book of Westmarch - Chapter 4: When Things React](#the-red-book-of-westmarch---chapter-4-when-things-react)
  + [Summary](#summary)
  + [Artifact](#artifact)
  + [AI Assistance](#ai-assistance)
  + [Lessons Learned](#lessons-learned)

---

## Summary

This chapter brings the static interface of Lord of the Things (LoTs) to life.  
After making the meal-planning capability *visible* in Chapter III, the Fellowship now makes it *behave*: the same screens, the same scope, but now wired with logic and state.

The slice in focus is the **recipe-based feasibility check**. A member selects a recipe, the system compares it against the shared inventory and answers the one question that matters in the wild: *can we cook this, and if not, what are we missing?* No new visuals were added. This chapter is about behavior, state, and the constraints that keep the slice honest.

**Learning Outcomes**

* Understand how explicit state turns a static layout into a working interface.
* Apply plain JavaScript to react to user input and update the UI from state.
* Reflect on AI-assisted debugging and on knowing when a feature is out of scope.
* Contribute to a shared, evolving system without expanding its boundaries.

---

## Artifact

Link: [The Fellowship of the Five - Artifact 4: Logic & State](https://github.com/The-Fellowship-of-the-Five/The-Fellowship-of-the-Code-2026/blob/main/artifacts/artifact-4/artifact-4-logic-state.md)

Turning a static prototype into a functional one is where design meets reality. Decisions that looked fine on a wireframe suddenly have to hold up against actual clicks and changing values.

- This artifact extends the Chapter III interface with a JavaScript layer that introduces explicit state (selected mode, recipe, parameters) and reacts to user interaction.
- Selecting a recipe and pressing *Compare* runs a deficit calculation against the shared inventory and routes the user to a *feasible* or *not feasible* screen depending on the result.
- Feasibility is **computed** from the comparison, not stored as a fixed flag, so the available amounts stay consistent across every recipe.

**Build:** HTML + CSS (mostly unchanged from Chapter III) + a plain JavaScript file implementing logic and state.

**Focus:** the recipe-based feasibility check — the same single capability carried through from Chapter II and Chapter III.

---

## AI Assistance

* **What did we expect?** That wiring up the interface would mainly be "add a few click handlers." We expected the visible bugs to be in the code we wrote.
* **What actually happened?** The trickiest problems were not logic at all. The page first rendered as raw code because a link pointed at a `raw` URL instead of the GitHub Pages URL, and the CSS/JS paths were duplicated. Later, a dead *Compare* button turned out to be a single undefined variable. AI was fast at pinpointing these once we shared the exact symptom and the console error.
* **How did AI help or mislead us?** It helped most when we pasted the real error message — it traced a `ReferenceError` straight to the broken line. It occasionally proposed features beyond our scope (e.g. scaling requirements by people and days); we tried it, realised it implied a backend we don't have, and consciously removed it again.
* **What did we decide consciously?** We kept a single source of truth for the inventory, computed feasibility instead of hard-coding it, and treated the parameter inputs as display-only for now. We also kept the existing filename and README links instead of renaming the chapter, to avoid breaking the Red Book index.
* **What would we do differently next time?** Check the browser console first when "nothing happens", and do a hard reload before assuming a fix failed — several "still broken" moments were just a cached file.

---

## Lessons Learned

* Most of our pain came from *plumbing*, not *logic*: hosting URLs, file paths, and browser caching cost us more time than the actual state code. Knowing where a problem lives is half the fix.
* Explicit state makes behavior explainable. Once mode, recipe, and parameters lived in one state object, every screen update could be traced back to a value, which made bugs far easier to reason about.
* Saying "not yet" is a design decision. Removing the people/days scaling was uncomfortable, but matching the slice to what the system can actually support (no backend) kept the artifact honest and within scope.
