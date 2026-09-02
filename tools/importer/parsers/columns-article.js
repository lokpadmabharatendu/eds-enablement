/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-article. Base: columns.
 * Source: https://wknd-trendsetters.site/fashion-trends-of-the-season (featured article)
 * Generated: 2026-09-02
 *
 * Source structure: grid-layout with two direct child columns —
 *   1. image column: a single cover image
 *   2. content column: breadcrumbs, h2 heading, author + date/read-time meta
 * Output: single row, two columns [imageCell, contentCell] per columns convention.
 */
export default function parse(element, { document }) {
  // The grid-layout may be nested inside the section; find it as a descendant.
  const grid = element.querySelector('.grid-layout') || element;
  let cols = Array.from(grid.querySelectorAll(':scope > div'));
  if (cols.length < 2) cols = Array.from(element.querySelectorAll(':scope > div'));

  // Identify the image column (the column whose content is a picture/image).
  const imageCol = cols.find((c) => c.querySelector('img, picture'));
  // Content column: the remaining column with breadcrumbs/heading/meta.
  const contentCol = cols.find((c) => c !== imageCol && (c.querySelector('h1, h2, h3') || c.querySelector('.breadcrumbs')));

  const imageCell = imageCol || element.querySelector('img, picture') || '';
  const contentCell = contentCol || '';

  // Empty-block guard.
  if (!imageCol && !contentCol) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  cells.push([imageCell, contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-article', cells });
  element.replaceWith(block);
}
