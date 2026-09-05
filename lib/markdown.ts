import 'server-only';

/**
 * Minimal, dependency-free markdown → HTML renderer that runs on the SERVER
 * (React Server Component), so article bodies ship as HTML with zero client JS.
 *
 * Supports: h1–h4, bold, italic, inline code, links (external → rel="nofollow
 * sponsored"), plain images, clickable-image banners [![alt](img)](href),
 * blockquotes, bulleted and numbered lists, code fences, and paragraphs.
 */

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const SITE = 'https://www.jaysmoneyguides.com';

function inline(text: string): string {
  let t = esc(text);
  // inline images first (so links don't mangle them)
  t = t.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_m, alt, src) => {
    const safe = /^https?:\/\//i.test(src) || src.startsWith('/') ? src : '';
    return safe ? `<img src="${safe}" alt="${alt}" loading="lazy" class="inline-img" />` : '';
  });
  // links
  t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label, url) => {
    const safe = /^https?:\/\//i.test(url) || url.startsWith('/') || url.startsWith('#') ? url : '#';
    const external = /^https?:\/\//i.test(url) && !safe.startsWith(SITE);
    const attrs = external ? ' target="_blank" rel="nofollow sponsored noopener noreferrer"' : '';
    return `<a href="${safe}"${attrs}>${label}</a>`;
  });
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  t = t.replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>');
  t = t.replace(/`([^`]+)`/g, '<code>$1</code>');
  return t;
}

export function markdownToHtml(md: string): string {
  const blocks = md.split(/\r?\n\r?\n/);
  const out: string[] = [];

  for (const raw of blocks) {
    const block = raw.trim();
    if (!block) continue;

    // code fence
    if (block.startsWith('```')) {
      const body = block.replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, '');
      out.push(`<pre><code>${esc(body)}</code></pre>`);
      continue;
    }

    // clickable image / banner: [![alt](img)](href)
    const click = block.match(/^\[!\[([^\]]*)\]\(([^)\s]+)\)\]\(([^)\s]+)\)/);
    if (click) {
      const [, alt, img, href] = click;
      const safeImg = /^https?:\/\//i.test(img) || img.startsWith('/') ? img : '';
      const safeHref = /^https?:\/\//i.test(href) || href.startsWith('/') ? href : '#';
      const external = /^https?:\/\//i.test(href);
      const attrs = external ? ' target="_blank" rel="nofollow sponsored noopener noreferrer"' : '';
      if (safeImg) {
        out.push(
          `<a href="${safeHref}"${attrs} class="banner-link">` +
            `<img src="${safeImg}" alt="${alt}" loading="lazy" class="banner-img" />` +
          `</a>`
        );
        continue;
      }
    }

    // plain image
    const img = block.match(/^!\[([^\]]*)\]\(([^)\s]+)\)\s*$/);
    if (img) {
      const [, alt, src] = img;
      const safe = /^https?:\/\//i.test(src) || src.startsWith('/') ? src : '';
      if (safe) { out.push(`<img src="${safe}" alt="${alt}" loading="lazy" class="content-img" />`); continue; }
    }

    // headings
    const h = block.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      out.push(`<h${level}>${inline(h[2])}</h${level}>`);
      continue;
    }

    // blockquote
    if (block.startsWith('>')) {
      const inner = block.split('\n').map((l) => l.replace(/^>\s?/, '')).join(' ');
      out.push(`<blockquote>${inline(inner)}</blockquote>`);
      continue;
    }

    // unordered list
    if (/^[*-]\s+/.test(block)) {
      const items = block.split('\n').filter((l) => /^[*-]\s+/.test(l))
        .map((l) => `<li>${inline(l.replace(/^[*-]\s+/, ''))}</li>`).join('');
      out.push(`<ul>${items}</ul>`);
      continue;
    }

    // ordered list
    if (/^\d+\.\s+/.test(block)) {
      const items = block.split('\n').filter((l) => /^\d+\.\s+/.test(l))
        .map((l) => `<li>${inline(l.replace(/^\d+\.\s+/, ''))}</li>`).join('');
      out.push(`<ol>${items}</ol>`);
      continue;
    }

    // paragraph
    out.push(`<p>${inline(block)}</p>`);
  }

  return out.join('\n');
}
