/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-intro. Base: columns.
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-09-01
 *
 * Structure (from library-description.txt): Columns block — first row block name,
 * subsequent rows have one cell per visual column. This intro is 2 columns:
 *   Column 1: heading + subheading + button group
 *   Column 2: stacked cover images
 */
export default function parse(element, { document }) {
  // Direct children of the grid are the visual columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Text column: heading, subheading, buttons
  const heading = element.querySelector('h1, h2, [class*="heading"]');
  const subheading = element.querySelector('p, .subheading');
  const buttons = Array.from(element.querySelectorAll('a.button, .button-group a'));

  const textCell = [];
  if (heading) textCell.push(heading);
  if (subheading) textCell.push(subheading);
  textCell.push(...buttons);

  // Image column: all cover images
  const images = Array.from(element.querySelectorAll('img'));

  if (!textCell.length && !images.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  cells.push([textCell, images]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-intro', cells });
  element.replaceWith(block);
}
