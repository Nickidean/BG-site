import { createElement, useEffect, useState } from '../vendor/react.js';
import htm from '../vendor/htm.js';

const html = htm.bind(createElement);

const RECOMMENDATION_ICONS = {
  exercise: '🐾',
  rest: '😴',
  treats: '🦴',
};

export function HomeScreen() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/today')
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) {
    return html`<div class="card"><p>Loading ${'Buddy'}'s day...</p></div>`;
  }

  const { pet, today } = data;

  return html`
    <div class="home">
      <div class="pet-header">
        <h1>${pet.name}</h1>
        <p class="pet-meta">${pet.breed} · ${pet.age} years old</p>
      </div>

      <div class="card health-card">
        <p>${today.health_message}</p>
      </div>

      <div class="card recommendation-card">
        <span class="recommendation-icon">${RECOMMENDATION_ICONS[today.recommendation]}</span>
        <p>${today.recommendation_message}</p>
      </div>

      ${today.feeding_flag && html`
        <div class="card feeding-card">
          <p>🍽️ ${today.feeding_flag}</p>
        </div>
      `}
    </div>
  `;
}
