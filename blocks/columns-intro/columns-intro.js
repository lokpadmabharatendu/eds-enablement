export default function decorate(block) {
  const row = block.firstElementChild;
  const cols = [...row.children];
  block.classList.add(`columns-intro-${cols.length}-cols`);

  cols.forEach((col) => {
    const paras = [...col.children];

    // image column: every child holds a picture
    const isImageCol = paras.length > 0
      && paras.every((p) => p.querySelector && p.querySelector('picture'));
    if (isImageCol) {
      col.classList.add('columns-intro-images');
      return;
    }

    // content column: heading, paragraph and CTA buttons
    col.classList.add('columns-intro-content');

    // gather paragraphs that contain a single standalone link -> pill buttons
    const btnParas = paras.filter((p) => p.children.length === 1
      && p.firstElementChild.tagName === 'A'
      && p.textContent.trim() === p.firstElementChild.textContent.trim());

    if (btnParas.length) {
      const group = document.createElement('div');
      group.className = 'columns-intro-buttons';
      btnParas.forEach((p, i) => {
        const a = p.firstElementChild;
        a.classList.add('button', i === 0 ? 'primary' : 'secondary');
        group.append(a);
        p.remove();
      });
      col.append(group);
    }
  });
}
