(function () {
  var root = document.documentElement;

  function detect() {
    try { var s = localStorage.getItem('pa_lang'); if (s === 'de' || s === 'en') return s; } catch (e) {}
    var n = ((navigator.languages && navigator.languages[0]) || navigator.language || 'de').toLowerCase();
    return n.indexOf('de') === 0 ? 'de' : 'en';
  }
  var lang = root.getAttribute('data-lang') || detect();
  root.setAttribute('data-lang', lang);
  root.setAttribute('lang', lang);
  var D = (lang === 'en' && window.PA_EN) || {};
  function norm(s) { return s.replace(/\s+/g, ' ').trim(); }
  window.paT = function (s, vars) {
    var r = D[s] || s;
    if (vars) for (var k in vars) r = r.split('{' + k + '}').join(vars[k]);
    return r;
  };
  window.paMissing = [];

  function translate(el) {
    var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), n, k;
    while ((n = w.nextNode())) {
      if (n.parentElement && n.parentElement.closest('script,style')) continue;
      k = norm(n.nodeValue);
      if (!k) continue;
      if (D[k]) {
        var v = n.nodeValue;
        n.nodeValue = v.match(/^\s*/)[0] + D[k] + v.match(/\s*$/)[0];
      } else if (/[äöüßÄÖÜ]|\b(und|der|die|das|mit|für|ist|du|dein|deine|ohne|oder)\b/.test(k)) {
        window.paMissing.push(k);
      }
    }
    var attrs = ['alt', 'aria-label', 'placeholder', 'title'];
    el.querySelectorAll('[alt],[aria-label],[placeholder],[title]').forEach(function (e) {
      attrs.forEach(function (a) { var v = e.getAttribute(a); if (v && D[norm(v)]) e.setAttribute(a, D[norm(v)]); });
    });
  }

  var own = root.getAttribute('data-pa-pagelang');
  if (lang === 'en') {
    var legal = document.body.hasAttribute('data-pa-legal');
    translate((legal || own) ? (document.querySelector('.pa-bar') || document.body) : document.body);
    if (!own) {
      if (D[norm(document.title)]) document.title = D[norm(document.title)];
      var md = document.querySelector('meta[name="description"]');
      if (md && D[norm(md.content)]) md.content = D[norm(md.content)];
    }
    document.querySelectorAll('[data-en-src]').forEach(function (e) { e.setAttribute('src', e.getAttribute('data-en-src')); });
    document.querySelectorAll('[data-en-href]').forEach(function (e) { e.setAttribute('href', e.getAttribute('data-en-href')); });
    var closed = false;
    try { closed = sessionStorage.getItem('pa_note') === '1'; } catch (e) {}
    var bar = document.querySelector('.pa-bar');
    if (bar && !own && (!closed || legal) && window.PA_EN_NOTE) {
      var note = document.createElement('div');
      note.className = 'pa-note';
      note.innerHTML = '<div class="pa-note-in"><b>DE</b><span></span><button type="button" aria-label="Close">×</button></div>';
      note.querySelector('span').textContent = legal ? PA_EN_NOTE.legal : PA_EN_NOTE.apps;
      var hide = function () {
        if (note.classList.contains('pa-hide')) return;
        note.classList.add('pa-hide');
        if (!legal) try { sessionStorage.setItem('pa_note', '1'); } catch (e) {}
        setTimeout(function () { note.remove(); }, 700);
      };
      note.querySelector('button').addEventListener('click', hide);
      setTimeout(hide, 10000);
      bar.parentNode.insertBefore(note, bar.nextSibling);
    }
    if (window.paMissing.length && window.console) console.info('Planer-Apps: ' + window.paMissing.length + ' Texte ohne Übersetzung → window.paMissing');
  }
  root.classList.remove('pa-tr');

  var cur = document.querySelector('.pa-lang .pa-cur');
  if (cur) cur.textContent = lang.toUpperCase();
  document.querySelectorAll('.pa-lang [data-lang]').forEach(function (b) {
    if (b.getAttribute('data-lang') === lang) b.setAttribute('aria-current', 'true');
    b.addEventListener('click', function () {
      var l = b.getAttribute('data-lang');
      try { localStorage.setItem('pa_lang', l); } catch (e) {}
      if (l !== lang) location.reload();
    });
  });

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[lang]');
    if (!a || a.closest('.pa-bar')) return;
    var l = a.getAttribute('lang');
    if (l === 'de' || l === 'en') try { localStorage.setItem('pa_lang', l); } catch (er) {}
  });

  var menus = document.querySelectorAll('.pa-bar details');
  menus.forEach(function (m) {
    m.addEventListener('toggle', function () { if (m.open) menus.forEach(function (o) { if (o !== m) o.open = false; }); });
  });
  document.addEventListener('click', function (e) { menus.forEach(function (m) { if (m.open && !m.contains(e.target)) m.open = false; }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') menus.forEach(function (m) { m.open = false; }); });

  root.setAttribute('data-theme', 'dark');
  try { localStorage.removeItem('theme'); } catch (e) {}

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
