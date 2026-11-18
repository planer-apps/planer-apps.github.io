// Planer-Apps – kleine Helfer für alle Seiten. Keine Tracker, keine fremden Server.
(function () {
  var root = document.documentElement;

  // Menü „Alle Apps“: schließt bei Klick daneben oder mit Esc.
  var menu = document.querySelector('.pa-apps');
  if (menu) {
    document.addEventListener('click', function (e) { if (menu.open && !menu.contains(e.target)) menu.open = false; });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') menu.open = false; });
  }

  // Seiten ohne eigenen Design-Knopf bekommen einen in der Leiste.
  try { var saved = localStorage.getItem('theme'); if (saved) root.setAttribute('data-theme', saved); } catch (e) {}
  if (!document.getElementById('themeBtn')) {
    var right = document.querySelector('.pa-right');
    if (right) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'pa-theme'; b.textContent = '◐'; b.setAttribute('aria-label', 'Hell oder dunkel');
      b.addEventListener('click', function () {
        var dark = root.getAttribute('data-theme') ? root.getAttribute('data-theme') === 'dark'
          : matchMedia('(prefers-color-scheme: dark)').matches;
        var next = dark ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch (e) {}
        document.dispatchEvent(new Event('pa-theme'));
      });
      right.appendChild(b);
    }
  }

  // Sanftes Einblenden beim Scrollen (nur wenn Animationen erlaubt sind).
  var items = document.querySelectorAll('.reveal');
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || calm) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }
})();
