// SPDX-License-Identifier: AGPL-3.0-or-later

export interface EnginesCache {
  [category: string]: string[];
}

(async () => {
  const form = document.querySelector<HTMLFormElement>('form#search');
  const overlay = document.getElementById('loading_overlay');
  const loadingText = document.getElementById('loading_text');
  let enginesCache: EnginesCache = {};
  let index = 0;
  let interval: number | null = null;

  if (!form || !overlay) return;

  try {
    const response = await fetch('/engines.json');
    enginesCache = await response.json();
  } catch (err) {
    console.error('Error engines.json not fetched', err);
    enginesCache = {};
  }

  form.addEventListener('submit', () => {
    const formData = new FormData(form);
    if (formData.get('q') != '') {
      const catValue = String(formData.get('categories') || formData.get('category_general') || '');
      const category = (catValue === "1" || catValue === "general") ? "web" : (catValue || "web");

      overlay.style.display = 'flex';
      index = 0;

      const engines = enginesCache[String(category)] || ["the web"];

      interval = window.setInterval(() => {
        if (index < engines.length) {
          if (loadingText) loadingText.textContent = `Searching on ${engines[index]}...`;
          index++;
        } else {
          if (loadingText) loadingText.textContent = `Finalizing the ${category} search...`;
          clearInterval(interval!);
          interval = null;
        }
      }, 500);
    }
  });

  window.addEventListener('pageshow', () => {
    if (interval !== null) {
      clearInterval(interval);
      interval = null;
    }
    if (overlay) overlay.style.display = 'none';
  });
})();
