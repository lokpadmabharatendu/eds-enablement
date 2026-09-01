/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-testimonial. Base: tabs.
 * Source: https://wknd-trendsetters.site/about-us
 * Generated: 2026-09-01
 *
 * Structure (from library-description.txt): Tabs block — 2 columns, first row block
 * name, each subsequent row is a tab: label in cell 1, content in cell 2.
 * Source has a tab-menu (buttons = labels) and tabs-content (panes = content),
 * paired by order. Each label uses the person's name; each content pane holds the
 * testimonial (image, name, role, quote).
 */
export default function parse(element, { document }) {
  const panes = Array.from(element.querySelectorAll('.tabs-content .tab-pane, .tab-pane'));
  const menuButtons = Array.from(element.querySelectorAll('.tab-menu .tab-menu-link, .tab-menu-link, button.tab-menu-link'));

  const cells = [];
  const count = Math.max(panes.length, menuButtons.length);

  for (let i = 0; i < count; i += 1) {
    const button = menuButtons[i];
    const pane = panes[i];

    // Label: prefer the strong (name) inside the menu button; fall back to button text
    let label = '';
    if (button) {
      const name = button.querySelector('strong');
      label = name ? name.textContent.trim() : button.textContent.trim();
    }

    // Content: the inner content of the pane (image + name/role + quote)
    const contentCell = [];
    if (pane) {
      contentCell.push(...Array.from(pane.childNodes));
    }

    if (!label && !contentCell.length) continue;
    cells.push([label, contentCell]);
  }

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
