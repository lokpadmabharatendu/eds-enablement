import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Loads and decorates the banner-cta block.
 *
 * Expected authored structure (single row, two cells):
 *   | image | title |
 *
 * The title cell may contain a heading, paragraph, and one or more buttons.
 * The image becomes a full-bleed background layer with a dark overlay so the
 * foreground content stays legible.
 *
 * @param {Element} block The banner-cta block element
 */
export default function decorate(block) {
  const firstRow = block.firstElementChild;
  if (!firstRow) return;

  const [imageCell, titleCell] = firstRow.children;

  // Background image layer
  const bg = document.createElement('div');
  bg.className = 'banner-cta-bg';
  const img = imageCell?.querySelector('img');
  if (img) {
    bg.append(
      createOptimizedPicture(img.src, img.alt || '', false, [{ width: '1600' }]),
    );
  }

  // Foreground content layer — preserve author's heading level and any inline markup
  const content = document.createElement('div');
  content.className = 'banner-cta-content';
  if (titleCell) {
    while (titleCell.firstChild) content.append(titleCell.firstChild);
  }

  block.replaceChildren(bg, content);
}
