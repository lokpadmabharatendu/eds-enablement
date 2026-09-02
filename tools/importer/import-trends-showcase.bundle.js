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

  // tools/importer/import-trends-showcase.js
  var import_trends_showcase_exports = {};
  __export(import_trends_showcase_exports, {
    default: () => import_trends_showcase_default
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

  // tools/importer/parsers/cards-trend.js
  function parse2(element, { document: document2 }) {
    const imageDivs = Array.from(element.querySelectorAll(".trend-card-image"));
    const anchors = Array.from(element.querySelectorAll("a.trend-card, a.card-link"));
    function hrefForPair(imageDiv, idx) {
      const anchorAncestor = imageDiv.closest("a[href]");
      if (anchorAncestor) return anchorAncestor.getAttribute("href");
      if (anchors[idx]) return anchors[idx].getAttribute("href");
      return anchors.length ? anchors[0].getAttribute("href") : null;
    }
    const cells = [];
    imageDivs.forEach((imageDiv, idx) => {
      let bodyDiv = imageDiv.nextElementSibling;
      while (bodyDiv && !bodyDiv.classList.contains("trend-card-body")) {
        bodyDiv = bodyDiv.nextElementSibling;
      }
      const href = hrefForPair(imageDiv, idx);
      const img = imageDiv.querySelector("img");
      const tag = bodyDiv ? bodyDiv.querySelector(".tag") : null;
      const heading = bodyDiv ? bodyDiv.querySelector("h1, h2, h3, h4, h5, h6") : null;
      const description = bodyDiv ? bodyDiv.querySelector("p") : null;
      const imageCell = img ? img.cloneNode(true) : "";
      const bodyCell = [];
      if (tag && tag.textContent.trim()) {
        const tagP = document2.createElement("p");
        tagP.textContent = tag.textContent.trim();
        bodyCell.push(tagP);
      }
      if (heading && heading.textContent.trim()) {
        const newHeading = document2.createElement(heading.tagName.toLowerCase());
        if (href) {
          const link = document2.createElement("a");
          link.setAttribute("href", href);
          link.textContent = heading.textContent.trim();
          newHeading.appendChild(link);
        } else {
          newHeading.textContent = heading.textContent.trim();
        }
        bodyCell.push(newHeading);
      }
      if (description && description.textContent.trim()) {
        const descP = document2.createElement("p");
        descP.textContent = description.textContent.trim();
        bodyCell.push(descP);
      }
      if (imageCell || bodyCell.length) {
        cells.push([imageCell, bodyCell]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-trend", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feature.js
  function parse3(element, { document: document2 }) {
    const columns = element.querySelectorAll(":scope > div");
    const imageCol = columns[0] || element;
    const image = imageCol.querySelector("picture, img");
    const textCol = columns[1] || element;
    const heading = textCol.querySelector('h1, h2, h3, [class*="heading"]');
    const paragraph = textCol.querySelector('p, [class*="paragraph"]');
    const ctaLinks = Array.from(textCol.querySelectorAll("a.button, .button-group a, a"));
    if (!image && !heading && !paragraph) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const leftCell = [];
    if (image) leftCell.push(image);
    const rightCell = [];
    if (heading) rightCell.push(heading);
    if (paragraph) rightCell.push(paragraph);
    rightCell.push(...ctaLinks);
    const cells = [];
    cells.push([leftCell, rightCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-feature", cells });
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

  // tools/importer/import-trends-showcase.js
  var parsers = {
    "columns-intro": parse,
    "cards-trend": parse2,
    "columns-feature": parse3
  };
  var PAGE_TEMPLATE = {
    name: "trends-showcase",
    description: "Showcase page with hero heading and image pair, a multi-column grid of tagged trend cards, an image-plus-text feature section, and a CTA banner.",
    urls: [
      "https://wknd-trendsetters.site/fashion-trends-young-adults-casual-sport"
    ],
    blocks: [
      {
        name: "columns-intro",
        instances: ["#main-content > header.section.secondary-section > .container > .grid-layout.grid-gap-xxl"]
      },
      {
        name: "cards-trend",
        instances: ["#main-content > section#trends > .container > .grid-layout.grid-gap-md"]
      },
      {
        name: "columns-feature",
        instances: ["#main-content > section.section.secondary-section:nth-of-type(2) > .container > .grid-layout.grid-gap-lg"]
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
        name: "Trend alert",
        selector: "#main-content > section#trends",
        style: null,
        blocks: ["cards-trend"],
        defaultContent: []
      },
      {
        id: "s2",
        name: "Feature",
        selector: "#main-content > section.section.secondary-section:nth-of-type(2)",
        style: "secondary",
        blocks: ["columns-feature"],
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
  var import_trends_showcase_default = {
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
  return __toCommonJS(import_trends_showcase_exports);
})();
