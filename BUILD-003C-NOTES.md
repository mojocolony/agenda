# Build 003c — Agenda list geometry repair

This is a focused repair pass on the continuous Agenda plane.

- Prevents horizontal scrolling inside the Agenda list.
- Replaces `scrollIntoView()` startup positioning with vertical `scrollTop`, avoiding horizontal viewport displacement inside the transformed spatial planes.
- Restores more generous empty-day and populated-day proportions.
- Gives the weekday/date column enough room so labels do not clip at the left edge.
- Keeps the already-correct floating month heading/fade behavior unchanged.
- Preserves event-row hierarchy and expands populated days according to content.

GitHub Actions remains the authoritative React/Vitest/build verification because npm packages cannot be installed in the authoring environment.
