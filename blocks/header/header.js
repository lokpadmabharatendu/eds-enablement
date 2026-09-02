// media query match that indicates desktop width
const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Fetch the nav fragment DOM. Metadata-independent dual-fetch:
 * /content/nav.plain.html (localhost / aem up) then /nav.plain.html (DA/EDS prod).
 * @returns {Promise<Document|null>}
 */
async function fetchNav() {
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch('/nav.plain.html');
  if (!resp.ok) return null;
  const html = await resp.text();
  return new DOMParser().parseFromString(html, 'text/html');
}

/** Close every open dropdown/megamenu in the nav. */
function closeAllDropdowns(nav) {
  nav.querySelectorAll('.nav-item.has-dropdown[aria-expanded="true"]').forEach((item) => {
    item.setAttribute('aria-expanded', 'false');
  });
}

/**
 * Build a top-level nav item from a source <li>.
 * A dropdown/megamenu item has a leading <p> label followed by a nested <ul>.
 * A plain item is a single <a> (which Document Authoring may wrap in a <p>).
 */
function buildNavItem(li) {
  const item = document.createElement('li');
  item.className = 'nav-item';

  const submenu = li.querySelector(':scope > ul');
  // A plain link: direct <a>, or DA-wrapped <p><a> (with no submenu).
  const directLink = li.querySelector(':scope > a') || (!submenu ? li.querySelector(':scope > p > a') : null);
  // The dropdown/megamenu label is a leading <p> whose text is NOT itself the
  // direct link (so a <p><a> plain link is not mistaken for a dropdown label).
  const labelP = [...li.querySelectorAll(':scope > p')].find((p) => !p.querySelector('a'));

  if (submenu && labelP) {
    // Dropdown / megamenu trigger
    item.classList.add('has-dropdown');
    item.setAttribute('aria-expanded', 'false');

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'nav-item-trigger';
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.innerHTML = `<span>${labelP.textContent.trim()}</span><span class="nav-caret" aria-hidden="true"></span>`;
    item.append(trigger);

    // The panel holds the source submenu content
    const panel = document.createElement('div');
    panel.className = 'nav-panel';

    // Detect megamenu (columns = nested <li> that themselves contain a <p> + <ul>)
    const columns = [...submenu.children].filter((c) => c.tagName === 'LI' && c.querySelector(':scope > ul'));
    const promo = [...submenu.children].filter((c) => c.tagName === 'LI' && !c.querySelector(':scope > ul') && c.querySelector(':scope > p'));

    if (columns.length) {
      item.classList.add('has-megamenu');
      const grid = document.createElement('div');
      grid.className = 'nav-megamenu';
      columns.forEach((col) => {
        const colEl = document.createElement('div');
        colEl.className = 'nav-column';
        const heading = col.querySelector(':scope > p');
        if (heading) {
          const h = document.createElement('h3');
          h.textContent = heading.textContent.trim();
          colEl.append(h);
        }
        const list = document.createElement('ul');
        col.querySelectorAll(':scope > ul > li > a').forEach((a) => {
          const cardLi = document.createElement('li');
          const card = document.createElement('a');
          card.href = a.getAttribute('href');
          card.className = 'nav-card';
          const img = a.querySelector('img');
          if (img) {
            const icon = document.createElement('span');
            icon.className = 'nav-card-icon';
            const i = document.createElement('img');
            i.src = img.getAttribute('src');
            i.alt = '';
            icon.append(i);
            card.append(icon);
          }
          // Split "Title — description" into title + description
          const text = a.textContent.replace(/\s+/g, ' ').trim();
          const body = document.createElement('span');
          body.className = 'nav-card-body';
          const [title, description] = text.split(' — ');
          const strong = document.createElement('strong');
          strong.textContent = title;
          body.append(strong);
          if (description) {
            body.append(document.createTextNode(' '));
            const desc = document.createElement('span');
            desc.textContent = description;
            body.append(desc);
          }
          card.append(body);
          cardLi.append(card);
          list.append(cardLi);
        });
        colEl.append(list);
        grid.append(colEl);
      });
      panel.append(grid);

      // Promo card (label + description + CTA link)
      promo.forEach((p) => {
        const promoLink = p.querySelector(':scope > p > a') || p.querySelector('a');
        const paras = [...p.querySelectorAll(':scope > p')];
        const promoEl = document.createElement('a');
        promoEl.className = 'nav-promo';
        if (promoLink) promoEl.href = promoLink.getAttribute('href');
        const title = paras[0] ? paras[0].textContent.trim() : '';
        const descText = paras[1] ? paras[1].textContent.trim() : '';
        const ctaText = promoLink ? promoLink.textContent.replace(/\s+/g, ' ').trim() : '';
        const ctaImg = promoLink ? promoLink.querySelector('img') : null;
        promoEl.innerHTML = `<h3>${title}</h3><span>${descText}</span>`;
        const cta = document.createElement('span');
        cta.className = 'nav-promo-cta';
        cta.textContent = ctaText;
        if (ctaImg) {
          const ci = document.createElement('img');
          ci.src = ctaImg.getAttribute('src');
          ci.alt = '';
          cta.append(ci);
        }
        promoEl.append(cta);
        panel.append(promoEl);
      });
    } else {
      // Simple dropdown list of links
      item.classList.add('has-simple-dropdown');
      const list = document.createElement('ul');
      list.className = 'nav-dropdown';
      submenu.querySelectorAll(':scope > li > a').forEach((a) => {
        const dLi = document.createElement('li');
        const link = document.createElement('a');
        link.href = a.getAttribute('href');
        link.textContent = a.textContent.replace(/\s+/g, ' ').trim();
        dLi.append(link);
        list.append(dLi);
      });
      panel.append(list);
    }

    item.append(panel);

    // Desktop: hover to open. Mobile: click to toggle.
    item.addEventListener('mouseenter', () => {
      if (isDesktop.matches) {
        closeAllDropdowns(item.closest('.nav-sections'));
        item.setAttribute('aria-expanded', 'true');
      }
    });
    item.addEventListener('mouseleave', () => {
      if (isDesktop.matches) item.setAttribute('aria-expanded', 'false');
    });
    trigger.addEventListener('click', () => {
      const expanded = item.getAttribute('aria-expanded') === 'true';
      if (!isDesktop.matches) closeAllDropdowns(item.closest('.nav-sections'));
      item.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });
  } else if (directLink) {
    const link = document.createElement('a');
    link.href = directLink.getAttribute('href');
    link.textContent = directLink.textContent.replace(/\s+/g, ' ').trim();
    item.append(link);
  }

  return item;
}

/**
 * loads and decorates the header nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const doc = await fetchNav();
  block.textContent = '';
  if (!doc) return;

  const sections = [...doc.body.querySelectorAll(':scope > div')];
  const [brandSection, navSection, toolsSection] = sections;

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Main navigation');

  // Brand
  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  if (brandSection) {
    const brandLink = brandSection.querySelector('a');
    if (brandLink) {
      const a = document.createElement('a');
      a.href = brandLink.getAttribute('href') || '/';
      a.className = 'nav-logo';
      const img = brandLink.querySelector('img');
      if (img) {
        const i = document.createElement('img');
        i.src = img.getAttribute('src');
        i.alt = img.getAttribute('alt') || '';
        a.append(i);
      }
      const label = document.createElement('span');
      label.textContent = brandLink.textContent.replace(/\s+/g, ' ').trim();
      a.append(label);
      brand.append(a);
    }
  }

  // Sections (primary nav)
  const navSections = document.createElement('div');
  navSections.className = 'nav-sections';
  const ul = document.createElement('ul');
  ul.className = 'nav-list';
  if (navSection) {
    navSection.querySelectorAll(':scope > ul > li').forEach((li) => {
      ul.append(buildNavItem(li));
    });
  }
  navSections.append(ul);

  // Tools (CTA)
  const tools = document.createElement('div');
  tools.className = 'nav-tools';
  if (toolsSection) {
    const ctaLink = toolsSection.querySelector('a');
    if (ctaLink) {
      const a = document.createElement('a');
      a.href = ctaLink.getAttribute('href') || '#';
      a.className = 'nav-cta';
      a.textContent = ctaLink.textContent.replace(/\s+/g, ' ').trim();
      tools.append(a);
    }
  }

  // Hamburger (mobile)
  const hamburger = document.createElement('button');
  hamburger.type = 'button';
  hamburger.className = 'nav-hamburger';
  hamburger.setAttribute('aria-label', 'Open navigation');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<span class="nav-hamburger-icon" aria-hidden="true"></span>';
  hamburger.addEventListener('click', () => {
    const open = nav.getAttribute('data-open') === 'true';
    nav.setAttribute('data-open', open ? 'false' : 'true');
    hamburger.setAttribute('aria-expanded', open ? 'false' : 'true');
    hamburger.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
    document.body.style.overflowY = open || isDesktop.matches ? '' : 'hidden';
  });

  nav.append(hamburger, brand, navSections, tools);

  // Reset state when crossing the desktop/mobile boundary
  isDesktop.addEventListener('change', () => {
    nav.setAttribute('data-open', 'false');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open navigation');
    document.body.style.overflowY = '';
    closeAllDropdowns(navSections);
  });

  // Close open dropdowns on Escape
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') closeAllDropdowns(navSections);
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
