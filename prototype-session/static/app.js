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
