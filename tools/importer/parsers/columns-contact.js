/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-contact.
 * Base block: columns.
 * Source: WKND Trendsetters — faq-page template ("Let's connect" contact section).
 * Generated: 2026-09-02
 *
 * Structure (from library-description.txt + decorator):
 *   Single content row with 2 columns.
 *   - Column 1 (content): H2 heading + intro paragraph.
 *   - Column 2 (details): flat sequence of label heading (H3) + value
 *     (mailto: link, tel: link, or plain paragraph). The block decorator
 *     scans this column's direct children for heading labels and groups each
 *     label with the value(s) that follow it, so values are emitted flat.
 */
export default function parse(element, { document }) {
  // Two top-level columns of the grid layout.
  const columns = element.querySelectorAll(':scope > div');
  const contentCol = columns[0] || null;
  const detailsCol = columns[1] || null;

  // --- Column 1: content ---
  const contentCell = [];
  if (contentCol) {
    const heading = contentCol.querySelector('h1, h2, h3, [class*="heading"]');
    const intro = contentCol.querySelector('p');
    if (heading) contentCell.push(heading);
    if (intro) contentCell.push(intro);
  }

  // --- Column 2: contact details (flattened label + value sequence) ---
  const detailsCell = [];
  if (detailsCol) {
    // Contact groups may be wrapped (e.g. in .contact-items). Locate the
    // group elements holding a label heading + a value.
    const groups = detailsCol.querySelectorAll(
      '.contact-items > div, :scope > .contact-items > div, :scope > div > div',
    );
    const groupList = groups.length
      ? Array.from(groups)
      : Array.from(detailsCol.children);

    groupList.forEach((group) => {
      const label = group.querySelector('h1, h2, h3, h4, h5, h6');
      // value can be a mailto/tel link or a plain paragraph
      const value = group.querySelector(
        'a[href^="mailto:"], a[href^="tel:"], a, p',
      );
      if (label) detailsCell.push(label);
      if (value) detailsCell.push(value);
    });

    // Fallback: if the wrapper heuristics found nothing, pull all headings
    // and values directly.
    if (detailsCell.length === 0) {
      detailsCol
        .querySelectorAll('h1, h2, h3, h4, h5, h6, a[href^="mailto:"], a[href^="tel:"], p')
        .forEach((el) => detailsCell.push(el));
    }
  }

  // Empty-block guard.
  if (contentCell.length === 0 && detailsCell.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [[contentCell, detailsCell]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-contact', cells });
  element.replaceWith(block);
}
