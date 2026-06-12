/* ============================================================================
   AMERICAN CRAB CO. — interactions (vanilla, no dependencies)
   ============================================================================ */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- sticky header state ---- */
  var header = document.getElementById('site-header');
  function onScroll() { if (header) header.classList.toggle('scrolled', window.scrollY > 30); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- mobile nav ---- */
  var burger = document.getElementById('hamburger');
  var mnav = document.getElementById('mobile-nav');
  function setNav(open) {
    document.body.classList.toggle('nav-open', open);
    if (burger) { burger.setAttribute('aria-expanded', open ? 'true' : 'false'); burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); }
    if (mnav) mnav.setAttribute('aria-hidden', open ? 'false' : 'true');
  }
  if (burger) burger.addEventListener('click', function () { setNav(!document.body.classList.contains('nav-open')); });
  if (mnav) mnav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });
  window.addEventListener('resize', function () { if (window.innerWidth >= 900) setNav(false); });

  /* ---- smooth anchor scroll with header offset ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id === '#') return;
      var t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      if (document.body.classList.contains('nav-open')) setNav(false);
      var off = header ? header.offsetHeight : 0;
      var y = t.getBoundingClientRect().top + window.pageYOffset - off + 1;
      window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
      t.setAttribute('tabindex', '-1');
      setTimeout(function () { t.focus({ preventScroll: true }); }, 480);
    });
  });

  /* ---- scroll reveal ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px 12% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- hero parallax ---- */
  var heroMedia = document.querySelector('.hero-media');
  if (heroMedia && !reduce) {
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y < window.innerHeight * 1.1) heroMedia.style.transform = 'translate3d(0,' + (y * 0.14) + 'px,0)';
    }, { passive: true });
  }

  /* ---- count-up (trust bar) ---- */
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    if (isNaN(target)) return;
    if (reduce) { el.textContent = target + suffix; return; }
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ---- scroll progress ---- */
  var prog = document.getElementById('scroll-progress');
  function updateProg() {
    if (!prog) return;
    var d = document.documentElement, max = d.scrollHeight - d.clientHeight;
    prog.style.width = (max > 0 ? (d.scrollTop / max) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', updateProg, { passive: true });
  updateProg();

  /* ---- form (Formspree + email fallback) ---- */
  var form = document.getElementById('inquiry-form');
  var ok = document.getElementById('form-success');
  var err = document.getElementById('form-error');
  if (form) {
    var btn = form.querySelector('button[type="submit"]');
    var label = btn ? btn.innerHTML : 'Submit';
    var FALLBACK = 'contact@americancrabs.com';

    function val(n) { var el = form.querySelector('[name="' + n + '"]'); return el ? el.value : ''; }
    function mailto() {
      var subj = 'Wholesale crab inquiry — ' + (val('business') || val('name') || 'New lead');
      var body = 'Business: ' + val('business') + '\nContact: ' + val('name') + '\nEmail: ' + val('email') +
        '\nPhone: ' + val('phone') + '\nOrder volume: ' + val('order_volume') + '\nBusiness type: ' + val('business_type') +
        '\n\nMessage:\n' + val('message') + '\n';
      return 'mailto:' + FALLBACK + '?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(body);
    }
    function showOk() { form.setAttribute('hidden', ''); if (ok) ok.removeAttribute('hidden'); }
    function showErr() { if (err) err.removeAttribute('hidden'); if (btn) { btn.disabled = false; btn.innerHTML = label; } }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (err) err.setAttribute('hidden', '');
      if (btn) { btn.disabled = true; btn.innerHTML = 'Sending…'; }
      var action = form.getAttribute('action') || '';
      if (action.indexOf('REPLACE_WITH_YOUR_ID') !== -1 || action.indexOf('formspree.io/f/') === -1) {
        window.location.href = mailto(); showOk(); return;
      }
      fetch(action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
        .then(function (r) { if (r.ok) showOk(); else showErr(); })
        .catch(function () { showErr(); });
    });
  }

  /* ---- 3D tilt on cards (mouse devices only) ---- */
  if (!reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.prod-card, .cat-card').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(900px) rotateX(' + (py * -5).toFixed(2) + 'deg) rotateY(' + (px * 6).toFixed(2) + 'deg) translateY(-5px)';
      });
      card.addEventListener('pointerleave', function () { card.style.transform = ''; });
    });
  }

  /* ---- Hero ambient particles (embers / lantern dust) ---- */
  (function () {
    var hero = document.querySelector('.hero');
    var cv = document.querySelector('.hero-fx');
    if (!hero || !cv || reduce) return;
    var ctx = cv.getContext('2d'), W = 0, H = 0, parts = [], raf = null;
    function mk() { return { x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.7 + 0.4, s: Math.random() * 0.35 + 0.08, dx: (Math.random() - 0.5) * 0.15, o: Math.random() * 0.5 + 0.18 }; }
    function init() { var n = Math.min(70, Math.round(W / 20)); parts = []; for (var i = 0; i < n; i++) parts.push(mk()); }
    function resize() { W = cv.width = hero.offsetWidth; H = cv.height = hero.offsetHeight; init(); }
    function tick() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i]; p.y -= p.s; p.x += p.dx;
        if (p.y < -6) { p.y = H + 6; p.x = Math.random() * W; }
        ctx.beginPath(); ctx.fillStyle = 'rgba(216,150,86,' + p.o + ')'; ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    }
    resize();
    window.addEventListener('resize', resize);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { if (!raf) tick(); } else if (raf) { cancelAnimationFrame(raf); raf = null; } }); }).observe(hero);
    } else { tick(); }
  })();

  /* ---- Magnetic hero buttons (mouse only) ---- */
  if (!reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.hero-cta .btn').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height / 2) * 0.34).toFixed(1) + 'px)';
      });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
  }
})();
