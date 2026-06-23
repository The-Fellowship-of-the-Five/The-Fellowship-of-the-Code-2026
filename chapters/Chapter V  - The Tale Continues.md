# The Red Book of Westmarch - Chapter 5: The Tale Continues

---

## Summary

This chapter steps back and looks at the system as a whole.  
After four assignments spent building one capability from concept to working prototype, we now add a second one and show how the parts connect.

The new slice is Aggregated Inventory Tracking. It was always the hidden foundation under Meal Planning, and now it has its own interface. On top of it we added a library that makes the inventory search typo-tolerant. For the first time LoTs is not a single slice but a small system with two connected parts.

---

## Artifact

Link: [The Fellowship of the Five - Artifact 5: Integration & Extension](https://github.com/The-Fellowship-of-the-Five/The-Fellowship-of-the-Code-2026/blob/main/artifacts/artifact-5/artifact-5-integration-extension.md)

The assignment asked us to pick a second capability, show how it connects to the existing one at the system level, implement it lightly, and add one meaningful extension.

- We chose **Inventory Tracking**, the data layer that Meal Planning always depended on but never made visible.
- The **system-level Mermaid flowchart** shows members feeding the shared inventory and the inventory feeding the meal planning comparison.
- The **system wireframe** shows the home screen branching into Meal Planning and Shared Inventory, plus the add, review and adjust steps.
- The **implementation snapshot** reuses the HTML/CSS/JS patterns from Artifact 4: an inventory list, an add-and-review flow, and an adjust modal, all on an in-memory state.
- The **extension is Fuse.js**, a fuzzy search library wired into the existing search fields and the add-item autocomplete. It tolerates typos and surfaces existing items, which keeps the shared inventory accurate. It affects behavior, not appearance, and the rest of the app still works if it fails to load.

Supporting files:
- [System flowchart (Mermaid)](https://github.com/The-Fellowship-of-the-Five/The-Fellowship-of-the-Code-2026/blob/main/artifacts/artifact-5/src/flowchart-system.mermaid.md)
- [System wireframe](https://github.com/The-Fellowship-of-the-Five/The-Fellowship-of-the-Code-2026/blob/main/artifacts/artifact-5/src/wireframe-system.png)
- [Interface (HTML)](https://github.com/The-Fellowship-of-the-Five/The-Fellowship-of-the-Code-2026/blob/main/artifacts/artifact-5/src/interface.html)

---

## AI Assistance

- We used AI to understand how Fuse.js works and how to attach it to fields we had already built. Wiring one helper to several search boxes at once was the part we needed help thinking through.
- AI was useful for sketching the system-level relationship between the two capabilities, but it kept drifting back into the detailed meal-planning flow from earlier assignments. We had to keep pulling it back to the higher level the assignment actually asked for.
- It also kept suggesting scope creep: per-member attribution, persistence, sorting and filtering options. We cut all of it. Showing the data honestly mattered more than faking features we cannot back up yet.
- The conscious decision we are happiest with was keeping the inventory in memory only. AI proposed localStorage to make it "feel real", but persistence without sync would have been a lie about what the system does.

---

## Lessons Learned

- Connecting two capabilities was harder in thinking than in code. The real work was deciding where Inventory ends and Meal Planning begins, and the flowchart forced us to be precise about that dependency.
- Adding a library was quick once we treated it as an attachment to existing fields rather than a new feature. The lesson was that a good extension makes something we already have behave better, instead of adding something new to maintain.
- Reusing the patterns from Artifact 4 made the inventory screen come together fast. That confirmed the structure we built earlier was worth the effort, which felt like the whole point of carrying one slice through five assignments.
