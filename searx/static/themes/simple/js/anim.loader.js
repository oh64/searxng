document.addEventListener('DOMContentLoaded', async () => {
    const form = document.querySelector('form#search');
    const overlay = document.getElementById('loading_overlay');
    const loadingText = document.getElementById('loading_text');
    let enginesCache = {};
    let index = 0;
    let interval = null;

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
        const catValue = formData.get('categories') || formData.get('category_general') || '';
        const category = (catValue === "1" || catValue === "general") ? "web" : (catValue || "web");

        overlay.style.display = 'flex';
        index = 0;

        const engines = enginesCache[category] || ["the web"];

        interval = setInterval(() => {
            if (index < engines.length) {
                loadingText.textContent = `Searching on ${engines[index]}...`;
                index++;
            } else {
                loadingText.textContent = `Finalizing the ${category} search...`;
                clearInterval(interval);
                interval = null;
            }
        }, 500);
    });

    window.addEventListener('pageshow', () => {
        if (interval) {
            clearInterval(interval);
            interval = null;
        }
        overlay.style.display = 'none';
    });
});
