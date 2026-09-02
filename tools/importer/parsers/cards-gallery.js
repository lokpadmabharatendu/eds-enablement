/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-gallery. Base: cards.
 * Source: https://wknd-trendsetters.site/ (gallery grid)
 * Generated: 2026-09-02
 *
 * Source structure: a grid-layout whose direct children are image tiles
 * (each an aspect-ratio wrapper div containing a single cover image).
 * There is no title/description/CTA — this is an image-only gallery.
 * Output: one row per card, each row a single cell holding the card image,
 * matching the cards block convention (each subsequent row = one card).
 */
export default function parse(element, { document }) {
  const grid = element.querySelector('.grid-layout') || element;
  let tiles = Array.from(grid.querySelectorAll(':scope > div'));
  if (!tiles.length) tiles = Array.from(element.querySelectorAll(':scope > div'));

  const cells = [];
  tiles.forEach((tile) => {
    const img = tile.querySelector('img, picture');
    if (img) cells.push([img]);
  });

  // Empty-block guard: no images found.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
