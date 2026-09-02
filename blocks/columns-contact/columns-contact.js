export default function decorate(block) {
  const row = block.firstElementChild;
  const cols = [...row.children];
  block.classList.add(`columns-contact-${cols.length}-cols`);

  cols.forEach((col) => {
    // A contact column is a stack of label + value groups. It typically holds
    // headings (labels) paired with links/paragraphs (values) and no top-level
    // lead paragraph acting as intro text.
    const hasContactValues = col.querySelector('a[href^="mailto:"], a[href^="tel:"]');

    if (hasContactValues) {
      col.classList.add('columns-contact-details');

      // group each label heading with the value(s) that follow it
      const children = [...col.children];
      let currentGroup = null;
      children.forEach((child) => {
        const isLabel = /^H[1-6]$/.test(child.tagName);
        if (isLabel) {
          currentGroup = document.createElement('div');
          currentGroup.className = 'columns-contact-item';
          col.insertBefore(currentGroup, child);
          currentGroup.append(child);
        } else if (currentGroup) {
          currentGroup.append(child);
        }
      });
      return;
    }

    col.classList.add('columns-contact-content');
  });
}
