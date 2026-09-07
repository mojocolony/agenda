# Agenda v0.1 — Build 003

## Focus
Replaces the Agenda-plane placeholder with the first functional continuous Agenda list.

## Included
- Continuous chronological day rows, including compact empty days.
- Populated days expand to fit events.
- Calendar-colour event dots.
- Timed-event time labels and all-day labels.
- Event locations as secondary text.
- Pale add controls on empty days.
- Large floating month heading in the form `SEPTEMBER ’26`.
- Month heading updates as the list crosses month boundaries.
- Heading reappears while scrolling and fades after about two seconds of inactivity.
- Initial list position is anchored around today.
- Unit/component tests for continuous-day generation, month-heading format, and event rendering.

## Verification
The archive and source structure were checked locally. Full React/TypeScript tests and production build remain delegated to GitHub Actions because this environment cannot currently install/use the npm dependency set reliably.
