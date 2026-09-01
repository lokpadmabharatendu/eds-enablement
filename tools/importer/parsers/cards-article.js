/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base: cards.
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-09-01
 *
 * Structure (from library-description.txt): Cards block — 2 columns, first row block
 * name, each subsequent row is a card: image in cell 1, text content in cell 2.
 * Each source card is an <a class="article-card"> with an image and a body
 * (tag, date, heading). The card link wraps the heading text.
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll(':scope > a.article-card, :scope > a.card-link, :scope > a'));

  const cells = [];
  cards.forEach((card) => {
    const img = card.querySelector('img');

    // Text content cell: meta (tag + date) and heading, made clickable via card href
    const textCell = [];
    const meta = card.querySelector('.article-card-meta');
    const heading = card.querySelector('h1, h2, h3, h4, h5, h6, [class*="heading"]');

    if (meta) textCell.push(meta);

    const href = card.getAttribute('href');
    if (heading) {
      if (href) {
        const link = document.createElement('a');
        link.setAttribute('href', href);
        link.append(heading.textContent.trim());
        const wrap = document.createElement('h3');
        wrap.append(link);
        textCell.push(wrap);
      } else {
        textCell.push(heading);
      }
    }

    if (!img && !textCell.length) return;
    cells.push([img || '', textCell]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
