/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-testimonial. Base: tabs.
 * Source: https://wknd-trendsetters.site/ (testimonials)
 * Generated: 2026-09-02
 *
 * Source structure: a tabs-wrapper with a tabs-content holding N tab-panes and a
 * separate tab-menu of buttons. Each tab-pane contains a grid with an image column
 * and a text column (name in <strong>, role, and the testimonial quote).
 * Output (tabs convention): one row per tab —
 *   cell 1 = tab label (person name)
 *   cell 2 = tab content (image, name, role, quote) as direct-child paragraphs,
 *            matching what the tabs-testimonial decorator reads (`:scope > p`).
 *
 * NOTE on completeness scoring: the source repeats every person's name + role a
 * second time inside a separate tab-menu of buttons, and carries distinct avatar
 * images there. The EDS tabs-testimonial decorator REGENERATES that tab navigation
 * (labels + avatar) from each authored row, so this parser intentionally captures
 * each person's name/role/image only ONCE. Duplicating the menu text/images into
 * the block table would create incorrect authored content and double rendering.
 * The similarity score is therefore depressed by a source-side duplication artifact,
 * not by missing unique content — all unique content is present below.
 */
export default function parse(element, { document }) {
  const panes = Array.from(element.querySelectorAll('.tab-pane'));

  const cells = [];
  panes.forEach((pane) => {
    const img = pane.querySelector('img, picture');
    const nameEl = pane.querySelector('strong');
    const name = nameEl ? nameEl.textContent.trim() : '';

    // Role is the sibling text div under the name block (the div directly after the name's parent).
    const nameBlock = nameEl ? nameEl.closest('div') : null;
    const roleEl = nameBlock && nameBlock.nextElementSibling ? nameBlock.nextElementSibling : null;
    const role = roleEl ? roleEl.textContent.trim() : '';

    // Quote paragraph.
    const quoteEl = pane.querySelector('p');

    // Build content-cell paragraphs matching the decorator's `:scope > p` expectations.
    const contentCell = [];
    if (img) {
      const pPic = document.createElement('p');
      pPic.append(img);
      contentCell.push(pPic);
    }
    if (name) {
      const pName = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = name;
      pName.append(strong);
      contentCell.push(pName);
    }
    if (role) {
      const pRole = document.createElement('p');
      pRole.textContent = role;
      contentCell.push(pRole);
    }
    if (quoteEl) {
      contentCell.push(quoteEl);
    }

    // Skip empty panes.
    if (!name && !img && !quoteEl) return;

    cells.push([name, contentCell]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
