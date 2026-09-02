/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-content-listing.js
  var import_content_listing_exports = {};
  __export(import_content_listing_exports, {
    default: () => import_content_listing_default
  });

  // tools/importer/parsers/columns-intro.js
  function parse(element, { document: document2 }) {
    const grid = element.querySelector(":scope > .grid-layout") || element;
    let cols = Array.from(grid.querySelectorAll(":scope > div"));
    if (!cols.length) cols = Array.from(element.querySelectorAll(":scope > div"));
    const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');
    const description = element.querySelector(".subheading, p");
    const ctaLinks = Array.from(element.querySelectorAll(".button-group a, a.button"));
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    contentCell.push(...ctaLinks);
    const images = Array.from(element.querySelectorAll("img"));
    const imageCell = images.length ? images : [];
    if (!contentCell.length && !imageCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cells.push([contentCell, imageCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-intro", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-article.js
  function parse2(element, { document: document2 }) {
    const grid = element.querySelector(".grid-layout") || element;
    let cols = Array.from(grid.querySelectorAll(":scope > div"));
    if (cols.length < 2) cols = Array.from(element.querySelectorAll(":scope > div"));
    const imageCol = cols.find((c) => c.querySelector("img, picture"));
    const contentCol = cols.find((c) => c !== imageCol && (c.querySelector("h1, h2, h3") || c.querySelector(".breadcrumbs")));
    const imageCell = imageCol || element.querySelector("img, picture") || "";
    const contentCell = contentCol || "";
    if (!imageCol && !contentCol) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cells.push([imageCell, contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse3(element, { document: document2 }) {
    const grid = element.querySelector(".grid-layout") || element;
    let cards = Array.from(grid.querySelectorAll(":scope > a.article-card, :scope > a.card-link"));
    if (!cards.length) cards = Array.from(grid.querySelectorAll(":scope > a"));
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector("img, picture");
      const href = card.getAttribute("href");
      const bodyCell = [];
      const meta = card.querySelector(".article-card-meta");
      if (meta) {
        const metaText = Array.from(meta.querySelectorAll("span")).map((s) => s.textContent.trim()).filter(Boolean).join(" ");
        if (metaText) {
          const p = document2.createElement("p");
          p.textContent = metaText;
          bodyCell.push(p);
        }
      }
      const heading = card.querySelector('h1, h2, h3, h4, [class*="heading"]');
      if (heading) {
        const title = heading.textContent.trim();
        const newHeading = document2.createElement(heading.tagName.toLowerCase().match(/^h[1-6]$/) ? heading.tagName.toLowerCase() : "h3");
        if (href) {
          const a = document2.createElement("a");
          a.setAttribute("href", href);
          a.textContent = title;
          newHeading.append(a);
        } else {
          newHeading.textContent = title;
        }
        bodyCell.push(newHeading);
      }
      if (!img && !bodyCell.length) return;
      cells.push([img || "", bodyCell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".skip-link",
        ".navbar",
        "footer.footer"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header.navbar",
        "nav.nav-menu",
        ".nav-mobile-menu-button",
        "footer",
        "link",
        "noscript",
        "iframe"
      ]);
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
  function transform2(hookName, element, payload) {
    const sections = payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (i === 0 && !section.style) continue;
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (section.style) hr.setAttribute(SECTION_MARKER_ATTR, section.id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        const anchor = marker || element.querySelector(section.selector);
        if (!anchor) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        anchor.after(metadataBlock);
        if (marker) {
          marker.removeAttribute(SECTION_MARKER_ATTR);
          if (i === 0) marker.remove();
        }
      }
    }
  }

  // tools/importer/import-content-listing.js
  var parsers = {
    "columns-intro": parse,
    "columns-article": parse2,
    "cards-article": parse3
  };
  var PAGE_TEMPLATE = {
    name: "content-listing",
    description: "Listing page with hero heading and image, one featured article block, a grid of article cards, and a CTA banner.",
    urls: [
      "https://wknd-trendsetters.site/blog",
      "https://wknd-trendsetters.site/case-studies",
      "https://wknd-trendsetters.site/fashion-insights"
    ],
    blocks: [
      {
        name: "columns-intro",
        instances: ["#main-content > header.section.secondary-section > .container > .grid-layout.grid-gap-xxl"]
      },
      {
        name: "columns-article",
        instances: ["#main-content > section.section:nth-of-type(1) > .container > .grid-layout.grid-gap-lg"]
      },
      {
        name: "cards-article",
        instances: ["#main-content > section#articles > .container > .grid-layout.grid-gap-md"]
      }
    ],
    sections: [
      {
        id: "s0",
        name: "Hero intro",
        selector: "#main-content > header.section.secondary-section",
        style: "secondary",
        blocks: ["columns-intro"],
        defaultContent: []
      },
      {
        id: "s1",
        name: "Featured article",
        selector: "#main-content > section.section:nth-of-type(1)",
        style: null,
        blocks: ["columns-article"],
        defaultContent: []
      },
      {
        id: "s2",
        name: "Latest articles",
        selector: "#main-content > section#articles",
        style: "secondary",
        blocks: ["cards-article"],
        defaultContent: []
      },
      {
        id: "s3",
        name: "CTA banner",
        selector: "#main-content > section.section.accent-section",
        style: "accent",
        blocks: [],
        defaultContent: []
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_content_listing_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_content_listing_exports);
})();
