(function () {
  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ScrollTrigger);

  // ---- smooth scroll (Lenis) synced with GSAP ----
  if (window.Lenis) {
    var lenis = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: { offset: -80 } });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    window.__lenis = lenis;
  }
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.from((r || document).querySelectorAll(s)); };
  var fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  // ---- scroll progress bar ----
  var bar = document.createElement('div'); bar.id = 'fx-progress'; document.body.appendChild(bar);
  gsap.to(bar, { scaleX: 1, ease: 'none', scrollTrigger: { scrub: 0.2, start: 0, end: 'max' } });

  // ---- header shadow on scroll ----
  var header = $('header');
  if (header) {
    header.id = 'site-header';
    ScrollTrigger.create({ start: 20, onToggle: function (s) { header.classList.toggle('fx-scrolled', s.isActive); } });
  }

  // ---- HERO ----
  var hero = $('#hero');
  if (hero) {
    [[-60, 340, '#bfdbfe'], [-90, 380, '#a5f3fc']].forEach(function (b, i) {
      var el = document.createElement('div'); el.className = 'fx-blob';
      el.style.cssText = 'width:' + b[1] + 'px;height:' + b[1] + 'px;background:' + b[2] + ';' +
        (i ? 'bottom:-120px;right:' + b[0] + 'px' : 'top:-80px;left:' + b[0] + 'px');
      hero.prepend(el);
      gsap.to(el, { x: i ? -60 : 70, y: i ? -50 : 60, duration: 9 + i * 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    });
    for (var i = 0; i < 16; i++) {
      var s = gsap.utils.random(8, 26), bub = document.createElement('div');
      bub.className = 'fx-bubble';
      bub.style.cssText = 'width:' + s + 'px;height:' + s + 'px;left:' + gsap.utils.random(2, 96) + '%';
      hero.prepend(bub);
      gsap.to(bub, { y: -(hero.offsetHeight + 80), x: 'random(-40,40)', opacity: 0, duration: gsap.utils.random(7, 14), delay: gsap.utils.random(0, 8), repeat: -1, ease: 'none', startAt: { opacity: 0.9 } });
    }

    var h1 = $('h1', hero);
    if (h1) {
      var words = h1.textContent.trim().split(/\s+/);
      h1.innerHTML = words.map(function (w, k) {
        var inner = (k === words.length - 1) ? '<span class="fx-grad">' + w + '</span>' : w;
        return '<span class="fx-word"><span>' + inner + '</span></span>';
      }).join(' ');
      h1.setAttribute('aria-label', words.join(' '));
    }
    var heroBits = $$('.lg\\:text-left > p, .lg\\:text-left > a', hero);
    gsap.set(heroBits, { y: 28, opacity: 0 });
    var tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from($$('.fx-word>span', hero), { yPercent: 115, rotate: 4, duration: 0.9, stagger: 0.12 })
      .to(heroBits, { y: 0, opacity: 1, duration: 0.7, stagger: 0.12 }, '-=0.5');

    var img = $('img', hero);
    if (img) {
      var wrap = img.parentElement; wrap.classList.add('fx-imgwrap');
      tl.from(img, { clipPath: 'inset(0 0 100% 0 round 1rem)', scale: 1.25, duration: 1.3, ease: 'power4.inOut' }, 0.2);
      gsap.to(img, { yPercent: 6, scale: 1.06, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
      var mk = function (html, css) {
        var d = document.createElement('div'); d.className = 'fx-badge'; d.style.cssText = css; d.innerHTML = html; wrap.appendChild(d); return d;
      };
      var b1 = mk('<span class="dot"></span><span><b>Διαθέσιμος 24/7</b><small>Άμεση ανταπόκριση</small></span>', 'left:-.5rem;bottom:1.5rem');
      var b2 = mk('<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg><span><b>Ηράκλειο &amp; όλη η Κρήτη</b><small>Επαγγελματική εξυπηρέτηση</small></span>', 'right:-.5rem;top:1.5rem');
      tl.from([b1, b2], { scale: 0.6, opacity: 0, y: 20, duration: 0.7, stagger: 0.18, ease: 'back.out(1.8)' }, '-=0.4');
      gsap.to(b1, { y: -10, duration: 2.6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to(b2, { y: 10, duration: 3.1, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }
  }

  // ---- section headings ----
  $$('section h2').filter(function (h) { return !h.closest('article'); }).forEach(function (h) {
    gsap.from(h, { y: 36, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: h, start: 'top 88%' } });
    var p = h.nextElementSibling;
    if (p && p.tagName === 'P') gsap.from(p, { y: 24, opacity: 0, duration: 0.8, delay: 0.12, ease: 'power3.out', scrollTrigger: { trigger: h, start: 'top 88%' } });
  });

  // ---- service cards: staggered entrance + 3D tilt ----
  var cards = $$('#services .grid > *');
  if (cards.length) {
    var icons = $$('#services .grid svg');
    gsap.set(cards, { opacity: 0, y: 60, scale: 0.94 });
    gsap.set(icons, { opacity: 0, scale: 0.4, rotate: -25 });
    ScrollTrigger.create({
      trigger: '#services .grid', start: 'top 88%', once: true,
      onEnter: function () {
        gsap.to(cards, { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.14, ease: 'power3.out', onComplete: function () { cards.forEach(function (c) { c._tiltReady = true; }); } });
        gsap.to(icons, { opacity: 1, scale: 1, rotate: 0, duration: 0.9, delay: 0.3, stagger: 0.14, ease: 'back.out(2)' });
      }
    });
    if (fine) cards.forEach(function (c) {
      c.classList.add('fx-tilt');
      c.style.transformPerspective = 800;
      var tilt = function (x, y) { if (!c._tiltReady) return; gsap.to(c, { rotationY: x, rotationX: y, duration: 0.4, ease: 'power2.out', overwrite: 'auto' }); };
      c.addEventListener('mousemove', function (e) {
        if (!c._tiltReady) return;
        var r = c.getBoundingClientRect();
        tilt(((e.clientX - r.left) / r.width - 0.5) * 14, -((e.clientY - r.top) / r.height - 0.5) * 14);
      });
      c.addEventListener('mouseleave', function () { tilt(0, 0); });
    });
  }

  // ---- text blocks & FAQ ----
  $$('#about .space-y-6 > div, #faq details').forEach(function (el) {
    gsap.from(el, { y: 30, opacity: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
  });

  // ---- emergency CTA: sonar rings + pulsing button ----
  var cta = $('#cta-now');
  if (cta) {
    var btn = $('a', cta);
    for (var r = 0; r < 3; r++) {
      var ring = document.createElement('div'); ring.className = 'fx-ring'; cta.prepend(ring);
      gsap.fromTo(ring, { scale: 0.3, opacity: 0.9 }, { scale: 4.2, opacity: 0, duration: 3.6, delay: r * 1.2, repeat: -1, ease: 'power1.out' });
    }
    gsap.set(btn, { scale: 0.7, opacity: 0 });
    ScrollTrigger.create({ trigger: cta, start: 'top 85%', once: true, onEnter: function () {
      gsap.to(btn, { scale: 1, opacity: 1, duration: 0.9, ease: 'elastic.out(1,0.5)', onComplete: function () {
        gsap.to(btn, { scale: 1.05, duration: 0.9, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      } });
    } });
  }

  // ---- gallery tiles ----
  var tiles = $$('#photo-grid .gallery-item');
  if (tiles.length) {
    gsap.set(tiles, { opacity: 0 });
    ScrollTrigger.batch(tiles, {
      start: 'top 92%',
      once: true,
      onEnter: function (b) { gsap.fromTo(b, { y: 50, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.09, ease: 'power3.out' }); }
    });
  }

  // ---- magnetic phone buttons (never touch an element that is still animating in) ----
  if (fine) $$('a[href^="tel:"]').forEach(function (a) {
    if (a.closest('#cta-now') || a.closest('main > section:last-child')) return;
    var inHero = hero && hero.contains(a);
    a._mag = !inHero;
    if (inHero && typeof tl !== 'undefined') tl.eventCallback('onComplete', function () { a._mag = true; });
    var move = function (x, y) { if (a._mag) gsap.to(a, { x: x, y: y, duration: 0.4, ease: 'power3.out', overwrite: 'auto' }); };
    a.addEventListener('mousemove', function (e) {
      var r = a.getBoundingClientRect();
      move((e.clientX - r.left - r.width / 2) * 0.25, (e.clientY - r.top - r.height / 2) * 0.35);
    });
    a.addEventListener('mouseleave', function () { move(0, 0); });
  });

  // ---- INNER (service) PAGES ----
  var main = $('main');
  if (main && !hero) {
    var ihero = $('section', main);
    if (ihero) {
      for (var j = 0; j < 14; j++) {
        var sz = gsap.utils.random(8, 24), bb = document.createElement('div');
        bb.className = 'fx-bubble';
        bb.style.cssText = 'z-index:0;width:' + sz + 'px;height:' + sz + 'px;left:' + gsap.utils.random(2, 96) + '%';
        ihero.prepend(bb);
        gsap.to(bb, { y: -(ihero.offsetHeight + 80), x: 'random(-40,40)', opacity: 0, duration: gsap.utils.random(7, 14), delay: gsap.utils.random(0, 8), repeat: -1, ease: 'none', startAt: { opacity: 0.9 } });
      }
      var ih1 = $('h1', ihero);
      if (ih1) {
        var iw = ih1.textContent.trim().split(/\s+/);
        ih1.style.animation = 'none';
        ih1.innerHTML = iw.map(function (w, k) {
          var inner = (k === iw.length - 1) ? '<span class="fx-grad">' + w + '</span>' : w;
          return '<span class="fx-word"><span>' + inner + '</span></span>';
        }).join(' ');
        ih1.setAttribute('aria-label', iw.join(' '));
        gsap.from($$('.fx-word>span', ih1), { yPercent: 115, rotate: 4, duration: 0.9, stagger: 0.1, delay: 0.15, ease: 'power3.out' });
      }
      var card = $('.hidden.lg\\:block > div', ihero);
      if (card) gsap.to(card, { y: -10, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }

    var reveal = function (sel, from) {
      var els = $$(sel, main);
      if (!els.length) return;
      gsap.set(els, { opacity: 0, y: from || 40 });
      ScrollTrigger.batch(els, {
        start: 'top 92%', once: true,
        onEnter: function (b) { gsap.to(b, { opacity: 1, y: 0, duration: 0.75, stagger: 0.12, ease: 'power3.out', overwrite: 'auto', onComplete: function () { b.forEach(function (e) { e._tiltReady = true; }); } }); }
      });
    };
    reveal('article', 50);
    reveal('aside > *', 40);
    reveal('ol > li', 50);
    reveal('a.group', 50);
    $$('ol > li > span', main).forEach(function (n) {
      gsap.from(n, { scale: 0, rotate: -90, duration: 0.7, ease: 'back.out(2.5)', scrollTrigger: { trigger: n, start: 'top 92%', once: true } });
    });
    if (fine) $$('a.group, article', main).forEach(function (c) {
      c.style.transformPerspective = 900;
      var tilt = function (x, y) { if (!c._tiltReady) return; gsap.to(c, { rotationY: x, rotationX: y, duration: 0.4, ease: 'power2.out', overwrite: 'auto' }); };
      c.addEventListener('mousemove', function (e) {
        if (!c._tiltReady) return;
        var r = c.getBoundingClientRect();
        tilt(((e.clientX - r.left) / r.width - 0.5) * 6, -((e.clientY - r.top) / r.height - 0.5) * 6);
      });
      c.addEventListener('mouseleave', function () { tilt(0, 0); });
    });

    var last = $$('section', main).pop();
    var box = last && $('div.relative', last);
    if (box) {
      for (var q = 0; q < 3; q++) {
        var rg = document.createElement('div'); rg.className = 'fx-ring'; box.prepend(rg);
        gsap.fromTo(rg, { scale: 0.3, opacity: 0.9 }, { scale: 4.2, opacity: 0, duration: 3.6, delay: q * 1.2, repeat: -1, ease: 'power1.out' });
      }
      gsap.from(box, { scale: 0.92, opacity: 0, y: 40, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: box, start: 'top 90%', once: true } });
      var cb = $('a[href^="tel:"]', box);
      if (cb) gsap.to(cb, { scale: 1.05, duration: 0.9, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1 });
    }
  }

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
