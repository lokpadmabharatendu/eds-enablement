/* eslint-disable */
/* global WebImporter */
/**
 * Parser for accordion-faq. Base: accordion.
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-09-01
 *
 * Structure (from library-description.txt): Accordion block — 2 columns, first row
 * block name, each subsequent row is an item: title cell + content cell.
 * Source items are <details class="faq-item"> with a <summary> (question, with a
 * decorative icon) and a <div class="faq-answer"> (answer body).
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll(':scope > details.faq-item, details.faq-item, .faq-item'));

  const cells = [];
  items.forEach((item) => {
    // Title: text of the summary's label span (excludes the decorative +/- icon img)
    const summary = item.querySelector('summary, .faq-question');
    let title = '';
    if (summary) {
      const label = summary.querySelector('span');
      title = label ? label.textContent.trim() : summary.textContent.trim();
    }

    // Content: the answer body
    const answer = item.querySelector('.faq-answer');
    const contentCell = answer ? Array.from(answer.childNodes) : [];

    if (!title && !contentCell.length) return;
    cells.push([title, contentCell]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
