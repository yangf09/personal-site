/* ===== 通用：粒子背景 / 光标 / 导航 / 灯箱 ===== */

/* 粒子背景 */
(function particles() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let w, h, pts = [];
  const N = 70;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < N; i++) {
    pts.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - .5) * .35,
      vy: (Math.random() - .5) * .35,
      r: Math.random() * 1.8 + .6,
      c: ['#e080a0', '#8060c0', '#6060c0'][i % 3]
    });
  }

  function step() {
    ctx.clearRect(0, 0, w, h);
    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c;
      ctx.globalAlpha = .55;
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = 'rgba(128, 96, 192, ' + (1 - d / 120) * .22 + ')';
          ctx.lineWidth = .6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(step);
  }
  step();
})();

/* 自定义光标 */
(function cursor() {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });

  (function loop() {
    rx += (mx - rx) * .16;
    ry += (my - ry) * .16;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(loop);
  })();

  const HOVER = 'a, button, .skill-group, .project-card, .thumb';
  document.addEventListener('mouseover', e => { if (e.target.closest(HOVER)) ring.classList.add('hover'); });
  document.addEventListener('mouseout', e => { if (e.target.closest(HOVER)) ring.classList.remove('hover'); });
})();

/* 导航滚动态 */
(function nav() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40));
})();

/* 图片灯箱（作品集 / 证书查看） */
const lightbox = (function () {
  const el = document.getElementById('lightbox');
  const stage = document.getElementById('lightboxStage');
  const prevBtn = document.getElementById('lbPrev');
  const nextBtn = document.getElementById('lbNext');
  let imgs = [], idx = 0;

  function show() {
    const src = imgs[idx];
    stage.innerHTML = /\.pdf$/i.test(src)
      ? '<iframe src="' + src + '" title="证书"></iframe>'
      : '<img src="' + src + '" alt="">';
    const multi = imgs.length > 1;
    prevBtn.style.display = multi ? '' : 'none';
    nextBtn.style.display = multi ? '' : 'none';
  }

  return {
    open(list, i) {
      imgs = list; idx = Math.max(0, i || 0);
      show();
      el.classList.add('open');
      el.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    },
    close() {
      el.classList.remove('open');
      el.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      stage.innerHTML = '';
    },
    prev() { if (imgs.length > 1) { idx = (idx - 1 + imgs.length) % imgs.length; show(); } },
    next() { if (imgs.length > 1) { idx = (idx + 1) % imgs.length; show(); } }
  };
})();

document.getElementById('lbPrev').addEventListener('click', lightbox.prev);
document.getElementById('lbNext').addEventListener('click', lightbox.next);
document.querySelectorAll('[data-lightbox-close]').forEach(el => el.addEventListener('click', lightbox.close));
document.addEventListener('keydown', e => {
  if (!document.getElementById('lightbox').classList.contains('open')) return;
  if (e.key === 'Escape') lightbox.close();
  else if (e.key === 'ArrowLeft') lightbox.prev();
  else if (e.key === 'ArrowRight') lightbox.next();
});
