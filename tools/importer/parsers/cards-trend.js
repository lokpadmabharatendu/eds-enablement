/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-trend. Base: cards.
 * Source: https://wknd-trendsetters.site/fashion-trends-young-adults-casual-sport (trends-showcase)
 * Structure: 2-column cards block. Each source card is an <a> link containing a cover image,
 * a category tag (span.tag), an H3 title, and a description paragraph.
 * One block row per card: [image cell, body cell]. The body cell holds the tag (as a leading
 * paragraph so the decorator promotes it to a pill), the title (wrapped in the card link to
 * preserve href), and the description.
 *
 * IMPORTANT: every cell is built from CLONED nodes or freshly-created elements. Never push a
 * live node from `element` into `cells` — WebImporter.Blocks.createBlock moves nodes when it
 * serializes the multi-row table, so sharing/mutating live references collapses later rows
 * (previously only the first card survived).
 * Generated: 2026-09-02
 */
export default function parse(element, { document }) {
  // Build one row per card. Prefer the well-formed structure (each card is an
  // <a class="trend-card"> wrapping an image + body). But some environments
  // (e.g. the headless importer's HTML parser) reject block-level <div>s inside
  // an <a> and collapse ALL cards' .trend-card-image / .trend-card-body pairs
  // into the first anchor as flat siblings. So derive cards from the
  // image+body PAIRS directly, which is robust to both shapes.
  const imageDivs = Array.from(element.querySelectorAll('.trend-card-image'));
  const anchors = Array.from(element.querySelectorAll('a.trend-card, a.card-link'));

  // Map each image div to the href of its nearest ancestor anchor, falling back
  // to positional matching against the anchor list (collapsed case: 1 anchor for
  // all pairs, so reuse its href for every card).
  function hrefForPair(imageDiv, idx) {
    const anchorAncestor = imageDiv.closest('a[href]');
    if (anchorAncestor) return anchorAncestor.getAttribute('href');
    if (anchors[idx]) return anchors[idx].getAttribute('href');
    return anchors.length ? anchors[0].getAttribute('href') : null;
  }

  const cells = [];

  imageDivs.forEach((imageDiv, idx) => {
    // The body is the next .trend-card-body sibling after this image div.
    let bodyDiv = imageDiv.nextElementSibling;
    while (bodyDiv && !bodyDiv.classList.contains('trend-card-body')) {
      bodyDiv = bodyDiv.nextElementSibling;
    }

    const href = hrefForPair(imageDiv, idx);
    const img = imageDiv.querySelector('img');
    const tag = bodyDiv ? bodyDiv.querySelector('.tag') : null;
    const heading = bodyDiv ? bodyDiv.querySelector('h1, h2, h3, h4, h5, h6') : null;
    const description = bodyDiv ? bodyDiv.querySelector('p') : null;

    // Image cell (first column). Clone so the live node isn't consumed.
    const imageCell = img ? img.cloneNode(true) : '';

    // Body cell (second column) collects tag, title, description in order.
    const bodyCell = [];

    // Tag → leading paragraph. The decorator turns the first <p> preceding the
    // heading into a category pill, so emit the tag text as a fresh <p>.
    if (tag && tag.textContent.trim()) {
      const tagP = document.createElement('p');
      tagP.textContent = tag.textContent.trim();
      bodyCell.push(tagP);
    }

    // Title → fresh heading; wrap the title text in the card link to preserve href.
    if (heading && heading.textContent.trim()) {
      const newHeading = document.createElement(heading.tagName.toLowerCase());
      if (href) {
        const link = document.createElement('a');
        link.setAttribute('href', href);
        link.textContent = heading.textContent.trim();
        newHeading.appendChild(link);
      } else {
        newHeading.textContent = heading.textContent.trim();
      }
      bodyCell.push(newHeading);
    }

    // Description → fresh paragraph with the source text.
    if (description && description.textContent.trim()) {
      const descP = document.createElement('p');
      descP.textContent = description.textContent.trim();
      bodyCell.push(descP);
    }

    if (imageCell || bodyCell.length) {
      cells.push([imageCell, bodyCell]);
    }
  });

  // Empty-block guard: nothing extracted → unwrap in place.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-trend', cells });
  element.replaceWith(block);
}
