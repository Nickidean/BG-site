# WORKFLOW.md — how we build features

This workflow applies **only when building features from a PRD**, after the
project has already been scaffolded (see `SETUP.md`). It does not apply during
first-time setup.

Follow these steps every time a PRD is provided or updated:

1. **Read any skill files first.** If a `/skills` folder exists in the project,
   read the relevant files in it and apply them throughout the build. If there
   is no `/skills` folder, skip this step.
2. **Read the PRD in full.** Identify gaps, ambiguities, or missing information,
   and share these before doing anything else.
3. **Ask clarifying questions upfront.** Resolve all open questions before
   writing a single line of code.
4. **Chunk the PRD into logical build phases.** Present the phases for approval
   before starting. Each phase should be independently testable.
5. **After completing each phase, stop.** Ask for testing and verification
   before moving on to the next phase.
6. **Keep `CLAUDE.md` updated.** Once the PRD is confirmed, update the project
   summary in `CLAUDE.md`, and keep it current as the app evolves.
7. **After every phase, check that Flask is running.** If it is, do nothing.
   If it is not, start it with `python3 -m flask run --debug --port 5001` and
   report `http://localhost:5001` so the app can be viewed immediately.

## Build standards (reminder)

- Handle errors properly — show clear messages when something goes wrong.
- Write clean, readable code with short comments on non-obvious decisions.
- Build a polished UI — layout, spacing, and visual hierarchy matter.
- Every feature should work end-to-end before moving to the next phase.
- Run Flask in debug mode so file changes reload — refresh the browser to see updates.
