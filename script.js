/* ===== 首页交互 ===== */

/* 首屏打字机 */
(function typewriter() {
  const el = document.getElementById('typewriter');
  const phrases = [
    '交互设计硕士研究生',
    '文化遗产数字化 × 智能生成',
    '生成式 AI 设计实践者',
    '让传统文化在数字时代焕发新生'
  ];
  let pi = 0, ci = 0, deleting = false;

  function tick() {
    const cur = phrases[pi];
    ci += deleting ? -1 : 1;
    el.textContent = cur.slice(0, ci);

    let delay = deleting ? 45 : 90;
    if (!deleting && ci === cur.length) { delay = 1800; deleting = true; }
    else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 400; }
    setTimeout(tick, delay);
  }
  tick();
})();

/* 渲染研究经历（时间线，不点击） */
(function renderResearch() {
  const wrap = document.getElementById('researchTimeline');
  wrap.innerHTML = RESEARCH.map(r =>
    '<div class="timeline-item reveal">' +
      '<span class="timeline-dot"></span>' +
      '<span class="timeline-date">' + r.tag + '</span>' +
      '<h3>' + r.title + '</h3>' +
      '<p class="timeline-desc">' + r.desc + '</p>' +
      '<div class="card-chips">' + (r.chips || []).map(c => '<span>' + c + '</span>').join('') + '</div>' +
    '</div>'
  ).join('');
})();

/* 渲染设计项目（抽卡翻转 → 跳转详情页） */
(function renderProjects() {
  const wrap = document.getElementById('projectCards');
  wrap.innerHTML = PROJECT_ORDER.map(key => {
    const d = PROJECTS[key];
    const chips = (d.tools || []).map(t => '<span>' + t + '</span>').join('');
    const n = (d.images || []).length;
    return '<article class="card project-card reveal" data-project="' + key + '">' +
      '<div class="card-inner">' +
        '<div class="card-face card-front">' +
          '<span class="card-tag">' + d.tag + '</span>' +
          '<h3>' + d.title + '</h3>' +
          '<p>' + (d.desc[0] || '') + '</p>' +
          '<div class="card-chips">' + chips + '</div>' +
          '<span class="card-hint">点击查看详情 →</span>' +
        '</div>' +
        '<div class="card-face card-back">' +
          '<span class="card-back-icon">✦</span>' +
          '<h3>' + d.title + '</h3>' +
          '<span class="card-back-sub">' + n + ' 张作品 · 正在打开</span>' +
        '</div>' +
      '</div>' +
    '</article>';
  }).join('');

  wrap.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      if (card.classList.contains('flip')) return;
      card.classList.add('flip');
      const key = card.dataset.project;
      setTimeout(() => { window.location.href = 'project.html?id=' + key; }, 720);
    });
  });
})();

/* 渲染获奖列表 */
(function renderAwards() {
  const list = document.getElementById('awardList');
  list.innerHTML = AWARDS.map((a, i) =>
    '<div class="award" data-award="' + i + '" title="点击查看证书">' +
      '<span class="award-name">' + a.name + '</span>' +
      '<span class="award-level">' + (a.level || '') +
        '<span class="award-cert">查看证书' + (a.certs.length > 1 ? ' ×' + a.certs.length : '') + ' →</span>' +
      '</span>' +
    '</div>'
  ).join('');

  list.addEventListener('click', e => {
    const item = e.target.closest('.award');
    if (!item) return;
    lightbox.open(AWARDS[+item.dataset.award].certs, 0);
  });
})();

/* 滚动显现（放在所有渲染之后，涵盖动态内容） */
(function reveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();
