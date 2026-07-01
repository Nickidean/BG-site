import { createElement } from './vendor/react.js';
import { createRoot } from './vendor/react-dom-client.js';
import htm from './vendor/htm.js';
import { HomeScreen } from './components/HomeScreen.js';

const html = htm.bind(createElement);

function App() {
  return html`<${HomeScreen} />`;
}

const root = createRoot(document.getElementById('root'));
root.render(html`<${App} />`);
