/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-article. Base: columns.
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-09-01
 *
 * Structure (from library-description.txt): Columns block — first row block name,
 * subsequent rows have one cell per visual column. This article intro is 2 columns:
 *   Column 1: cover image
 *   Column 2: breadcrumbs, heading, byline/meta
 */
export default function parse(element, { document }) {
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  if (columns.length < 2) {
    // Fall back: keep whatever direct children exist as separate columns
    if (!columns.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
  }

  // Each direct child div is a visual column; keep its content intact.
  const row = columns.map((col) => Array.from(col.childNodes));

  if (!row.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [row];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-article', cells });
  element.replaceWith(block);
}
