# Build 003d — spatial gesture regression repair

This build fixes a regression introduced by the 002b interactive-control workaround.

## Root cause

Spatial navigation was skipping `pointerdown` whenever the gesture began on a
button, link, input, or other interactive target. Month is composed largely of
buttons (every selectable date is a button), so a normal swipe from Month to
Agenda could be ignored.

## Change

Pointer gestures now begin normally even over buttons. Pointer capture is
delayed until movement clearly becomes a horizontal drag (10 px and horizontal
movement greater than vertical movement). This preserves ordinary taps while
allowing horizontal navigation to start on calendar dates and other controls.

The Agenda list geometry/fade behavior from 003c is otherwise unchanged.

GitHub Actions remains the authoritative React/Vitest/build verification.
