// partials-loader.js — простой загрузчик HTML-фрагментов.
// Каждый <script type="text/x-partial" data-src="path/to/file.html" data-mount="css-selector">
// будет запрошен по сети и вставлен innerHTML'ом в найденный элемент.
// Шаблоны <template id="..."> внутри partial-ов остаются в DOM и доступны через cloneNode().
//
// Пример:
//   <div data-mount="#preset-buttons"></div>
//   <script type="text/x-partial" data-src="partials/control/preset-buttons.html"></script>
//   <script type="text/x-partial" data-src="partials/control/audio-controls.html" data-mount="#audio-controls"></script>

(function () {
  const tags = Array.from(document.querySelectorAll('script[type="text/x-partial"]'));
  if (tags.length === 0) return;

  const base = document.baseURI || window.location.href;

  function resolve(url) {
    return new URL(url, base).href;
  }

  function inject(mount, html) {
    if (!mount) return;
    const target = document.querySelector(mount);
    if (!target) {
      console.warn('[partials-loader] mount not found:', mount);
      return;
    }
    target.innerHTML = html;
  }

  Promise.all(tags.map(tag => {
    const src = tag.getAttribute('data-src');
    const mount = tag.getAttribute('data-mount');
    if (!src) return Promise.resolve();
    return fetch(resolve(src), { credentials: 'same-origin' })
      .then(r => {
        if (!r.ok) throw new Error('HTTP ' + r.status + ' for ' + src);
        return r.text();
      })
      .then(html => inject(mount, html))
      .catch(err => console.error('[partials-loader] failed:', err));
  })).then(() => {
    document.dispatchEvent(new CustomEvent('partials:loaded'));
  });
})();
