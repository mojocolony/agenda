# Agenda v0.1 — Build 002b

Bugfix checkpoint for the Month week-selector control.

## Change

The spatial swipe surface no longer captures pointer input that begins on interactive controls (buttons, links, form controls, or role=button elements). This prevents the parent plane gesture from swallowing the Month three-circle toggle and other buttons.

The Month test now also verifies that toggling replaces the large calendar with the compact week selector and toggling again restores the large calendar.

## Verification

Archive/static checks were performed in the authoring environment. The full React test/build pipeline must be verified by GitHub Actions.
