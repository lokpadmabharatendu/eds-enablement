/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters site-wide cleanup.
 * Removes non-authorable site chrome. All selectors verified against
 * migration-work/cleaned.html for the about-us template.
 *
 * NOTE: sec-0 of the page uses <header class="section secondary-section"> INSIDE
 * #main-content and is authorable content, so a bare `header` selector is
 * intentionally NOT used here.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Breadcrumbs live inside the columns-article grid (sec-1) and would leak
    // into that block's parsed cells, so remove before block parsing.
    // Found in cleaned.html: <div class="breadcrumbs"> ... </div>
    WebImporter.DOMUtils.remove(element, ['.breadcrumbs']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome. Found in cleaned.html:
    //   <a href="#main-content" class="skip-link">
    //   <div class="navbar"> ... </div>            (top nav / mega menu)
    //   <footer class="footer inverse-footer"> ... </footer>
    WebImporter.DOMUtils.remove(element, [
      '.skip-link',
      '.navbar',
      'footer.footer',
    ]);
  }
}
