// ESM shim: re-export the React globals defined by the vendored UMD build.
// The UMD script (react.production.min.js) is loaded via a <script> tag in
// index.html and sets window.React. This keeps our app code on clean ESM
// imports with no CDN dependency.
const { createElement, useState, useEffect } = window.React;
export { createElement, useState, useEffect };
export default window.React;
