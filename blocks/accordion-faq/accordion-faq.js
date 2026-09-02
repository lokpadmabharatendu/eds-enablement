/*
 * Accordion Block (FAQ variant)
 * Recreate an accordion using native <details>/<summary>
 * https://www.hlx.live/developer/block-collection/accordion
 */

export default function decorate(block) {
  [...block.children].forEach((row) => {
    // decorate accordion item label (question)
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-faq-item-label';
    summary.append(...label.childNodes);

    // +/- toggle indicator (matches source icon)
    const toggle = document.createElement('span');
    toggle.className = 'accordion-faq-toggle';
    toggle.setAttribute('aria-hidden', 'true');
    summary.append(toggle);

    // decorate accordion item body (answer)
    const body = row.children[1];
    body.className = 'accordion-faq-item-body';

    // decorate accordion item
    const details = document.createElement('details');
    details.className = 'accordion-faq-item';
    details.append(summary, body);
    row.replaceWith(details);
  });
}
