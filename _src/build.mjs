// Builds the site's pages from one shared layout.
//   _src/layout.html      head, header, footer, bag (shared by every page)
//   _src/pages/*.html     each page's own content; the first line is a comment with its title, description and menu item
// Run from the project folder:  node _src/build.mjs
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const src = dirname(fileURLToPath(import.meta.url));
const root = join(src, "..");
const layout = readFileSync(join(src, "layout.html"), "utf8");

const NAV = [
  { key: "shop", href: "shop.html", label: "Shop" },
  { key: "lamps", href: "lamps.html", label: "Lamps" },
  { key: "decor", href: "decor.html", label: "Home Decor" },
  { key: "gifting", href: "gifting.html", label: "Gifting &amp; Bulk" },
  { key: "story", href: "story.html", label: "Our Story" },
];

// The four collections, used by "Explore the studio" (home) and "Keep exploring" (collection pages)
const COLLECTIONS = [
  { key: "cups", href: "shop.html?cat=cups", title: "Cups &amp; mugs", img: "scene-studio.jpg", count: "cups" },
  { key: "lamps", href: "lamps.html", title: "Lamps", img: "lamp-coral.jpg", count: "lamp" },
  { key: "decor", href: "decor.html", title: "Home decor", img: "decor-wall-pockets.jpg", count: "decor" },
  { key: "gifting", href: "gifting.html", title: "Gifts &amp; sets", img: "scene-table.jpg", count: "sets" },
];
const exploreGrid = (skip) => `<div class="explore__grid">
${COLLECTIONS.filter((c) => c.key !== skip).map((c) => `        <a class="explore__tile" href="${c.href}">
          <span class="explore__img"><img src="images/${c.img}" alt="" loading="lazy"></span>
          <span class="explore__text"><span class="explore__title">${c.title}</span><span class="explore__count" data-count="${c.count}"></span></span>
          <span class="explore__arrow" aria-hidden="true">→</span>
        </a>`).join("\n")}
      </div>`;

for (const file of readdirSync(join(src, "pages")).filter((f) => f.endsWith(".html"))) {
  const raw = readFileSync(join(src, "pages", file), "utf8");
  const m = raw.match(/^<!-- page: (\{.*\}) -->\n?/);
  if (!m) throw new Error(`${file}: first line must be <!-- page: {...} -->`);
  const meta = JSON.parse(m[1]);
  const body = raw.slice(m[0].length).replaceAll("{{explore}}", exploreGrid(meta.explore));
  const nav = NAV.map((n) => `        <a href="${n.href}"${n.key === meta.nav ? ' class="is-current" aria-current="page"' : ""}>${n.label}</a>`).join("\n");
  const html = layout
    .replace("{{title}}", meta.title)
    .replace("{{description}}", meta.description)
    .replace("{{nav}}", nav)
    .replace("{{body}}", body.trimEnd())
    .replace("<body>", `<body class="page-${meta.nav}">`);
  writeFileSync(join(root, file), html);
  console.log("built", file);
}
