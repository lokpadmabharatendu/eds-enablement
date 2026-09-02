/* eslint-disable */
/* global WebImporter */
/**
 * Parser for banner-cta. Base: banner (custom variant — inferred from source HTML,
 * base "banner" not present in the block library catalog).
 * Source: https://wknd-trendsetters.site/ (CTA banner)
 * Generated: 2026-09-02
 *
 * Source structure: a grid-layout with a relative-positioned card containing a
 * full-bleed cover image overlay and a card-body with an h2 heading, a subheading
 * paragraph, and a button-group CTA.
 * Output: 1 column, two rows (matches the banner-cta decorator's expected structure) —
 *   row 1 = decorative image cell
 *   row 2 = content cell: heading + paragraph + CTA link.
 */
export default function parse(element, { document }) {
  const image = element.querySelector('img, picture');

  const heading = element.querySelector('h1, h2, h3, .h1-heading, [class*="heading"]');
  const description = element.querySelector('.subheading, p');
  const ctaLinks = Array.from(element.querySelectorAll('.button-group a, a.button'));

  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  contentCell.push(...ctaLinks);

  // Empty-block guard.
  if (!image && !contentCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  // Row 1: decorative image (single cell). Only add if present.
  if (image) cells.push([image]);
  // Row 2: content (single cell holding heading, paragraph, CTA).
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'banner-cta', cells });
  element.replaceWith(block);
}
