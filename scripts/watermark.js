const WATERMARK_ID = 'ue-watermark';

/**
 * 是否处于 Universal Editor 的画布 iframe 中
 */
function isInUniversalEditor() {
  // 编辑环境下页面带有 UE 埋点（xwalk 作者端渲染）
  if (document.querySelector('[data-aue-resource]')) return true;

  // 兜底：在 iframe 中，且父窗口来自 Experience Cloud（Firefox 不支持 ancestorOrigins）
  try {
    if (window.self === window.top) return false;
    const origins = window.location.ancestorOrigins;
    return !!origins && Array.from(origins).some((o) => o.includes('experience.adobe.com'));
  } catch (e) {
    return false;
  }
}

function buildTile(text) {
  const safe = text.replace(/[<>&"']/g, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200">
    <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle"
      transform="rotate(-25 160 100)" font-size="20" font-family="sans-serif"
      fill="rgba(0,0,0,0.12)">${safe}</text></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

export default function initWatermark(text = '内部预览 · 请勿外传') {
  if (!isInUniversalEditor()) return;
  if (document.getElementById(WATERMARK_ID)) return;

  const el = document.createElement('div');
  el.id = WATERMARK_ID;
  el.setAttribute('aria-hidden', 'true');
  Object.assign(el.style, {
    position: 'fixed',
    inset: '0',
    zIndex: '2147483647',
    pointerEvents: 'none', // 不影响 UE 的选中、拖拽、点击
    backgroundImage: buildTile(text),
    backgroundRepeat: 'repeat',
  });
  document.body.append(el);
}
