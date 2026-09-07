# Build 003e — CI verification correction

This patch does not change Agenda's production UI or navigation code.

## Fixes

- Corrects the SpatialPlanes regression test: PositionIndicator expresses its
  plane position with the inline CSS `left` property, not `transform`.
- The expected Agenda-plane marker position is therefore `left: 75%`.
- Updates `actions/checkout` and `actions/setup-node` from v4 to v5, matching
  GitHub's warning about the older actions targeting the deprecated Node 20
  action runtime.

GitHub Actions remains the authoritative full test/build verification.
