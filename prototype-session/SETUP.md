# SETUP.md — one-time project scaffold

Follow this file **once**, the first time the project is set up. Create every
file below exactly as shown, then run the app. This is a pure scaffolding task:
do not ask for a PRD and do not run the build workflow — just create the files
and start Flask.

`CLAUDE.md`, `SETUP.md`, and `WORKFLOW.md` already exist in the project root —
**do not recreate or overwrite them.**

## Target folder structure

```
/project
  CLAUDE.md            ← already provided (do not touch)
  SETUP.md             ← already provided (do not touch)
  WORKFLOW.md          ← already provided (do not touch)
  app.py               ← create
  database.db          ← created automatically on first run
  requirements.txt     ← create
  /static
    style.css          ← create
    app.js             ← create
    /components        ← create (empty for now)
  /templates
    index.html         ← create
```

---

### `requirements.txt`
```
flask>=3.0.0
```

---

### `app.py`
```python
from flask import Flask, render_template, jsonify
import sqlite3
import os

app = Flask(__name__)

DB_PATH = os.path.join(os.path.dirname(__file__), 'database.db')


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


@app.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    # Port 5001 to avoid the macOS AirPlay conflict on 5000
    app.run(debug=True, port=5001)
```

---

### `templates/index.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>App</title>
  <link rel="stylesheet" href="/static/style.css" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/static/app.js"></script>
</body>
</html>
```

---

### `static/app.js`
```js
import { createElement, useState } from 'https://esm.sh/react@18';
import { createRoot } from 'https://esm.sh/react-dom@18/client';
import htm from 'https://esm.sh/htm@3';

const html = htm.bind(createElement);

function App() {
  return html`
    <div class="card">
      <h1>Hello, World!</h1>
      <p>Flask + React is running. You're ready to build.</p>
    </div>
  `;
}

const root = createRoot(document.getElementById('root'));
root.render(html`<${App} />`);
```

---

### `static/style.css`
```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f5f5f5;
  color: #333;
  line-height: 1.5;
}

#root {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 2.5rem;
  margin-top: 4rem;
  max-width: 480px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  text-align: center;
}

.card h1 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.card p {
  color: #666;
}
```

---

## After creating the files

1. Install dependencies and start the server:
   ```bash
   pip3 install -r requirements.txt
   python3 -m flask run --debug --port 5001
   ```
2. Report back the URL **http://localhost:5001** so it can be opened in a browser.
3. The "Hello, World!" card confirms Flask and React are both working.

If `flask run` reports the port is already in use, start it on `--port 5002`
instead and report that URL.
