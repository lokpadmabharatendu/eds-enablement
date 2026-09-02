/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-feature. Base: columns.
 * Source: https://wknd-trendsetters.site/fashion-trends-young-adults-casual-sport
 * Generated: 2026-09-02
 *
 * 2-column feature: column 1 = image, column 2 = heading + lead paragraph + CTA button.
 * Produces a single content row with two cells following the columns block structure.
 */
export default function parse(element, { document }) {
  // Direct child columns of the grid-layout wrapper.
  const columns = element.querySelectorAll(':scope > div');

  // Column 1: the image (prefer <picture>, fall back to raw <img>).
  const imageCol = columns[0] || element;
  const image = imageCol.querySelector('picture, img');

  // Column 2: heading, lead paragraph, and CTA button(s).
  const textCol = columns[1] || element;
  const heading = textCol.querySelector('h1, h2, h3, [class*="heading"]');
  const paragraph = textCol.querySelector('p, [class*="paragraph"]');
  const ctaLinks = Array.from(textCol.querySelectorAll('a.button, .button-group a, a'));

  // Empty-block guard: bail gracefully if essential content is missing.
  if (!image && !heading && !paragraph) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Left cell: image content.
  const leftCell = [];
  if (image) leftCell.push(image);

  // Right cell: heading, paragraph, and CTA(s).
  const rightCell = [];
  if (heading) rightCell.push(heading);
  if (paragraph) rightCell.push(paragraph);
  rightCell.push(...ctaLinks);

  const cells = [];
  cells.push([leftCell, rightCell]); // one row, two columns

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
