# Agenda v0.1 — Build 002

Build 002 replaces the Month placeholder with the first faithful Month reconstruction from the live original Agenda references.

## Added
- Full month calendar with large italic month/year heading.
- Independent red today treatment and recessed selected-date treatment.
- Adjacent-month dates in pale grey.
- Event-dot positions beneath dates.
- Dark selected-date strip.
- Three-circle mode control.
- Empty-day oversized pale + control.
- Event-row rendering hooks for later local CRUD integration.
- Alternate Month week-selection state with large date panel, compact month, highlighted week, and add control.
- Date and week selection interactions.
- Month-view tests for the principal states and interactions.

## Verification boundary
The source and archive can be inspected locally in the authoring environment, but React/Vite tests and TypeScript build require npm dependencies. GitHub Actions remains the authoritative build/test runner for this checkpoint.
