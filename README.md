# Agenda

Agenda is a faithful reconstruction of the classic Savvy Apps Agenda calendar interaction model.

## Build 001

This first durable checkpoint contains:

- React + Vite + TypeScript foundation
- offline-first IndexedDB repository
- provider boundary for later Google Calendar integration
- shared React calendar context
- four-position spatial navigation: Settings | Six Month | Month | Agenda
- edge-only gesture into Settings from Six Month
- reconstructed Six Month view
- automated unit/component tests
- GitHub Actions build, test and GitHub Pages deployment

Month, Agenda, event detail/editor, calendar management, backup/import and Google Calendar sync are intentionally not complete in this checkpoint.

## GitHub Pages

Push the project to the `main` branch. The included workflow installs dependencies, runs tests, builds the app, and deploys `dist/` to GitHub Pages.
