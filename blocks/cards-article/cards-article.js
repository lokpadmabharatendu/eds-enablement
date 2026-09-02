import { createOptimizedPicture } from '../../scripts/aem.js';

const MONTHS = '(Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|Jun(e)?|Jul(y)?|Aug(ust)?|Sep(t)?(ember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?)';

/**
 * Split a meta paragraph like "Casual Cool May 12" into
 * a category pill (everything before the date) and a date span.
 * Falls back gracefully if no date pattern is found.
 */
function decorateMeta(p) {
  const text = p.textContent.trim();
  const match = text.match(new RegExp(`\\s+(${MONTHS}\\b.*)$`, 'i'));

  const meta = document.createElement('div');
  meta.className = 'cards-article-card-meta';

  if (match && match.index > 0) {
    const category = text.slice(0, match.index).trim();
    const date = match[1].trim();
    const tag = document.createElement('span');
    tag.className = 'cards-article-tag';
    tag.textContent = category;
    const dateEl = document.createElement('span');
    dateEl.className = 'cards-article-date';
    dateEl.textContent = date;
    meta.append(tag, dateEl);
  } else {
    const tag = document.createElement('span');
    tag.className = 'cards-article-tag';
    tag.textContent = text;
    meta.append(tag);
  }

  p.replaceWith(meta);
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-article-card-image';
      else div.className = 'cards-article-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });
  ul.querySelectorAll('.cards-article-card-body > p').forEach(decorateMeta);
  block.textContent = '';
  block.append(ul);
}
