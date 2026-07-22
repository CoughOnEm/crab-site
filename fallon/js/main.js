/* FALLON AUTOMOTIVE — ULTRA
   Vanilla JS: header state, scroll progress, parallax, counters,
   service explorer, review carousel, multi-step booking, CDN image fallback. */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- CDN fallback (photography ships locally via build.sh at deploy) ---- */
  var CDN_BASE = 'https://d8j0ntlcm91z4.cloudfront.net/user_3CoFtxTYCt49Ypjs9T2Uvarqo9K/';
  var CDN = {
    'hero-shop.webp': 'hf_20260722_212727_f32ec25e-c1bc-46c3-86b1-607567d72fcf_min.webp',
    'brake-service.webp': 'hf_20260722_213139_d598c2cc-19b7-48e9-b279-9044b88dfd45_min.webp',
    'diagnostics.webp': 'hf_20260722_213145_5498283a-03a9-4ddd-900c-e473486f7c1a_min.webp',
    'service-advisor.webp': 'hf_20260722_213149_9d3a8897-8994-48ec-9642-d223522d3ecf_min.webp',
    'storefront-dusk.webp': 'hf_20260722_213152_5da17748-7005-4f6e-842f-03b8162d9805_min.webp',
    'alignment.webp': 'hf_20260722_213228_120fa35b-72a6-4aa9-bc69-13c04d18caab_min.webp',
    'detail-tools.webp': 'hf_20260722_213243_0c05e047-1dad-4c53-8de5-4ad333242d67_min.webp',
    'hybrid-service.webp': 'hf_20260722_213304_9ce67196-e217-467a-8387-49797ae7a663_min.webp',
    'portrait-tech.webp': 'hf_20260722_213311_61b8d5bd-ee74-455c-858b-1fba4ff1f3df_min.webp',
    'mechanic-underbody.webp': 'hf_20260722_214701_3dbc83a7-4375-4e14-8077-cd2c6ff8093c_min.webp'
  };
  function cdnFallback(img) {
    var name = (img.getAttribute('src') || '').split('/').pop();
    if (CDN[name] && !img.dataset.cdnTried) {
      img.dataset.cdnTried = '1';
      img.src = CDN_BASE + CDN[name];
    }
  }
  document.querySelectorAll('img[src^="img/"]').forEach(function (img) {
    img.addEventListener('error', function () { cdnFallback(img); });
    if (img.complete && img.naturalWidth === 0) cdnFallback(img);
  });

  /* ---- Header + scroll progress + hero parallax ---- */
  var hdr = document.querySelector('.hdr');
  var progress = document.querySelector('.progress');
  var heroBg = document.querySelector('.hero-bg');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;
      if (hdr) hdr.classList.toggle('scrolled', y > 40);
      if (progress) {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
      }
      if (heroBg && !reduceMotion && y < window.innerHeight * 1.2) {
        heroBg.style.transform = 'translateY(' + y * 0.25 + 'px)';
      }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Reveal on scroll ---- */
  if ('IntersectionObserver' in window) {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    document.querySelectorAll('.rv').forEach(function (el) { rio.observe(el); });
    // Safety net: nothing stays hidden if an observation is ever missed.
    setTimeout(function () {
      document.querySelectorAll('.rv:not(.in)').forEach(function (el) { el.classList.add('in'); });
    }, 3000);
  } else {
    document.querySelectorAll('.rv').forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Animated counters ---- */
  function animateCount(el) {
    var target = parseFloat(el.dataset.count);
    var decimals = (el.dataset.count.split('.')[1] || '').length;
    // reserve final width so the count-up never shifts layout
    el.style.display = 'inline-block';
    el.style.minWidth = el.dataset.count.length + 'ch';
    var dur = 1600, t0 = null;
    if (reduceMotion) { el.textContent = el.dataset.count; return; }
    function tick(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    document.querySelectorAll('[data-count]').forEach(function (el) { cio.observe(el); });
  } else {
    document.querySelectorAll('[data-count]').forEach(function (el) { el.textContent = el.dataset.count; });
  }

  /* ---- Service explorer ---- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.svc-tab'));
  var stageImgs = Array.prototype.slice.call(document.querySelectorAll('.svc-stage img'));
  var infos = Array.prototype.slice.call(document.querySelectorAll('.svc-info-item'));
  function selectService(idx) {
    tabs.forEach(function (t, i) { t.setAttribute('aria-selected', i === idx ? 'true' : 'false'); });
    stageImgs.forEach(function (im, i) { im.classList.toggle('on', i === idx); });
    infos.forEach(function (inf, i) { inf.hidden = i !== idx; });
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectService(i); });
    tab.addEventListener('keydown', function (ev) {
      var dir = ev.key === 'ArrowDown' ? 1 : ev.key === 'ArrowUp' ? -1 : 0;
      if (dir) {
        ev.preventDefault();
        var next = (i + dir + tabs.length) % tabs.length;
        tabs[next].focus();
        selectService(next);
      }
    });
  });
  if (tabs.length) selectService(0);

  /* ---- Reviews carousel ---- */
  var track = document.querySelector('.rev-track');
  if (track) {
    var slides = track.children.length;
    var cur = 0;
    var dotsWrap = document.querySelector('.rev-dots');
    var dots = [];
    for (var d = 0; d < slides; d++) {
      var b = document.createElement('button');
      b.className = 'rev-dot' + (d === 0 ? ' on' : '');
      b.setAttribute('aria-label', 'Review ' + (d + 1));
      (function (n) { b.addEventListener('click', function () { go(n, true); }); })(d);
      dotsWrap.appendChild(b);
      dots.push(b);
    }
    var timer = null;
    function go(n, manual) {
      cur = (n + slides) % slides;
      track.style.transform = 'translateX(-' + cur * 100 + '%)';
      dots.forEach(function (dot, i) { dot.classList.toggle('on', i === cur); });
      if (manual) restart();
    }
    function restart() {
      if (timer) clearInterval(timer);
      if (!reduceMotion) timer = setInterval(function () { go(cur + 1); }, 6500);
    }
    document.querySelector('.rev-prev').addEventListener('click', function () { go(cur - 1, true); });
    document.querySelector('.rev-next').addEventListener('click', function () { go(cur + 1, true); });
    restart();
  }

  /* ---- Multi-step booking ---- */
  var bookForm = document.querySelector('form[data-book]');
  if (bookForm) {
    var steps = Array.prototype.slice.call(bookForm.querySelectorAll('.bstep'));
    var pills = Array.prototype.slice.call(document.querySelectorAll('.step-pill'));
    var err = bookForm.querySelector('.berr');
    var current = 0;

    bookForm.querySelectorAll('.chiprow').forEach(function (row) {
      row.addEventListener('click', function (ev) {
        var chip = ev.target.closest('.chip');
        if (!chip) return;
        row.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('on'); });
        chip.classList.add('on');
        var input = row.parentElement.querySelector('input[type="hidden"]');
        if (input) input.value = chip.dataset.value;
      });
    });

    function showStep(n) {
      steps.forEach(function (s, i) { s.classList.toggle('on', i === n); });
      pills.forEach(function (p, i) {
        p.classList.toggle('on', i === n);
        p.classList.toggle('done', i < n);
      });
      err.classList.remove('show');
      current = n;
      if (n === 2) fillSummary();
    }
    function validateStep(n) {
      var ok = true;
      steps[n].querySelectorAll('[required]').forEach(function (f) {
        if (!f.value.trim()) ok = false;
      });
      return ok;
    }
    function fillSummary() {
      var d = new FormData(bookForm);
      var el = bookForm.querySelector('.bsummary');
      if (!el) return;
      el.innerHTML =
        '<span><b>Vehicle:</b> ' + esc(d.get('vehicle') || '—') + '</span>' +
        '<span><b>Service:</b> ' + esc(d.get('service') || '—') + '</span>' +
        '<span><b>Location:</b> ' + esc(d.get('location') || '—') + '</span>' +
        '<span><b>When:</b> ' + esc((d.get('preferred_date') || 'First available') + ' · ' + (d.get('preferred_time') || 'Any time')) + '</span>';
    }
    function esc(s) { var div = document.createElement('div'); div.textContent = s; return div.innerHTML; }

    bookForm.querySelectorAll('[data-next]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (validateStep(current)) showStep(current + 1);
        else err.classList.add('show');
      });
    });
    bookForm.querySelectorAll('[data-back]').forEach(function (btn) {
      btn.addEventListener('click', function () { showStep(current - 1); });
    });

    bookForm.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!validateStep(2)) { err.classList.add('show'); return; }
      var d = new FormData(bookForm);
      var lines = ['New appointment request — Fallon Automotive', ''];
      d.forEach(function (v, k) { if (v) lines.push(k.replace(/_/g, ' ') + ': ' + v); });
      window.location.href = 'mailto:service@fallonautomotive.com'
        + '?subject=' + encodeURIComponent('Appointment request — ' + (d.get('name') || 'website'))
        + '&body=' + encodeURIComponent(lines.join('\n'));
      steps.forEach(function (s) { s.classList.remove('on'); });
      pills.forEach(function (p) { p.classList.add('done'); p.classList.remove('on'); });
      bookForm.querySelector('.bdone').classList.add('on');
    });

    showStep(0);
  }

  /* ---- Footer year ---- */
  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();
})();
