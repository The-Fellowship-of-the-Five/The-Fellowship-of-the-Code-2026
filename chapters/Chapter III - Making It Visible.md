# The Red Book of Westmarch - Chapter 3: Making It Visible

---

## Summary

This chapter introduces the Visual Representation of Lord of the Things (LoTs).    
After defining the situation, intent, and core decision logic in previous chapters, the Fellowship now focuses on turning abstract concepts into a tangible, visible interface.  
  
This artifact translates the system capabilities and flowcharts from earlier chapters into an HTML & CSS prototype, giving the group a first real impression of how the app could look and feel. Making ideas visible forces design decisions that written descriptions alone cannot create.

---

## Artifact

Link: [The Fellowship of the Five - Artifact 3: Representation](https://github.com/The-Fellowship-of-the-Five/The-Fellowship-of-the-Code-2026/blob/main/artifacts/artifact-3/artifact-3-representation.md)

Turning written requirements and flowcharts into something visual is a critical step in any design process.  
The visual prototype answers many questions, like what does the user see, where on the screen and how much detail?

- This artifact presents an HTML & CSS representation of the core interface of LoTs, focusing on the screens and elements that a Fellowship member would interact with.
- The design builds directly on the wireframe from Chapter II by adding visual structure, semantic tags, and a consistent layout.
- The prototype is not complete and purely static — it shows what the app looks like and how it could behave, by using CSS for simulating interactive behavior.

The representation covers:

- The planning mode selection.
- The parameter input form.
- The recipe selection screen.
- A navigation structure which relies on CSS only.

---

## AI Assistance

- We used AI to help translate our wireframe into working HTML and CSS sketches, since none of us had prior experience with front or back end code.
- One challenge was that AI generated code had features we did not ask for, and sometimes it was not understandable. We had to repeatedly strip things back, check our understanding and the codes logic or force the AI to use semantic HTML.
- But AI was especially helpful in teaching us how to manage CSS Flexbox layouts for this mobile design and how to implement small UX improvements, for example: hiding default desktop arrows on number inputs.

---

## Lessons Learned

- Visualizing something that previously only existed as text or a flowchart exposed gaps and contradictions. We realised logic and user friendlyness flaws we somehow missed before. 
- HTML and CSS are more accessible than expected for simple static layouts, but getting spacing and proportions right takes some effort. We were surprised by how much interactivity we could "fake" by just using CSS like :target, without any JavaScript.
- We learned that less is more in early stage prototyping. We thought that showing a clean, focused uid prototype with three well thought out views is more convincing than trying to mock up the entire app at once.


