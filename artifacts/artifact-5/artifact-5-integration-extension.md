# Artifact 5 - Integration & Extension

---

## Selected System Capability

For this assignment we selected a second capability from our Assignment 1 list: **Aggregated Inventory Tracking**.

In Assignment 1 we described it as: each member logs their own items, the system synchronizes everything into a shared group inventory that is visible to everyone. Through Assignments 2 to 4 this inventory only ever existed as a hardcoded object inside `logic.js`. Meal Planning read from it, but no one could see it or change it. This artifact finally gives the inventory its own interface and connects it back to the meal planning slice at the system level.

### Why Inventory Tracking?

Inventory Tracking is the input layer the whole system stands on. Every feasibility check we built reads from the shared inventory, but until now the user had no way to look at it, add to it or correct it. Building it now closes the most obvious gap in the system and turns hidden data into something the Fellowship can actually maintain.

### How the two capabilities relate

The system flow is simple: Inventory Tracking collects and shows the group's resources. Meal Planning reads those resources and runs the feasibility check. Without inventory, meal planning runs on assumptions. With a real, maintained inventory, the comparison becomes honest about its own inputs.

---

## System Flow (Mermaid)

**File:** [flowchart-system.mermaid.md](https://github.com/The-Fellowship-of-the-Five/The-Fellowship-of-the-Code-2026/blob/main/artifacts/artifact-5/src/flowchart-system.mermaid.md)

The system-level flowchart shows how the two capabilities hang together: members feed the shared inventory, the inventory feeds the meal planning comparison, and the comparison returns a feasible or not-feasible result. This is not a detailed interaction flow, it answers how the parts connect.

---

## System Wireframe

**File:** [wireframe-system.png](https://github.com/The-Fellowship-of-the-Five/The-Fellowship-of-the-Code-2026/blob/main/artifacts/artifact-5/src/wireframe-system.png)

The wireframe shows where the new inventory capability lives and how a user moves through it. From the home screen the user can reach either Meal Planning (the existing slice) or Shared Inventory (the new one). Inside the inventory the user can search the current items, start an "Add Ingredients" round, review a draft before confirming, or open an "Adjust" view to correct existing quantities directly.

---

## Implementation Snapshot

**Live preview:** [Artifact 5 - Interface](https://the-fellowship-of-the-five.github.io/The-Fellowship-of-the-Code-2026/artifacts/artifact-5/src/interface.html)

**Source files:**
- [interface.html](https://github.com/The-Fellowship-of-the-Five/The-Fellowship-of-the-Code-2026/blob/main/artifacts/artifact-5/src/interface.html)
- [style.css](https://github.com/The-Fellowship-of-the-Five/The-Fellowship-of-the-Code-2026/blob/main/artifacts/artifact-5/src/style.css)
- [logic.js](https://github.com/The-Fellowship-of-the-Five/The-Fellowship-of-the-Code-2026/blob/main/artifacts/artifact-5/src/logic.js)

This is a light implementation using the same approach as Artifacts 3 and 4: plain HTML structure, CSS built on the existing design tokens, and minimal JavaScript with an in-memory state. There is no backend and no localStorage, the inventory lives in a single array for the session.

The implementation covers:
- A **Shared Inventory screen** that lists all items with quantity and unit, sorted alphabetically, plus a "Recently Added" section that appears right after an update.
- An **Add Ingredients flow** where the user builds a draft list of items, then moves to a **Review** step before confirming. Nothing touches the shared inventory until it is confirmed.
- An **Adjust modal** for correcting or deleting existing quantities directly, without going through the review flow.
- Small constraints that keep the data clean: names are letters only, quantities allow one decimal and cannot be zero, and if a product already exists its unit is locked so the same item never carries mixed units.

This is pattern replication, not a rebuild. The screen-switching, the card layout and the CSS variables all follow the same structure we set up in the earlier artifacts.

---

## Meaningful Extension: Fuse.js (fuzzy search)

### What it is

[Fuse.js](https://www.fusejs.io/) is a small, dependency-free JavaScript library for fuzzy searching. It matches text even when the query has typos or is only a partial match, and ranks results by how close they are.

### How it connects to existing capabilities

The library plugs straight into the inventory's existing search fields and the product-name input. Before, the "Search Inventory" boxes were just placeholder fields. Now:
- Typing in the inventory search filters the list live, and tolerates typos ("tomatos", "tomatoe", "tomatos" all still find Tomatoes).
- The Add Ingredients name field uses the same index to show a clickable suggestion dropdown of items already in stock, which makes it easy to top up an existing product instead of accidentally creating a duplicate.
- The Adjust modal search uses the same fuzzy filter so the user can find the right row in a long list quickly.

It connects to the existing Inventory Tracking capability and does not add a new one. It makes the search and the add-item flow behave better, it does not introduce a new screen or feature.

### Why this extension makes sense

A shared inventory is only useful if people can find things in it fast and without fighting the keyboard. Under pressure, on a phone, in the wild, exact spelling is the last thing anyone should worry about. Fuzzy search changes the behavior of the inventory in a way that matches the original intent: quiet, fast, low-friction decisions. It affects meaning, not just appearance, because a tolerant search that surfaces an existing item is what prevents duplicate entries and keeps the shared inventory accurate.

### Implementation

The library is loaded from a CDN and wired to the existing fields through one small helper that builds a Fuse index over the current items and re-renders the list on every keystroke:

```javascript
function attachFuzzySearch(inputId, items, renderRow, targetElement) {
    const input = document.getElementById(inputId);
    const fuse = new Fuse(items, { keys: ["name"], threshold: 0.4 });

    input.oninput = () => {
        const query = input.value.trim();
        const results = query ? fuse.search(query).map((r) => r.item) : items;
        targetElement.innerHTML = results.map(renderRow).join("");
    };
}
```

The same index also powers the product-name autocomplete in the Add screen. If the library were missing the fields would simply not filter, the rest of the inventory still works.

---

## Design Rationale

### How the integrated system still reflects the original intent and value

Assignment 1 defined the intent as giving the Fellowship the information they need to make quiet, fast decisions. Adding the inventory screen makes the data foundation visible instead of hidden, so the user can see and maintain what the comparison later depends on. The fuzzy search keeps that maintenance fast and forgiving, which is exactly the kind of low-friction interaction the original concept called for.

### How individual slices connect meaningfully

Inventory Tracking provides the data. Meal Planning consumes it and produces a decision. Each slice has a clear role and a clear dependency: the comparison cannot run without the inventory, and the inventory has a purpose because the comparison uses it. The system flowchart makes that one-directional dependency explicit.

### Why the chosen extension makes sense

We picked a library over an API because the most real friction in an inventory is finding and entering items correctly, not external data. Fuse.js affects behavior (tolerant matching, duplicate prevention through suggestions) rather than looks, and it attaches to an existing capability instead of starting a new one. That fits the assignment constraint precisely.

### What we intentionally did not build

- **The link between the two capabilities is conceptual, not wired in code.** The inventory and meal planning live in the same system and flowchart, but we did not merge the two codebases into one running app for this snapshot.
- **No persistence.** The inventory resets on reload. `confirm update` and `save changes` change the in-memory state only, nothing is stored or synced.
- **No real per-member attribution.** Assignment 1 imagined each item belonging to a member. We kept a single shared list for this snapshot and left member tagging out.
- **The remaining capabilities** (shopping lists, load distribution, threat map, alerts, task tracker) stay out of scope, as intended.
