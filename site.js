// Planer-Apps – kleine Helfer für alle Seiten. Keine Tracker, keine fremden Server.
(function () {
  var root = document.documentElement;

  // Menü „Alle Apps“: schließt bei Klick daneben oder mit Esc.
  var menu = document.querySelector('.pa-apps');
  if (menu) {
    document.addEventListener('click', function (e) { if (menu.open && !menu.contains(e.target)) menu.open = false; });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') menu.open = false; });
  }

  // Die Website ist immer dunkel (Wunsch 18.11.). Eine früher gespeicherte Wahl „hell“ wird vergessen.
  root.setAttribute('data-theme', 'dark');
  try { localStorage.removeItem('theme'); } catch (e) {}

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
