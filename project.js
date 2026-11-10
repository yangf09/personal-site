/* ===== 项目详情页 ===== */

const key = new URLSearchParams(location.search).get('id');
const d = PROJECTS[key];
const detail = document.getElementById('detail');

if (!d) {
  detail.innerHTML =
    '<div class="detail-missing">' +
      '<p>未找到该项目</p>' +
      '<a class="detail-back" href="index.html#projects">← 返回项目列表</a>' +
    '</div>';
} else {
  render(d);
}

function render(d) {
  document.title = d.title + ' · 阳帆';
  const imgs = d.images || [];

  const points = (d.points && d.points.length)
    ? '<div class="d-section"><h4>项目亮点</h4><ul class="d-points">' + d.points.map(p => '<li>' + p + '</li>').join('') + '</ul></div>'
    : '';

  const subs = (d.sub && d.sub.length)
    ? '<div class="d-section"><h4>包含项目</h4><div class="d-subs">' +
        d.sub.map(s =>
          '<div class="d-sub">' +
            '<div class="d-sub-head"><h5>' + s.title + '</h5><span>' + s.tag + '</span></div>' +
            '<p>' + s.desc + '</p>' +
            (s.tools ? '<div class="modal-chips">' + s.tools.map(t => '<span>' + t + '</span>').join('') + '</div>' : '') +
          '</div>').join('') +
      '</div></div>'
    : '';

  const tools = (d.tools && d.tools.length)
    ? '<div class="d-section"><h4>技术 / 方法</h4><div class="modal-chips">' + d.tools.map(t => '<span>' + t + '</span>').join('') + '</div></div>'
    : '';

  const gallery = imgs.length
    ? '<div class="d-section"><h4>作品展示</h4><div class="detail-gallery">' +
        '<div class="gallery-main">' +
          '<img id="galleryMain" src="' + imgs[0] + '" alt="' + d.title + '">' +
          '<button class="gallery-nav prev" id="gPrev" aria-label="上一张">‹</button>' +
          '<button class="gallery-nav next" id="gNext" aria-label="下一张">›</button>' +
          '<div class="gallery-counter" id="gCounter">1 / ' + imgs.length + '</div>' +
        '</div>' +
        '<div class="gallery-thumbs" id="galleryThumbs">' +
          imgs.map((s, i) => '<img class="thumb' + (i === 0 ? ' active' : '') + '" src="' + s + '" data-i="' + i + '" alt="">').join('') +
        '</div>' +
      '</div></div>'
    : '';

  detail.innerHTML =
    '<header class="detail-hero">' +
      '<p class="detail-tag">' + d.tag + '</p>' +
      '<h1 class="detail-title">' + d.title + '</h1>' +
      '<div class="detail-desc">' + d.desc.map(p => '<p>' + p + '</p>').join('') + '</div>' +
    '</header>' +
    (imgs.length ? '<figure class="detail-cover"><img src="' + imgs[0] + '" alt="' + d.title + '"></figure>' : '') +
    points + subs + gallery + tools +
    '<a class="detail-back" href="index.html#projects">← 返回所有项目</a>';

  // 抽卡式入场动画
  requestAnimationFrame(() => detail.classList.add('enter'));

  if (imgs.length) initGallery(imgs);
}

/* 大图画廊交互 */
function initGallery(imgs) {
  const main = document.getElementById('galleryMain');
  const counter = document.getElementById('gCounter');
  const thumbs = Array.from(document.getElementById('galleryThumbs').querySelectorAll('.thumb'));
  let idx = 0;

  function go(i) {
    idx = (i + imgs.length) % imgs.length;
    main.src = imgs[idx];
    counter.textContent = (idx + 1) + ' / ' + imgs.length;
    thumbs.forEach(t => t.classList.toggle('active', +t.dataset.i === idx));
  }

  document.getElementById('gPrev').addEventListener('click', () => go(idx - 1));
  document.getElementById('gNext').addEventListener('click', () => go(idx + 1));
  thumbs.forEach(t => t.addEventListener('click', () => go(+t.dataset.i)));
  main.addEventListener('click', () => lightbox.open(imgs, idx));
}
