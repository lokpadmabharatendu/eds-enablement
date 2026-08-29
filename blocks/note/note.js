import { decorateIcons } from '../../scripts/aem.js';

/**
 * Loads and decorates the note block.
 *
 * Variants (block name in parens): warning | error | success | accent-border | no-icon
 * Default (no variant) renders the info style.
 *
 * @param {Element} block The note block element
 */
export default async function decorate(block) {
  // Announce as a landmark for assistive tech. Errors/warnings interrupt; info/success are polite.
  const isAlert = block.classList.contains('error') || block.classList.contains('warning');
  block.setAttribute('role', isAlert ? 'alert' : 'note');

  // Replace headings with a styled paragraph so notes don't disrupt the page outline.
  block.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((oldHeading) => {
    const heading = document.createElement('p');
    heading.classList.add('note-heading');
    heading.textContent = oldHeading.textContent;
    oldHeading.replaceWith(heading);
  });

  // Prepend the variant icon.
  if (!block.classList.contains('no-icon')) {
    const icon = document.createElement('span');
    if (block.classList.contains('warning')) {
      icon.classList.add('icon', 'icon-warning');
    } else if (block.classList.contains('error')) {
      icon.classList.add('icon', 'icon-error');
    } else if (block.classList.contains('success')) {
      icon.classList.add('icon', 'icon-success');
    } else {
      icon.classList.add('icon', 'icon-info');
    }
    block.prepend(icon);
    decorateIcons(block);
  }
}
