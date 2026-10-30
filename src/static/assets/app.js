/* Yooka — JS mínimo e progressivo. Nada aqui é necessário para ler o site. */
(function () {
  'use strict';

  /* --- Menu mobile -------------------------------------------------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('mainnav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
      document.body.classList.toggle('nav-open', !open);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        document.body.classList.remove('nav-open');
      }
    });
  }

  /* --- Busca interna ------------------------------------------------ */
  var form = document.querySelector('.searchbox');
  var results = document.getElementById('search-results');
  if (form && results) {
    var index = null;
    var loading = false;

    var normalize = function (s) {
      return s
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '');
    };

    var load = function () {
      if (index || loading) return Promise.resolve(index);
      loading = true;
      return fetch('/search-index.json')
        .then(function (r) { return r.json(); })
        .then(function (d) { index = d; loading = false; return index; })
        .catch(function () { loading = false; return []; });
    };

    var render = function (q) {
      if (!q || q.length < 2) {
        results.innerHTML = '';
        return;
      }
      var nq = normalize(q);
      var terms = nq.split(/\s+/).filter(Boolean);
      var hits = index
        .map(function (it) {
          var hay = normalize(it.t + ' ' + it.d + ' ' + it.c);
          var score = 0;
          terms.forEach(function (t) {
            if (normalize(it.t).indexOf(t) === 0) score += 5;
            else if (normalize(it.t).indexOf(t) > -1) score += 3;
            if (normalize(it.d).indexOf(t) > -1) score += 1;
            if (normalize(it.c).indexOf(t) > -1) score += 1;
          });
          return { it: it, score: score };
        })
        .filter(function (x) { return x.score > 0; })
        .sort(function (a, b) { return b.score - a.score; })
        .slice(0, 24);

      if (!hits.length) {
        results.innerHTML = '<p class="muted">Nada encontrado para "' + q + '". Tente "n8n", "custo" ou "WhatsApp".</p>';
        return;
      }
      results.innerHTML = hits
        .map(function (h) {
          return (
            '<article class="card"><div class="card__body">' +
            '<h3 class="card__title"><a href="' + h.it.u + '">' + h.it.t + '</a></h3>' +
            '<p class="card__desc">' + h.it.d + '</p>' +
            '<p class="card__meta"><span>' + h.it.k + '</span><span>·</span><span>' + h.it.c + '</span></p>' +
            '</div></article>'
          );
        })
        .join('');
    };

    var params = new URLSearchParams(window.location.search);
    var initial = params.get('q') || '';
    if (initial) {
      var input = form.querySelector('input');
      if (input) input.value = initial;
      load().then(function () { render(initial); });
    }

    var t;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = form.querySelector('input').value.trim();
      if (q) window.history.replaceState({}, '', '/busca/?q=' + encodeURIComponent(q));
      load().then(function () { render(q); });
      if (results.scrollIntoView) results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    form.addEventListener('input', function () {
      clearTimeout(t);
      var q = form.querySelector('input').value.trim();
      t = setTimeout(function () { load().then(function () { render(q); }); }, 180);
    });
  }

  /* --- Menu mobile (CSS) -------------------------------------------- */
  var style = document.createElement('style');
  style.textContent =
    '@media (max-width:899px){.site-nav.is-open{display:flex;position:absolute;top:64px;left:0;right:0;background:#fff;border-bottom:1px solid var(--line);flex-direction:column;align-items:flex-start;padding:1rem 20px 1.4rem;gap:.9rem;box-shadow:0 12px 24px -18px rgba(11,16,32,.5)}' +
    '.site-nav.is-open ul{flex-direction:column;gap:.75rem;width:100%}' +
    '.site-nav.is-open a{font-size:1rem}' +
    'body.nav-open{overflow:hidden}}';
  document.head.appendChild(style);

  /* --- Copiar modelo de documento ----------------------------------- */
  var copyBtn = document.querySelector('[data-copy-target]');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var code = document.querySelector('.modelo pre code');
      if (!code) return;
      var text = code.textContent;
      var done = function () {
        copyBtn.textContent = 'Copiado';
        setTimeout(function () { copyBtn.textContent = 'Copiar texto'; }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done);
      } else {
        var ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); done(); } catch (e) {}
        document.body.removeChild(ta);
      }
    });
  }

  /* --- Newsletter / toast ------------------------------------------ */
  window.yookaToast = function (msg) {
    var t = document.querySelector('.toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    requestAnimationFrame(function () { t.classList.add('is-visible'); });
    setTimeout(function () { t.classList.remove('is-visible'); }, 3200);
  };
})();
