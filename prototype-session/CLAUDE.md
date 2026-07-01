# CLAUDE.md

This file is loaded automatically at the start of every Claude Code session.
Keep it short — it is shared context, not documentation.

## What this project is

A working prototype built during a hands-on AI prototyping session for British Gas.

The product being prototyped is **Paws & Pulse** — a nationwide premium pet care
ecosystem. Members pay a monthly subscription that includes a smart collar (tracking
vitals and activity) and access to a 24/7 digital triage platform, routine vet
bookings, and an emergency mobile vet dispatch service.

The participant has chosen **one** of the following sub-problems to focus on:

- **A — Low engagement:** No compelling daily reason to open the app. Collar data
  isn't surfaced in a way that earns a habit.
- **B — Symptom → booking:** The path from "my pet seems unwell" to booking an
  emergency vet is broken. Users drop off and call customer service instead.
- **C — Cost clarity:** Users can't quickly tell what their subscription covers
  versus what costs extra — creating anxiety at exactly the wrong moment.
- **D — Live vet tracking:** Once a mobile vet is dispatched, there is no interface
  to track them en route.

**Important:** The participant is building one angle only. Do not suggest expanding
scope to cover other angles. When the brief is provided, build only what it specifies.

## Tech stack

- **Backend:** Python + Flask
- **Database:** SQLite (a single `database.db` file in the project root, auto-created)
- **Frontend:** HTML, CSS, and React loaded via ESM in the browser — no build step
- **Server:** Flask runs the app at `http://localhost:5001`

## How to run the app

```bash
pip3 install -r requirements.txt
python3 -m flask run --debug --port 5001
```

> Use `python3 -m flask` (not `flask`) — it works regardless of PATH setup.
> Port 5001 is used on purpose: macOS reserves port 5000 for AirPlay.

The app is then live at **http://localhost:5001**.

## Frontend pattern (read before writing any React)

All React uses **ES modules + htm** — no Babel, no npm, no build step.

- `static/app.js` is the entry point. Components live in `static/components/`.
- Use `html\`...\`` template literals instead of JSX.
- Render components as `` html`<${MyComponent} />` ``, not `<MyComponent />`.
- Add new pages as new Flask routes plus new `.js` files; import shared components across them.

Example component (`static/components/Button.js`):
```js
import { createElement } from 'https://esm.sh/react@18';
import htm from 'https://esm.sh/htm@3';
const html = htm.bind(createElement);

export function Button({ label, onClick }) {
  return html`<button onClick=${onClick}>${label}</button>`;
}
```

## Build standards

- Handle errors properly — show a clear message when something goes wrong.
- Write clean, readable code with short comments on non-obvious decisions.
- Build a polished UI — layout, spacing, and visual hierarchy matter.
- Every feature should work end-to-end before moving on.
- Run Flask in debug mode so changes reload on browser refresh.

## Which instructions to follow, and when

- **First-time setup / scaffolding the project →** follow `SETUP.md` exactly.
  Create the files as written and run the app. **Do NOT run the build
  workflow during scaffolding** — there is no PRD yet, so just build and run.
- **Building features from a PRD →** follow `WORKFLOW.md`.

Keep this file updated as the app grows: once a PRD is confirmed, add a short
summary of what the app does in the "What this project is" section above.
