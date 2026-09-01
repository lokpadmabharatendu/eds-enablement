/* eslint-disable */
/* global WebImporter */
/**
 * Parser for banner-cta. Base: banner (custom — no library convention available).
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-09-01
 *
 * Structure inferred from source HTML: a single-column banner (grid-layout
 * desktop-1-column). One image acts as the background/overlay, with a text overlay
 * containing a heading, subheading, and a CTA button. Modeled as a 1-column block:
 *   Row: background image
 *   Row: content cell (heading, subheading, CTA)
 */
export default function parse(element, { document }) {
  const bgImage = element.querySelector('img');
  const heading = element.querySelector('h1, h2, h3, [class*="heading"]');
  const subheading = element.querySelector('p, .subheading');
  const buttons = Array.from(element.querySelectorAll('a.button, .button-group a'));

  if (!heading && !subheading && !buttons.length && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 1: background image (optional)
  if (bgImage) cells.push([bgImage]);

  // Row 2: overlay content (single cell holding all text + CTA)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...buttons);
  if (contentCell.length) cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'banner-cta', cells });
  element.replaceWith(block);
}
