# Agenda v0.1 Build 002a

Corrects the Month view test that failed in GitHub Actions because `getByText('13')` matched more than one legitimate date. The test now verifies the selected week button receives the `compact-week--selected` state after interaction.

No production UI or behavior was changed in this patch.
