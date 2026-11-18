/* Dion Greenwood — portfolio behaviour (single page) */
(function () {
  const IG = 'https://www.instagram.com/_deflatedsoda/';
  const NAV = [
    ['showcase', 'Showcase'],
    ['odyssea', 'Odyssea'],
    ['formats', 'Formats'],
    ['results', 'Results'],
    ['press', 'Press'],
    ['about', 'About'],
  ];

  /* ---------- header ---------- */
  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML =
    '<div class="bar"><a class="brand" href="#top">dion greenwood<i>//</i></a>' +
    '<button class="burger" aria-label="Menu"><span></span></button>' +
    '<nav class="nav">' +
    '<a href="#index">Index</a>' +
    NAV.map(([id, l]) => `<a href="#${id}" data-spy="${id}">${l}</a>`).join('') +
    '<a class="cta" href="#contact">Contact</a></nav></div>';
  document.body.prepend(header);
  const nav = header.querySelector('.nav');
  header.querySelector('.burger').addEventListener('click', () => nav.classList.toggle('open'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) nav.classList.remove('open'); });

  /* scroll-spy */
  const spyLinks = [...nav.querySelectorAll('[data-spy]')];
  const spy = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) spyLinks.forEach((a) => a.classList.toggle('on', a.dataset.spy === e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  NAV.forEach(([id]) => { const el = document.getElementById(id); if (el) spy.observe(el); });

  /* ---------- footer ---------- */
  const footer = document.createElement('footer');
  footer.className = 'site-footer simple';
  footer.innerHTML =
    '<div class="wrap"><div class="foot-row" style="border:0;padding:0"><span>© 2026 Dion Greenwood</span>' +
    '<nav><a href="#top">Back to top ↑</a><a href="assets/Dion_Greenwood_CV.pdf" target="_blank" rel="noopener">CV</a>' +
    `<a href="${IG}" target="_blank" rel="noopener">Instagram ↗</a></nav></div></div>`;
  document.body.append(footer);

  /* ---------- slash rows ---------- */
  document.querySelectorAll('.slashes').forEach((el) => (el.textContent = '/'.repeat(90)));

  /* ---------- marquee tickers (always scrolling sideways) ---------- */
  document.querySelectorAll('.ticker[data-items]').forEach((t) => {
    const items = t.dataset.items.split('|');
    const one = items.map((x, i) => `<span>${i % 2 ? '<b>' + x + '</b>' : x}</span><span class="dot">•</span>`).join('');
    t.innerHTML = `<div class="track">${one}${one}${one}${one}</div>`;
  });

  /* ---------- reveal ---------- */
  const rev = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); rev.unobserve(e.target); } }), { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach((el) => rev.observe(el));

  /* ---------- lazy-load + autoplay-in-view videos ---------- */
  // data-src is attached when a video is near the viewport, played when mostly visible,
  // and released again when far away so the page stays light.
  const loadIO = new IntersectionObserver((es) => es.forEach((e) => {
    const v = e.target;
    if (e.isIntersecting) {
      if (!v.getAttribute('src')) { v.src = v.dataset.src + '#t=' + (v.dataset.t || '0.3'); v.load(); }
    } else if (v.getAttribute('src')) {
      v.pause(); v.removeAttribute('src'); v.load();
    }
  }), { rootMargin: '900px 0px 900px 0px' });
  const playIO = new IntersectionObserver((es) => es.forEach((e) => {
    const v = e.target;
    if (e.isIntersecting) { const p = v.play(); if (p && p.catch) p.catch(() => {}); } else v.pause();
  }), { threshold: 0.55 });
  function watchVideos(root) {
    (root || document).querySelectorAll('video[data-src]').forEach((v) => {
      if (v.dataset.watched) return;
      v.dataset.watched = '1';
      v.muted = true; v.loop = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.preload = 'metadata';
      loadIO.observe(v); playIO.observe(v);
    });
  }
  watchVideos();

  /* ---------- lightbox ---------- */
  const lb = document.createElement('div');
  lb.className = 'lb';
  lb.innerHTML = '<button class="x" aria-label="Close">✕</button><div class="inner"></div>';
  document.body.append(lb);
  const inner = lb.querySelector('.inner');
  const closeLb = () => { lb.classList.remove('open'); inner.innerHTML = ''; document.body.style.overflow = ''; };
  lb.addEventListener('click', (e) => { if (e.target === lb || e.target.classList.contains('x')) closeLb(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLb(); });
  document.addEventListener('click', (e) => {
    if (e.target.closest('.feed')) return;
    const vEl = e.target.closest('[data-video]');
    const iEl = e.target.closest('[data-img]');
    if (vEl) inner.innerHTML = `<video src="${vEl.dataset.video}" controls autoplay playsinline loop></video>`;
    else if (iEl) inner.innerHTML = `<img src="${iEl.dataset.img}" alt="">`;
    else return;
    lb.classList.add('open'); document.body.style.overflow = 'hidden';
  });

  /* ---------- YouTube facade -> iframe on click ---------- */
  document.querySelectorAll('[data-yt]').forEach((box) => {
    box.querySelector('.facade').addEventListener('click', () => {
      const id = box.dataset.yt;
      box.innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0" title="YouTube video player" ` +
        'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ' +
        'referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>';
    });
  });

  /* ---------- phone feed with tabs ---------- */
  const feedBox = document.querySelector('[data-feed]');
  if (feedBox) {
    const SETS = {
      memes: [
        ['meme-badboy', 'Bad boy', 'trend audio · meme format'],
        ['meme-batman', 'Batman pit', 'reaction meme'],
        ['meme-drumstuck', 'Drum stuck', 'relatable band humour'],
        ['meme-scott', 'Scott × Samir', 'trend remix'],
        ['meme-stressed', 'Stressed', 'mood edit'],
      ],
      skits: [
        ['skit-intro', 'Alt intro', 'scripted · hook-first'],
        ['skit-glasses', 'Glasses meme', 'scripted · POV'],
        ['skit-fitcheck', 'Fit check', 'scripted · lifestyle'],
        ['skit-metaleast', 'Skit #2', 'scripted · comedy'],
        ['skit-riff', 'Off-course riff', 'scripted · music'],
        ['skit-soundcheck', 'Soundcheck', 'scripted · behind the scenes'],
      ],
    };
    const feed = feedBox.querySelector('.feed');
    const render = (key) => {
      feed.querySelectorAll('video').forEach((v) => { loadIO.unobserve(v); playIO.unobserve(v); });
      feed.innerHTML = SETS[key].map(([f, t, s]) =>
        `<div class="slide"><video data-src="assets/video/${f}.mp4" muted loop playsinline preload="none"></video>` +
        '<div style="position:absolute;inset:0;pointer-events:none;display:flex;flex-direction:column;justify-content:flex-end;padding:18px 14px 56px;background:linear-gradient(to top,rgba(0,0,0,.7),transparent 35%)">' +
        `<div style="font-size:14px;font-weight:700;max-width:70%">${t}<br><span style="font-weight:500;font-size:13px;opacity:.8">${s}</span></div></div></div>`).join('');
      feed.scrollTop = 0;
      watchVideos(feed);
    };
    render('memes');
    document.querySelectorAll('[data-feed-tab]').forEach((b) => b.addEventListener('click', () => {
      document.querySelectorAll('[data-feed-tab]').forEach((x) => x.classList.remove('on'));
      b.classList.add('on'); render(b.dataset.feedTab);
    }));
  }
})();
