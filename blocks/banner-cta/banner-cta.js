/**
 * Loads and decorates the banner-cta block.
 *
 * Authored structure (from .plain.html) is two rows, each a single cell:
 *   row 1: | decorative image |
 *   row 2: | heading + paragraph + CTA |
 *
 * The source design renders as a plain full-bleed black section with
 * left-aligned white content — the image is not shown — so we drop the
 * decorative image and keep only the text/CTA content.
 *
 * @param {Element} block The banner-cta block element
 */
export default function decorate(block) {
  // Find the cell that holds the actual copy (heading / paragraph / link).
  let contentCell = null;
  [...block.children].forEach((row) => {
    const cell = row.querySelector(':scope > div') || row;
    if (cell.querySelector('h1, h2, h3, h4, h5, h6, p, a')) {
      contentCell = cell;
    }
  });

  const content = document.createElement('div');
  content.className = 'banner-cta-content';
  if (contentCell) {
    while (contentCell.firstChild) content.append(contentCell.firstChild);
  }

  // The source CTA renders as a pill button. The project's global button
  // decoration only fires for links wrapped in <strong>/<em>, so promote the
  // plain CTA link here.
  const cta = content.querySelector('p > a[href]');
  if (cta && cta.parentElement.textContent.trim() === cta.textContent.trim()) {
    cta.classList.add('button');
    cta.parentElement.classList.add('button-container');
  }

  block.replaceChildren(content);
}
