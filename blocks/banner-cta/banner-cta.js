/**
 * Loads and decorates the banner-cta block.
 *
 * Authored structure (from .plain.html) is two rows, each a single cell:
 *   row 1: | background image |
 *   row 2: | heading + paragraph + CTA |
 *
 * The source design renders as a full-bleed rounded photo card with a
 * bottom-up dark gradient overlay and white heading / paragraph / pill button
 * anchored to the lower-left. We rebuild that structure here: the image
 * becomes an absolutely-positioned cover, a gradient overlay sits on top, and
 * the copy sits in a relatively-positioned content box above both.
 *
 * @param {Element} block The banner-cta block element
 */
export default function decorate(block) {
  // Locate the background image and the copy cell.
  let picture = null;
  let contentCell = null;
  [...block.children].forEach((row) => {
    const cell = row.querySelector(':scope > div') || row;
    const pic = cell.querySelector('picture');
    if (pic && !cell.querySelector('h1, h2, h3, h4, h5, h6, p:not(:has(picture))')) {
      picture = pic;
    }
    if (cell.querySelector('h1, h2, h3, h4, h5, h6') || cell.querySelector('p > a[href]')) {
      contentCell = cell;
    }
  });

  const card = document.createElement('div');
  card.className = 'banner-cta-card';

  // Background image (cover).
  if (picture) {
    const imgWrap = document.createElement('div');
    imgWrap.className = 'banner-cta-image';
    imgWrap.append(picture);
    card.append(imgWrap);
  }

  // Gradient overlay.
  const overlay = document.createElement('div');
  overlay.className = 'banner-cta-overlay';
  card.append(overlay);

  // Copy.
  const content = document.createElement('div');
  content.className = 'banner-cta-content';
  if (contentCell) {
    while (contentCell.firstChild) content.append(contentCell.firstChild);
  }

  // Promote the plain CTA link to a pill button.
  const cta = content.querySelector('p > a[href]');
  if (cta && cta.parentElement.textContent.trim() === cta.textContent.trim()) {
    cta.classList.add('button');
    cta.parentElement.classList.add('button-container');
  }

  card.append(content);
  block.replaceChildren(card);
}
