/*
 * Employee List Block
 * Renders employees from a sheet, paginated with a "Load more" button.
 * Button label is read from /placeholders.json (key: "loadMore").
 */

const PAGE_SIZE = 10;

/**
 * Fetch the placeholders sheet once and cache the result.
 * Supports Key/Text or Key/Value columns.
 */
let placeholdersPromise;
async function fetchPlaceholders() {
  if (!placeholdersPromise) {
    placeholdersPromise = fetch('/placeholders.json')
      .then((resp) => (resp.ok ? resp.json() : { data: [] }))
      .then((json) => {
        const map = {};
        (json.data || []).forEach((row) => {
          const key = row.Key || row.key;
          const value = row.Text ?? row.Value ?? row.text ?? row.value;
          if (key) map[key] = value;
        });
        return map;
      })
      .catch(() => ({}));
  }
  return placeholdersPromise;
}

/**
 * Fetch the employee data sheet.
 */
async function fetchEmployees(url) {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Failed to fetch ${url} (${resp.status})`);
  const json = await resp.json();
  return json.data || [];
}

/**
 * Build a single employee card.
 */
function buildRow(emp) {
  const row = document.createElement('li');
  row.className = 'employee-list-item';

  const fields = [
    ['name', emp.Name],
    ['department', emp.Department],
    ['experience', emp.Experience],
    ['city', emp.City],
  ];

  fields.forEach(([key, value]) => {
    const cell = document.createElement('div');
    cell.className = `employee-list-${key}`;
    cell.dataset.label = key.charAt(0).toUpperCase() + key.slice(1);
    cell.textContent = value || '';
    row.append(cell);
  });

  return row;
}

export default async function decorate(block) {
  // Read the data source URL from the block content, fall back to a default path.
  const link = block.querySelector('a');
  let dataUrl = link ? link.getAttribute('href') : '/data/employee-info';
  if (!dataUrl.endsWith('.json')) dataUrl = `${dataUrl}.json`;

  block.textContent = '';

  let employees = [];
  let placeholders = {};
  try {
    [placeholders, employees] = await Promise.all([
      fetchPlaceholders(),
      fetchEmployees(dataUrl),
    ]);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('employee-list: failed to load data', err);
    const msg = document.createElement('p');
    msg.className = 'employee-list-error';
    msg.textContent = 'Unable to load employees.';
    block.append(msg);
    return;
  }

  const loadMoreLabel = placeholders.loadMore
    || placeholders['load-more']
    || 'Load more';

  // Column headers (hidden on mobile, shown on desktop via CSS).
  const header = document.createElement('div');
  header.className = 'employee-list-header';
  ['Name', 'Department', 'Experience', 'City'].forEach((label) => {
    const cell = document.createElement('div');
    cell.textContent = label;
    header.append(cell);
  });
  block.append(header);

  const list = document.createElement('ul');
  list.className = 'employee-list-items';
  block.append(list);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'employee-list-load-more';
  button.textContent = loadMoreLabel;
  block.append(button);

  let shown = 0;
  const showNext = () => {
    const slice = employees.slice(shown, shown + PAGE_SIZE);
    const fragment = document.createDocumentFragment();
    slice.forEach((emp) => fragment.append(buildRow(emp)));
    list.append(fragment);
    shown += slice.length;
    if (shown >= employees.length) button.remove();
  };

  button.addEventListener('click', showNext);
  showNext();
}
