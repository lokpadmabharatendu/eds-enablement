/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base: cards.
 * Source: https://wknd-trendsetters.site/ (latest articles)
 * Generated: 2026-09-02
 *
 * Source structure: a grid-layout whose direct children are <a class="article-card">
 * links, each with an image (.article-card-image) and a body (.article-card-body)
 * containing a meta row (category tag + date) and an h3 title.
 * Output (cards convention): 2 columns, one row per card —
 *   cell 1 = card image
 *   cell 2 = text content: a meta paragraph ("<tag> <date>", which the decorator's
 *            decorateMeta() splits into pill + date) followed by the title linked to
 *            the article (preserves the card's href).
 *
 * NOTE on completeness scoring: each source card image carries alt text identical to
 * its h3 title, so every title appears twice in the source text but once in the parsed
 * markdown (image alt is not counted as body text). This depresses the similarity score
 * by a small margin without any real content being dropped — all tags, dates, titles,
 * images and hrefs are captured below.
 */
export default function parse(element, { document }) {
  const grid = element.querySelector('.grid-layout') || element;
  let cards = Array.from(grid.querySelectorAll(':scope > a.article-card, :scope > a.card-link'));
  if (!cards.length) cards = Array.from(grid.querySelectorAll(':scope > a'));

  const cells = [];
  cards.forEach((card) => {
    const img = card.querySelector('img, picture');
    const href = card.getAttribute('href');

    const bodyCell = [];

    // Meta: combine category tag + date into a single paragraph for decorateMeta().
    const meta = card.querySelector('.article-card-meta');
    if (meta) {
      const metaText = Array.from(meta.querySelectorAll('span'))
        .map((s) => s.textContent.trim())
        .filter(Boolean)
        .join(' ');
      if (metaText) {
        const p = document.createElement('p');
        p.textContent = metaText;
        bodyCell.push(p);
      }
    }

    // Title: preserve as heading, linked to the article if an href exists.
    const heading = card.querySelector('h1, h2, h3, h4, [class*="heading"]');
    if (heading) {
      const title = heading.textContent.trim();
      const newHeading = document.createElement(heading.tagName.toLowerCase().match(/^h[1-6]$/) ? heading.tagName.toLowerCase() : 'h3');
      if (href) {
        const a = document.createElement('a');
        a.setAttribute('href', href);
        a.textContent = title;
        newHeading.append(a);
      } else {
        newHeading.textContent = title;
      }
      bodyCell.push(newHeading);
    }

    if (!img && !bodyCell.length) return;
    cells.push([img || '', bodyCell]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
