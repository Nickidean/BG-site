import { createElement } from 'https://esm.sh/react@18';
import { createRoot } from 'https://esm.sh/react-dom@18/client';
import htm from 'https://esm.sh/htm@3';
import { HomeScreen } from './components/HomeScreen.js';

const html = htm.bind(createElement);

function App() {
  return html`<${HomeScreen} />`;
}

const root = createRoot(document.getElementById('root'));
root.render(html`<${App} />`);
