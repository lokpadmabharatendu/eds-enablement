// eslint-disable-next-line import/no-unresolved
import { toClassName } from '../../scripts/aem.js';

/**
 * loads and decorates the tabs-testimonial block
 *
 * Authored structure (per row): [ cell1: name ] [ cell2: image, name, role, quote ]
 * Rendered: a large active testimonial panel (image + text) with a row of
 * clickable tab cards (avatar + name + role) below it.
 *
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  const rows = [...block.children];

  // build tablist (rendered below the panels)
  const tablist = document.createElement('div');
  tablist.className = 'tabs-testimonial-list';
  tablist.setAttribute('role', 'tablist');

  rows.forEach((row, i) => {
    const cells = [...row.children];
    const labelCell = cells[0];
    const contentCell = cells[1] || cells[0];

    const name = (labelCell?.textContent || '').trim();
    const id = toClassName(name) || `tab-${i}`;

    // classify content-cell paragraphs
    const paragraphs = [...contentCell.querySelectorAll(':scope > p')];
    const picP = paragraphs.find((p) => p.querySelector('picture, img'));
    const picture = picP?.querySelector('picture, img');
    const nameP = paragraphs.find((p) => p.querySelector('strong'));
    const rest = paragraphs.filter((p) => p !== picP && p !== nameP);
    const roleP = rest[0];
    const quoteP = rest[1] || rest[0];

    // --- build panel ---
    const panel = document.createElement('div');
    panel.className = 'tabs-testimonial-panel';
    panel.id = `tabpanel-${id}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `tab-${id}`);
    panel.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');

    const media = document.createElement('div');
    media.className = 'tabs-testimonial-media';
    if (picture) media.append(picture);

    const text = document.createElement('div');
    text.className = 'tabs-testimonial-text';

    const person = document.createElement('div');
    person.className = 'tabs-testimonial-person';
    if (nameP) {
      const strong = nameP.querySelector('strong') || nameP;
      const nameEl = document.createElement('span');
      nameEl.className = 'tabs-testimonial-name';
      nameEl.textContent = strong.textContent.trim();
      person.append(nameEl);
    }
    if (roleP) {
      const roleEl = document.createElement('span');
      roleEl.className = 'tabs-testimonial-role';
      roleEl.textContent = roleP.textContent.trim();
      person.append(roleEl);
    }
    text.append(person);
    if (quoteP && quoteP !== roleP) {
      quoteP.classList.add('tabs-testimonial-quote');
      text.append(quoteP);
    }

    panel.append(media, text);

    // --- build tab button ---
    const button = document.createElement('button');
    button.className = 'tabs-testimonial-tab';
    button.id = `tab-${id}`;
    button.setAttribute('type', 'button');
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', i === 0 ? 'true' : 'false');

    if (picture) {
      const avatar = document.createElement('span');
      avatar.className = 'tabs-testimonial-avatar';
      const img = picture.querySelector('img');
      if (img) {
        const avatarImg = document.createElement('img');
        avatarImg.src = img.getAttribute('src');
        avatarImg.alt = '';
        avatarImg.loading = 'lazy';
        avatar.append(avatarImg);
      }
      button.append(avatar);
    }

    const tabText = document.createElement('span');
    tabText.className = 'tabs-testimonial-tab-text';
    const tabName = document.createElement('span');
    tabName.className = 'tabs-testimonial-tab-name';
    tabName.textContent = name;
    tabText.append(tabName);
    if (roleP) {
      const tabRole = document.createElement('span');
      tabRole.className = 'tabs-testimonial-tab-role';
      tabRole.textContent = roleP.textContent.trim();
      tabText.append(tabRole);
    }
    button.append(tabText);

    button.addEventListener('click', () => {
      block.querySelectorAll('[role=tabpanel]').forEach((p) => p.setAttribute('aria-hidden', 'true'));
      tablist.querySelectorAll('button').forEach((b) => b.setAttribute('aria-selected', 'false'));
      panel.setAttribute('aria-hidden', 'false');
      button.setAttribute('aria-selected', 'true');
    });

    tablist.append(button);

    // replace the authored row markup with the panel
    row.replaceWith(panel);
  });

  block.append(tablist);
}
