/*
 * Article List Block
 * Fetches an EDS query index JSON and renders the entries as a card grid.
 *
 * Authoring (block table rows are treated as key/value config):
 *   source     | /query-index.json     (link or path; defaults to /query-index.json)
 *   filter     | /blog/                (only keep paths starting with this prefix)
 *   exclude    | /drafts/, /private/   (comma-separated path prefixes to skip; adds to defaults)
 *   limit      | 12                    (max items to render overall)
 *   page-size  | 6                     (items per "Load more" click; 0 disables paging)
 *   sort       | date-desc             (date-desc | date-asc | title-asc | none)
 *
 * All rows are optional. An anchor anywhere in the block content is treated
 * as the source URL.
 */

import { createOptimizedPicture } from '../../scripts/aem.js';

const DEFAULT_SOURCE = '/query-index.json';
const DEFAULT_PAGE_SIZE = 6;

// EDS convention: nav/footer fragments and drafts get picked up by the
// default query index unless the site's helix/query-index.xlsx filters them.
// Skip these by default so an unconfigured block still looks sensible.
const DEFAULT_EXCLUDES = ['/nav', '/footer', '/drafts/', '/tools/'];

/**
 * Read the block's authored rows as a config object.
 * Row shape in EDS: two <div>s per row — first is the key, second is the value.
 */
function readConfig(block) {
  const config = {};
  block.querySelectorAll(':scope > div').forEach((row) => {
    const cells = row.children;
    if (cells.length < 2) return;
    const key = cells[0].textContent.trim().toLowerCase();
    const valueCell = cells[1];
    const link = valueCell.querySelector('a');
    const value = link ? link.getAttribute('href') : valueCell.textContent.trim();
    if (key) config[key] = value;
  });

  // Fallback: a bare link anywhere in the block is treated as the source.
  if (!config.source) {
    const link = block.querySelector('a');
    if (link) config.source = link.getAttribute('href');
  }
  return config;
}

async function fetchIndex(url) {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Failed to fetch ${url} (${resp.status})`);
  const json = await resp.json();
  return json.data || [];
}

function sortEntries(entries, mode) {
  if (!mode || mode === 'none') return entries;
  const sorted = [...entries];
  if (mode === 'title-asc') {
    sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    return sorted;
  }
  // date-based: index dates are typically epoch seconds or ISO strings; treat blanks as 0.
  const toTime = (v) => {
    if (!v) return 0;
    const n = Number(v);
    if (!Number.isNaN(n) && n > 0) return n < 1e12 ? n * 1000 : n;
    const d = Date.parse(v);
    return Number.isNaN(d) ? 0 : d;
  };
  sorted.sort((a, b) => toTime(b.date) - toTime(a.date));
  if (mode === 'date-asc') sorted.reverse();
  return sorted;
}

function parseDate(value) {
  if (!value) return null;
  const n = Number(value);
  let d;
  if (!Number.isNaN(n) && n > 0) {
    d = new Date(n < 1e12 ? n * 1000 : n);
  } else {
    d = new Date(value);
  }
  return Number.isNaN(d.getTime()) ? null : d;
}

function formatDate(value) {
  const d = parseDate(value);
  return d ? d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '';
}

function buildCard(entry) {
  const li = document.createElement('li');
  li.className = 'article-list-item';

  const link = document.createElement('a');
  link.className = 'article-list-link';
  link.href = entry.path || '#';

  if (entry.image) {
    const media = document.createElement('div');
    media.className = 'article-list-media';
    const picture = createOptimizedPicture(entry.image, entry.title || '', false, [
      { media: '(min-width: 900px)', width: '600' },
      { width: '750' },
    ]);
    media.append(picture);
    link.append(media);
  }

  const body = document.createElement('div');
  body.className = 'article-list-body';

  if (entry.title) {
    const title = document.createElement('h3');
    title.className = 'article-list-title';
    title.textContent = entry.title;
    body.append(title);
  }

  const dateObj = parseDate(entry.date);
  if (dateObj) {
    const time = document.createElement('time');
    time.className = 'article-list-date';
    time.dateTime = dateObj.toISOString();
    time.textContent = formatDate(entry.date);
    body.append(time);
  }

  if (entry.description) {
    const desc = document.createElement('p');
    desc.className = 'article-list-description';
    desc.textContent = entry.description;
    body.append(desc);
  }

  link.append(body);
  li.append(link);
  return li;
}

export default async function decorate(block) {
  const config = readConfig(block);
  let source = config.source || DEFAULT_SOURCE;
  if (!source.endsWith('.json')) source = `${source.replace(/\/$/, '')}.json`;

  const limit = Number.parseInt(config.limit, 10) || 0;
  const pageSize = Number.parseInt(config['page-size'] ?? config.pagesize, 10);
  const paging = Number.isFinite(pageSize) ? pageSize : DEFAULT_PAGE_SIZE;
  const sortMode = (config.sort || 'date-desc').toLowerCase();
  const { filter } = config;
  const excludes = [
    ...DEFAULT_EXCLUDES,
    ...(config.exclude ? config.exclude.split(',').map((s) => s.trim()).filter(Boolean) : []),
  ];
  const isExcluded = (path) => excludes.some((prefix) => (
    path === prefix || path.startsWith(prefix.endsWith('/') ? prefix : `${prefix}/`)
  ));

  block.textContent = '';

  let entries = [];
  try {
    entries = await fetchIndex(source);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('article-list: failed to load index', err);
    const msg = document.createElement('p');
    msg.className = 'article-list-error';
    msg.textContent = 'Unable to load articles.';
    block.append(msg);
    return;
  }

  // Drop rows that don't look like content pages (no title / fragment paths).
  entries = entries.filter((e) => e && e.title && e.path && !isExcluded(e.path));
  if (filter) entries = entries.filter((e) => e.path.startsWith(filter));
  entries = sortEntries(entries, sortMode);
  if (limit > 0) entries = entries.slice(0, limit);

  if (!entries.length) {
    const msg = document.createElement('p');
    msg.className = 'article-list-empty';
    msg.textContent = 'No articles found.';
    block.append(msg);
    return;
  }

  const list = document.createElement('ul');
  list.className = 'article-list-items';
  block.append(list);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'article-list-load-more';
  button.textContent = 'Load more';

  let shown = 0;
  const step = paging > 0 ? paging : entries.length;
  const showNext = () => {
    const slice = entries.slice(shown, shown + step);
    const fragment = document.createDocumentFragment();
    slice.forEach((entry) => fragment.append(buildCard(entry)));
    list.append(fragment);
    shown += slice.length;
    if (shown >= entries.length) button.remove();
  };

  if (paging > 0 && entries.length > paging) block.append(button);
  button.addEventListener('click', showNext);
  showNext();
}
