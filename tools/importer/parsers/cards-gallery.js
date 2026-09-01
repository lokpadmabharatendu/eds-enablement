/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-gallery. Base: cards.
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-09-01
 *
 * Structure (from library-description.txt): Cards block — 2 columns, first row is
 * block name, each subsequent row is a card: image in cell 1, text content in cell 2.
 * This gallery has image-only cards, so cell 2 is empty (padded) to keep rows even.
 */
export default function parse(element, { document }) {
  // Each direct child div is a card wrapper holding a cover image
  const cardWrappers = Array.from(element.querySelectorAll(':scope > div'));

  const cells = [];
  cardWrappers.forEach((wrapper) => {
    const img = wrapper.querySelector('img');
    if (!img) return;
    // Cell 1: image (mandatory). Cell 2: text content (empty for gallery cards).
    cells.push([img, '']);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
