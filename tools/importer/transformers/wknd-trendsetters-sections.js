/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters section breaks + section metadata.
 * Maps source section wrappers to EDS sections:
 *   secondary-section -> grey (light), inverse-section -> dark.
 * Section boundaries + styles come from payload.template.sections
 * (page-templates.json), which are DOM-verified against cleaned.html.
 *
 * Breaks are inserted in beforeTransform (while every section element still
 * exists, before parsers replace them). Section Metadata is inserted in
 * afterTransform, anchored to a marker <hr> (or the surviving original
 * element for the first section). Sections are processed in reverse so
 * inserts never disturb not-yet-processed selectors.
 */
const SECTION_MARKER_ATTR = 'data-excat-section-id';

export default function transform(hookName, element, payload) {
  const sections = (payload.template && payload.template.sections) || [];

  if (hookName === 'beforeTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      // First section with no style: no leading break and no metadata needed.
      if (i === 0 && !section.style) continue;

      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue; // selector didn't match on this page — skip, never guess

      const hr = document.createElement('hr');
      if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
      sectionEl.before(hr);
    }
  }

  if (hookName === 'afterTransform') {
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section.style) continue;

      const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
      const anchor = marker || element.querySelector(section.selector);
      if (!anchor) continue; // neither survived — skip, never guess

      const metadataBlock = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      anchor.after(metadataBlock);

      if (marker) {
        marker.removeAttribute(SECTION_MARKER_ATTR);
        if (i === 0) marker.remove(); // first section never gets a real leading break
      }
    }
  }
}
