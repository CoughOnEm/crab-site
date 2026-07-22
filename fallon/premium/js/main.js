// Fallon Automotive — Premium: navigation + scroll reveal
(function () {
  // Photography ships locally via build.sh at deploy time; until then, fall
  // back to the generated originals on the CDN so previews always render.
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
  function fallback(img) {
    var name = (img.getAttribute('src') || '').split('/').pop();
    if (CDN[name] && !img.dataset.cdnTried) {
      img.dataset.cdnTried = '1';
      img.src = CDN_BASE + CDN[name];
    }
  }
  document.querySelectorAll('img[src^="img/"]').forEach(function (img) {
    img.addEventListener('error', function () { fallback(img); });
    if (img.complete && img.naturalWidth === 0) { fallback(img); }
  });
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('visible'); });
  }

  // Appointment form: no backend wired yet — compose an email instead.
  var form = document.querySelector('form[data-appointment]');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var d = new FormData(form);
      var body = ['New appointment request — fallonautomotive.com', ''];
      d.forEach(function (v, k) { if (v) body.push(k.replace(/_/g, ' ') + ': ' + v); });
      window.location.href = 'mailto:service@fallonautomotive.com'
        + '?subject=' + encodeURIComponent('Appointment request — ' + (d.get('name') || 'website'))
        + '&body=' + encodeURIComponent(body.join('\n'));
      var ok = form.querySelector('.form-success');
      if (ok) { ok.hidden = false; }
    });
  }
})();
