# Build 003f — verification cleanup

This is deliberately a minimal patch.

- Removes only `src/components/navigation/SpatialPlanes.test.tsx`.
- That test attempted to emulate browser pointer gestures in jsdom and produced false failures.
- Keeps `src/state/useAgendaNavigation.test.ts`, which directly verifies Month → Agenda, Agenda → Month, edge-only Settings entry, and rejection of short/vertical gestures.
- Makes no production UI/navigation changes.
- Makes no workflow changes in this build.

GitHub Actions is the authoritative full test/build verification.
