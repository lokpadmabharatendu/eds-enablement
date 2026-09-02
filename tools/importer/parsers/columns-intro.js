/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-intro. Base: columns.
 * Source: https://wknd-trendsetters.site/ (landing-page hero intro)
 * Generated: 2026-09-02
 *
 * Source structure: a grid-layout with two direct child columns —
 *   1. content column: h1 heading, subheading paragraph, button-group with CTA links
 *   2. image column: a stack of cover images
 * Output: single row, two columns [contentCell, imageCell] per the columns block convention.
 */
export default function parse(element, { document }) {
  // The block is a grid-layout whose direct children are the columns.
  const grid = element.querySelector(':scope > .grid-layout') || element;
  let cols = Array.from(grid.querySelectorAll(':scope > div'));
  // Fallback: if no wrapper grid found, use direct children of element.
  if (!cols.length) cols = Array.from(element.querySelectorAll(':scope > div'));

  // Content column: heading + paragraph + CTA links (flattened, buttons out of the group wrapper).
  const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');
  const description = element.querySelector('.subheading, p');
  const ctaLinks = Array.from(element.querySelectorAll('.button-group a, a.button'));

  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  contentCell.push(...ctaLinks);

  // Image column: every image in the block that is not part of the content column.
  const images = Array.from(element.querySelectorAll('img'));
  const imageCell = images.length ? images : [];

  // Empty-block guard.
  if (!contentCell.length && !imageCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  cells.push([contentCell, imageCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-intro', cells });
  element.replaceWith(block);
}
