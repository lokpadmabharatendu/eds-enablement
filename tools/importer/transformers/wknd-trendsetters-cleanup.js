/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: WKND Trendsetters site-wide cleanup.
 * Removes non-authorable site chrome so only <main> page content remains.
 * All selectors verified against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Global chrome that sits outside <main> and would interfere with parsing.
    // Verified in cleaned.html:
    //   <a href="#main-content" class="skip-link">Skip to main content</a>
    //   <div class="navbar"> ... nav-menu / mega-menu / nav-mobile-menu-button ...
    //   <footer class="footer inverse-footer"> ...
    WebImporter.DOMUtils.remove(element, [
      '.skip-link',
      '.navbar',
      'footer.footer',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Safety net: remove any residual non-authorable chrome and non-content
    // elements. Verified selectors from cleaned.html; generic safe elements.
    WebImporter.DOMUtils.remove(element, [
      'header.navbar',
      'nav.nav-menu',
      '.nav-mobile-menu-button',
      'footer',
      'link',
      'noscript',
      'iframe',
    ]);
  }
}
