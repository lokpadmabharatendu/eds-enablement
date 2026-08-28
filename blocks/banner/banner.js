import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Loads and decorates the banner block.
 *
 * Expected authored structure (single row, two cells):
 *   | image | title |
 *
 * Background color is controlled by the block variant on the block name, which
 * EDS turns into a class on the block element (e.g. `Banner (red)` -> `.banner.red`).
 * When no variant is authored, the block falls back to the default blue defined
 * in banner.css.
 *
 * @param {Element} block The banner block element
 */
export default function decorate(block) {
  const firstRow = block.firstElementChild;
  if (!firstRow) return;

  const [imageCell, titleCell] = firstRow.children;

  // Background image layer
  const bg = document.createElement('div');
  bg.className = 'banner-bg';
  const img = imageCell?.querySelector('img');
  if (img) {
    bg.append(
      createOptimizedPicture(img.src, img.alt || '', false, [{ width: '1600' }]),
    );
  }

  // Foreground content layer — preserve author's heading level and any inline markup
  const content = document.createElement('div');
  content.className = 'banner-content';
  if (titleCell) {
    while (titleCell.firstChild) content.append(titleCell.firstChild);
  }

  block.replaceChildren(bg, content);
}
