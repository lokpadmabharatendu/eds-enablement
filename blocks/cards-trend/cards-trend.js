import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * cards-trend — grid of linked trend cards.
 * Each card: cover image, category tag pill, bold title, short description.
 */
export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-trend-card-image';
      else div.className = 'cards-trend-card-body';
    });
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });

  // Turn the first short paragraph of each card body into a category tag pill,
  // but only when it precedes the heading (i.e. it's the leading category label).
  ul.querySelectorAll('.cards-trend-card-body').forEach((body) => {
    const firstP = body.querySelector('p');
    const heading = body.querySelector('h1, h2, h3, h4, h5, h6');
    if (firstP && heading) {
      const kids = [...body.children];
      const headingFollowsP = kids.indexOf(firstP) < kids.indexOf(heading);
      if (headingFollowsP) {
        const tag = document.createElement('span');
        tag.className = 'cards-trend-tag';
        tag.textContent = firstP.textContent.trim();
        firstP.replaceWith(tag);
      }
    }
  });

  block.textContent = '';
  block.append(ul);
}
