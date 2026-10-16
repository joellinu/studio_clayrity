// ============================================================
//  SHOP SETTINGS: change these to the seller's real details
// ============================================================
const SHOP = {
  name: "Studio Clayrity",
  whatsapp: "910000000000",     // country code + number, no "+" or spaces
  instagram: "studio_clayrity", // handle without "@"
};

// ============================================================
//  PRODUCTS: edit names, prices and photos here.
//  img: photo file in /images (cups are cup-<id>.jpg, so a new photo can simply replace the old file)
//  type: espresso | cappuccino | tea | tumbler | mug | bowl | lamp | decor | sets
//  ar (optional): photo proportions, width/height, used by the home decor gallery wall
//  badge (optional): Bestseller | New
//  no (optional): piece number for one-of-a-kind pieces, e.g. 7 → "No. 07"
//  soldOut (optional): true to show "Sold out" and turn the button into a restock request
// ============================================================
const PRODUCTS = [
  { id: 101, name: "Moss drip cup, 200 ml",          type: "cappuccino", price: 950,  glaze: "Moss Drip",       size: "Speckled stoneware", img: "cup-101.jpg" },
  { id: 102, name: "Ember tumbler, 380 ml",          type: "tumbler",    price: 1250, glaze: "Ember Shino",     size: "Throwing rings",     img: "cup-102.jpg" },
  { id: 103, name: "Sage speckle mug, 320 ml",       type: "mug",        price: 1150, glaze: "Sage Speckle",    size: "Pulled handle",      img: "cup-103.jpg" },
  { id: 104, name: "Plum chawan, 300 ml",            type: "bowl",       price: 1350, glaze: "Plum Flux",       size: "One of a kind",      img: "cup-104.jpg", no: 12, badge: "New" },
  { id: 105, name: "Indigo drip mug, 340 ml",        type: "mug",        price: 1200, glaze: "Indigo Cream",    size: "Pulled handle",      img: "cup-105.jpg", badge: "Bestseller" },
  { id: 106, name: "Faceted tea cup, 160 ml",        type: "tea",        price: 850,  glaze: "Ochre Ash",       size: "Hand-carved facets", img: "cup-106.jpg" },
  { id: 107, name: "Forest lace cup, 250 ml",        type: "cappuccino", price: 1050, glaze: "Forest Lace",     size: "Speckled stoneware", img: "cup-107.jpg" },
  { id: 108, name: "Sunset belly mug, 300 ml",       type: "mug",        price: 1250, glaze: "Sunset Drip",     size: "Pulled handle",      img: "cup-108.jpg", badge: "Bestseller" },
  { id: 109, name: "Rose quartz tumbler, 350 ml",    type: "tumbler",    price: 1200, glaze: "Rose Quartz",     size: "Speckled stoneware", img: "cup-109.jpg", badge: "New" },
  { id: 110, name: "Cobalt bloom chawan, 350 ml",    type: "bowl",       price: 1400, glaze: "Cobalt Bloom",    size: "One of a kind",      img: "cup-110.jpg", no: 14 },
  { id: 111, name: "Honey espresso cup, 90 ml",      type: "espresso",   price: 650,  glaze: "Honey Tenmoku",   size: "Iron-red base",      img: "cup-111.jpg" },
  { id: 112, name: "Lagoon mug, 320 ml",             type: "mug",        price: 1150, glaze: "Lagoon",          size: "Pulled handle",      img: "cup-112.jpg" },
  { id: 113, name: "Olive chawan, 400 ml",           type: "bowl",       price: 1450, glaze: "Olive Ash",       size: "Speckled stoneware", img: "cup-113.jpg", soldOut: true },
  { id: 114, name: "Tide tumbler, 300 ml",           type: "tumbler",    price: 1150, glaze: "Tide",            size: "Throwing rings",     img: "cup-114.jpg" },
  { id: 115, name: "Iron rust mug, 300 ml",          type: "mug",        price: 1250, glaze: "Iron Rust",       size: "Pulled handle",      img: "cup-115.jpg" },
  { id: 116, name: "Garnet espresso cup, 100 ml",    type: "espresso",   price: 700,  glaze: "Garnet",          size: "Speckled stoneware", img: "cup-116.jpg", badge: "New" },
  { id: 117, name: "Dusk tea cup, 220 ml",           type: "tea",        price: 900,  glaze: "Dusk Ash",        size: "Speckled stoneware", img: "cup-117.jpg", soldOut: true },
  { id: 118, name: "Turquoise cappuccino mug, 250 ml", type: "mug",      price: 1100, glaze: "Turquoise Float", size: "Pulled handle",      img: "cup-118.jpg" },
  { id: 119, name: "Emerald gold tumbler, 280 ml",   type: "tumbler",    price: 1100, glaze: "Emerald Gold",    size: "Speckled stoneware", img: "cup-119.jpg", badge: "Bestseller" },
  { id: 121, name: "Merlot drip cup, 220 ml",        type: "cappuccino", price: 950,  glaze: "Merlot Drip",     size: "Speckled stoneware", img: "cup-121.jpg" },
  { id: 123, name: "Ocean foam cup, 220 ml",         type: "cappuccino", price: 950,  glaze: "Ocean Foam",      size: "Speckled stoneware", img: "cup-123.jpg", badge: "New" },
  { id: 125, name: "Celadon pebble cup, 230 ml",     type: "tea",        price: 900,  glaze: "Celadon Pebble",  size: "Speckled stoneware", img: "cup-125.jpg" },
  { id: 201, name: "Stone collection, set of 6",     type: "sets",       price: 5900, size: "Six glazes, gift boxed", img: "scene-stone.jpg" },
  { id: 202, name: "Yunomi set of 7",                type: "sets",       price: 5600, size: "Seven glazes, gift boxed", img: "scene-table.jpg" },
  { id: 301, name: "Pebble lantern",                 type: "lamp",       price: 1450, glaze: "Raw terracotta",  size: "Holds a pillar candle",  img: "lamp-pebble-lantern.jpg", badge: "New" },
  { id: 302, name: "Drip glaze bulb lamp",           type: "lamp",       price: 3200, glaze: "Speckled cream",  size: "Brass holder, globe bulb", img: "lamp-drip-bulb.jpg" },
  { id: 303, name: "Sea urchin lamp",                type: "lamp",       price: 3800, glaze: "Bisque white",    size: "Hand-pierced, 22 cm",    img: "lamp-urchin.jpg", badge: "Bestseller" },
  { id: 304, name: "Hive lamp",                      type: "lamp",       price: 4500, glaze: "Unglazed stoneware", size: "On a brick base",     img: "lamp-hive.jpg" },
  { id: 305, name: "Coral tower lamp",               type: "lamp",       price: 5200, glaze: "Ash white",       size: "One of a kind",          img: "lamp-coral.jpg", no: 3 },
  { id: 306, name: "Gourd night lamp",               type: "lamp",       price: 2400, glaze: "Smoked black",    size: "Pierced spiral, 26 cm",  img: "lamp-gourd.jpg", badge: "New" },
  { id: 401, name: "Flower frog bowl",               type: "decor",      price: 1850, glaze: "Ivory",           size: "Holds stems upright",    img: "decor-flower-frog.jpg", ar: "880/1100", badge: "New" },
  { id: 402, name: "Indigo wall pockets, set of 4",  type: "decor",      price: 3400, glaze: "Carved indigo",   size: "Hang on any wall",       img: "decor-wall-pockets.jpg", ar: "880/1100", badge: "Bestseller" },
  { id: 403, name: "Leaf-print wall clock",          type: "decor",      price: 2600, glaze: "Sage slip",       size: "Real leaves pressed in, 30 cm", img: "decor-leaf-clock.jpg", ar: "733/1100" },
  { id: 404, name: "Ridge vase",                     type: "decor",      price: 2200, glaze: "Raw terracotta",  size: "Hand-carved ridges",     img: "decor-ridge-vase.jpg", ar: "883/1100" },
  { id: 405, name: "Ikebana bowl",                   type: "decor",      price: 1650, glaze: "Matte terracotta", size: "Footed, 20 cm",         img: "decor-ikebana-bowl.jpg", ar: "1/1" },
  { id: 406, name: "Drip spoon rest",                type: "decor",      price: 450,  glaze: "White over raw clay", size: "Kitchen counter",    img: "decor-spoon-rests.jpg", ar: "750/1000" },
  { id: 407, name: "Moon crater vase",               type: "decor",      price: 2900, glaze: "Crater white",    size: "One of a kind",          img: "decor-moon-vase.jpg", ar: "1/1", no: 21 },
  { id: 408, name: "Meadow dinner set",              type: "decor",      price: 4800, glaze: "Hand-painted",    size: "2 plates, 2 cups, 2 saucers", img: "decor-dinner-set.jpg", ar: "733/1100" },
];

const FILTERS = [
  { key: "all",        label: "All" },
  { key: "espresso",   label: "Espresso" },
  { key: "cappuccino", label: "Cappuccino" },
  { key: "tea",        label: "Tea cups" },
  { key: "tumbler",    label: "Tumblers" },
  { key: "mug",        label: "Mugs" },
  { key: "bowl",       label: "Chawans" },
  { key: "lamp",       label: "Lamps" },
  { key: "decor",      label: "Home decor" },
  { key: "sets",       label: "Sets" },
  { key: "under1000",  label: "Under ₹999" },
];

// Instagram reels shown as playable videos. Paste reel links here (the account must be public).
const REELS = [
  "https://www.instagram.com/reel/DdtuUwnJEoU/",
];

// ============================================================
const rupees = (n) => "₹" + n.toLocaleString("en-IN");
const byId = (id) => PRODUCTS.find((p) => p.id === id);
const waLink = (text) => `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(text)}`;
const pieceNo = (p) => (p.no ? `No. ${String(p.no).padStart(2, "0")} ` : "");
const fullName = (p) => `${pieceNo(p)}${p.name}${p.glaze ? ` – ${p.glaze}` : ""}`;
const details = (p) => [p.glaze && `${p.glaze} glaze`, p.size].filter(Boolean).join(" · ");
const isSingle = (p) => !["sets", "lamp", "decor"].includes(p.type);
const WA_ICON = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-3.2-.8-2.7-1.1-4.4-3.9-4.5-4.1-.1-.2-1.1-1.4-1.1-2.7s.7-1.9.9-2.2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.7 1.2 1.6 1.9 1.1.9 2 1.2 2.3 1.4.3.1.4.1.6-.1l.8-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.7-.1 1.4z"/></svg>`;

const media = (p) => `<img src="images/${p.img}" alt="${fullName(p)}" loading="lazy">`;

// Shop-wide links
document.querySelectorAll(".js-wa").forEach((a) => {
  a.href = waLink(`Hi ${SHOP.name}! I'd like to know more about your pieces.`);
  a.target = "_blank"; a.rel = "noopener";
});
document.querySelectorAll(".js-insta").forEach((a) => (a.href = `https://instagram.com/${SHOP.instagram}`));
document.querySelectorAll(".js-insta-handle").forEach((a) => (a.textContent = "@" + SHOP.instagram));

// ---------- Hero orbit: a ring of cups and a ring of words around the emblem ----------
const orbitCups = PRODUCTS.filter((p) => !["sets", "lamp", "decor"].includes(p.type) && !p.soldOut).slice(0, 12);
const orbitRing = document.getElementById("orbit-ring");
if (orbitRing) {
  orbitRing.style.setProperty("--step", `${360 / orbitCups.length}deg`);
  orbitRing.innerHTML = orbitCups.map((p, i) => `
    <a class="orb" style="--i: ${i}" href="#catalogue" data-filter="${p.type}" aria-label="${p.name}: see all ${p.type === "bowl" ? "chawans" : p.type + "s"}">
      <span class="orb__in"><img src="images/${p.img}" alt="" loading="eager"></span>
    </a>`).join("");
}
const orbitWords = document.getElementById("orbit-words");
if (orbitWords) {
  const phrase = [..."Hand-thrown · reactive glazes · fired in our kiln · "];
  orbitWords.style.setProperty("--step", `${360 / phrase.length}deg`);
  orbitWords.innerHTML = phrase.map((ch, i) => `<span style="--i: ${i}">${ch === " " ? "&nbsp;" : ch}</span>`).join("");
}

// Fill any placeholder that asks for a product's photo: <span data-cup="104"></span>
document.querySelectorAll("[data-cup]").forEach((el) => (el.innerHTML = media(byId(+el.dataset.cup))));

// ---------- Product cards ----------
function card(p, { code = false } = {}) {
  const label = p.soldOut ? "Sold out" : p.badge;
  const badge = label ? `<span class="badge${label === "Sold out" ? "" : " badge--light"}">${label}</span>` : "";
  const msg = p.soldOut
    ? `Hi ${SHOP.name}! Will ${fullName(p)} (SC-${p.id}) be back in stock?`
    : `Hi ${SHOP.name}! I'd like to order:\n• ${fullName(p)} (SC-${p.id}) – ${rupees(p.price)}\n\nIs it available?`;
  const action = p.soldOut
    ? `<a class="card__add" href="${waLink(msg)}" target="_blank" rel="noopener" style="text-align:center">Ask for restock</a>`
    : `<button class="card__add" data-id="${p.id}">Add to bag</button>
       <a class="card__wa" href="${waLink(msg)}" target="_blank" rel="noopener" aria-label="Order ${p.name} on WhatsApp" title="Order on WhatsApp">${WA_ICON}</a>`;
  return `
    <article class="card${p.soldOut ? " card--soldout" : ""}" data-pid="${p.id}">
      <div class="card__img">
        ${badge}
        ${media(p)}
        <div class="card__quick">${action}</div>
      </div>
      ${code ? `<div class="card__code">SC-${p.id}</div>` : ""}
      <div class="card__info">
        <span class="card__name">${p.no ? `<span class="card__no">${pieceNo(p)}</span>` : ""}${p.name}</span>
        <span class="card__price">${rupees(p.price)}</span>
      </div>
      <div class="card__meta">${details(p)}</div>
    </article>`;
}

// Glaze-name ticker (listed twice so the loop is seamless)
const glazeNames = [...new Set(PRODUCTS.map((p) => p.glaze).filter(Boolean))];
document.getElementById("glazes").innerHTML = [...glazeNames, ...glazeNames].map((g) => `<span>${g}</span>`).join("");

// New from the kiln: cups only, newest first
document.getElementById("wall").innerHTML = PRODUCTS
  .filter(isSingle)
  .sort((a, b) => (b.badge === "New") - (a.badge === "New"))
  .map((p) => card(p)).join("");

// ---------- Lamps: their own after-dark section, with a light switch ----------
const lampGrid = document.getElementById("lamp-grid");
if (lampGrid) {
  lampGrid.innerHTML = PRODUCTS.filter((p) => p.type === "lamp").map((p) => card(p)).join("");
  const lampSection = document.getElementById("lamps");
  const lightSwitch = document.getElementById("light-switch");
  lightSwitch.addEventListener("click", () => {
    const off = lampSection.classList.toggle("lamps--off");
    lightSwitch.setAttribute("aria-pressed", String(!off));
    lightSwitch.querySelector(".switch__label").textContent = off ? "Lights off" : "Lights on";
  });
}
// ---------- Home decor: a gallery wall of staggered columns (3 on wide screens, 2 on phones) ----------
const decorWall = document.getElementById("decor-wall");
if (decorWall) {
  const decorItems = PRODUCTS.filter((p) => p.type === "decor");
  let decorCols = 0;
  const buildDecor = () => {
    const cols = window.matchMedia("(max-width: 640px)").matches ? 2 : 3;
    if (cols === decorCols) return;
    decorCols = cols;
    const buckets = Array.from({ length: cols }, () => []);
    decorItems.forEach((p, i) => buckets[i % cols].push(p));
    decorWall.innerHTML = buckets.map((b) => `<div class="decor__col">${b.map((p) => card(p)).join("")}</div>`).join("");
    decorWall.querySelectorAll(".card").forEach((el) => {
      const p = byId(+el.dataset.pid);
      if (p && p.ar) el.querySelector(".card__img").style.aspectRatio = p.ar; // reserve the photo's real shape
    });
    decorWall.dispatchEvent(new CustomEvent("decor:built"));
  };
  buildDecor();
  window.addEventListener("resize", buildDecor);
}
// ---------- Catalogue: every product, with filters ----------
let activeFilter = "all";
const grid = document.getElementById("grid");
const sortSel = document.getElementById("sort");
const stockSel = document.getElementById("stock");
const chips = document.getElementById("chips");

chips.innerHTML = FILTERS.map((f) =>
  `<button class="chip${f.key === "all" ? " active" : ""}" role="tab" data-filter="${f.key}">${f.label}</button>`
).join("");

function renderGrid() {
  let list = PRODUCTS.filter((p) =>
    activeFilter === "all" ? true : activeFilter === "under1000" ? p.price < 1000 : p.type === activeFilter
  );
  if (stockSel.value === "in") list = list.filter((p) => !p.soldOut);
  if (stockSel.value === "out") list = list.filter((p) => p.soldOut);
  if (sortSel.value === "low") list = [...list].sort((a, b) => a.price - b.price);
  if (sortSel.value === "high") list = [...list].sort((a, b) => b.price - a.price);
  if (sortSel.value === "new") list = [...list].sort((a, b) => (b.badge === "New") - (a.badge === "New") || b.id - a.id);
  if (sortSel.value === "code") list = [...list].sort((a, b) => a.id - b.id);
  document.getElementById("count").textContent = `${list.length} ${list.length === 1 ? "piece" : "pieces"}`;
  const snap = window.fx && window.fx.snapshot(grid); // remember card positions so they can glide
  grid.innerHTML = list.length
    ? list.map((p) => card(p, { code: true })).join("")
    : `<p class="grid__empty">Nothing here right now. <a href="#" class="js-wa-inline">Ask us on WhatsApp</a> about the next batch.</p>`;
  grid.querySelectorAll(".js-wa-inline").forEach((a) => {
    a.href = waLink(`Hi ${SHOP.name}! When is the next batch coming?`); a.target = "_blank";
  });
  // Cards arrive one after another
  grid.querySelectorAll(".card").forEach((c, i) => (c.style.animationDelay = `${Math.min(i, 12) * 45}ms`));
  if (snap) window.fx.flip(grid, snap);
}

function setFilter(key) {
  activeFilter = key;
  chips.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c.dataset.filter === key));
  renderGrid();
}

chips.addEventListener("click", (e) => { if (e.target.dataset.filter) setFilter(e.target.dataset.filter); });
sortSel.addEventListener("change", renderGrid);
stockSel.addEventListener("change", renderGrid);
document.querySelectorAll("a[data-filter], button[data-filter]:not(.chip)").forEach((el) =>
  el.addEventListener("click", () => setFilter(el.dataset.filter))
);
renderGrid();

// ---------- Instagram reels (official embed) ----------
const reelsEl = document.getElementById("reels");
if (REELS.length) {
  reelsEl.innerHTML = REELS.map((url) => {
    const link = url.split("?")[0];
    // Shown until Instagram's script swaps it for the playable reel (or if it's blocked)
    return `
      <blockquote class="instagram-media" data-instgrm-permalink="${link}?utm_source=ig_embed" data-instgrm-version="14">
        <a class="reel-fallback" href="${link}" target="_blank" rel="noopener">
          <span class="reel-fallback__play">▶</span>
          <span>Watch this reel on Instagram</span>
        </a>
      </blockquote>`;
  }).join("");
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://www.instagram.com/embed.js";
  s.onload = () => window.instgrm && window.instgrm.Embeds.process();
  document.body.appendChild(s);
} else {
  reelsEl.remove();
}

// ---------- Bag (orders are sent on WhatsApp) ----------
let bag = {};
try { bag = JSON.parse(localStorage.getItem("clayrity-bag")) || {}; } catch { bag = {}; }

const drawer = document.getElementById("drawer");
const scrim = document.getElementById("scrim");
const bagItems = document.getElementById("bag-items");
const bagBtn = document.getElementById("bag-open");

function saveBag() {
  try { localStorage.setItem("clayrity-bag", JSON.stringify(bag)); } catch {}
}

function bagLines() {
  return Object.entries(bag).map(([id, qty]) => ({ p: byId(+id), qty })).filter((l) => l.p && !l.p.soldOut);
}

function renderBag() {
  const lines = bagLines();
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const total = lines.reduce((n, l) => n + l.qty * l.p.price, 0);
  document.getElementById("bag-count").textContent = count;
  document.getElementById("bag-total").textContent = rupees(total);
  document.getElementById("send-order").disabled = !count;
  bagItems.innerHTML = count
    ? lines.map(({ p, qty }) => `
        <div class="line">
          <span class="line__img">${media(p)}</span>
          <div>
            <div class="line__name">${pieceNo(p)}${p.name}</div>
            <div class="line__price">${details(p)} · ${rupees(p.price)}</div>
          </div>
          <div class="qty">
            <button data-dec="${p.id}" aria-label="Remove one">−</button>
            <span>${qty}</span>
            <button data-inc="${p.id}" aria-label="Add one">+</button>
          </div>
        </div>`).join("")
    : `<div class="drawer__empty"><b>Your bag is empty</b>Add a few pieces you love, then send the order to us on WhatsApp.</div>`;
}

function openBag() {
  drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); scrim.hidden = false;
}
function closeBag() {
  drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); scrim.hidden = true;
}

let toastTimer;
function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg; t.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
}

document.addEventListener("click", (e) => {
  const add = e.target.closest(".card__add[data-id]");
  if (add) {
    const id = +add.dataset.id;
    bag[id] = (bag[id] || 0) + 1;
    saveBag(); renderBag();
    add.textContent = "Added ✓"; add.classList.add("added");
    setTimeout(() => { add.textContent = "Add to bag"; add.classList.remove("added"); }, 1200);
    flyToBag(add.closest(".card").querySelector(".card__img img"));
    toast(`${byId(id).name} added to your bag`);
    return;
  }
  const inc = e.target.closest("[data-inc]");
  const dec = e.target.closest("[data-dec]");
  if (inc) { bag[inc.dataset.inc]++; saveBag(); renderBag(); }
  if (dec) {
    const id = dec.dataset.dec;
    if (--bag[id] <= 0) delete bag[id];
    saveBag(); renderBag();
  }
});

bagBtn.addEventListener("click", openBag);
document.getElementById("bag-close").addEventListener("click", closeBag);
scrim.addEventListener("click", closeBag);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeBag(); });

document.getElementById("order-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const lines = bagLines();
  if (!lines.length) return;
  const f = new FormData(e.target);
  const total = lines.reduce((n, l) => n + l.qty * l.p.price, 0);
  const text = [
    `Hi ${SHOP.name}! I'd like to place an order:`,
    "",
    ...lines.map((l, i) => `${i + 1}. ${fullName(l.p)} (SC-${l.p.id}) × ${l.qty} = ${rupees(l.qty * l.p.price)}`),
    "",
    `Subtotal: ${rupees(total)}`,
    `Name: ${f.get("name")}`,
    `Deliver to: ${f.get("city")}`,
    f.get("note") ? `Note: ${f.get("note")}` : "",
    "",
    "Please confirm availability and shipping. Thank you!",
  ].filter((s, i, arr) => s !== "" || arr[i - 1] !== "").join("\n");
  window.open(waLink(text), "_blank");
});

renderBag();

// ---------- Bulk enquiry → WhatsApp ----------
document.getElementById("bulk-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(e.target);
  const text = `Hi ${SHOP.name}! Bulk / custom enquiry:\nName: ${f.get("name")}\nFor: ${f.get("type")}\nQuantity: ${f.get("qty") || "—"}\n${f.get("msg") || ""}`;
  window.open(waLink(text.trim()), "_blank");
});

// ---------- Drag-to-scroll product row ----------
const wall = document.getElementById("wall");
let down = false, startX = 0, startScroll = 0, moved = false;
wall.addEventListener("pointerdown", (e) => {
  if (e.pointerType !== "mouse" || e.target.closest("button, a")) return;
  down = true; moved = false; startX = e.clientX; startScroll = wall.scrollLeft;
});
window.addEventListener("pointermove", (e) => {
  if (!down) return;
  const dx = e.clientX - startX;
  if (Math.abs(dx) > 4) { moved = true; wall.classList.add("dragging"); }
  wall.scrollLeft = startScroll - dx;
});
window.addEventListener("pointerup", () => { down = false; wall.classList.remove("dragging"); });
wall.addEventListener("click", (e) => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);
document.querySelectorAll(".wall__nav .arrow").forEach((btn) =>
  btn.addEventListener("click", () => wall.scrollBy({ left: +btn.dataset.dir * 600, behavior: "smooth" }))
);

// ---------- Mobile menu ----------
const menuBtn = document.querySelector(".menu-btn");
const nav = document.getElementById("nav");
menuBtn.addEventListener("click", () => menuBtn.setAttribute("aria-expanded", nav.classList.toggle("open")));
nav.addEventListener("click", (e) => { if (e.target.tagName === "A") nav.classList.remove("open"); });

// ============================================================
//  MOTION (all of it is skipped when the visitor prefers reduced motion)
// ============================================================
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const fxOn = !!window.Motion && !reduceMotion; // fx.js (Motion) handles reveals and parallax

// ---------- Scroll reveal: sections ease in, siblings one after another ----------
document.querySelectorAll(
  ".section-head, .cat, .promise__inner > div, .care > div, .reels, .bulk__inner > *, .footer__inner > div"
).forEach((el) => el.classList.add("reveal"));

const io = "IntersectionObserver" in window && !reduceMotion && !fxOn && new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
document.querySelectorAll(".reveal").forEach((el) => {
  const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
  el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 5) * 90}ms`;
  io ? io.observe(el) : el.classList.add("in");
});

// ---------- Header hides on the way down, returns on the way up ----------
const header = document.querySelector(".header");
const bannerImg = document.querySelector(".banner img");
let lastY = window.scrollY, ticking = false;

function onScroll() {
  const y = window.scrollY;
  header.classList.toggle("is-scrolled", y > 8);
  const goingDown = y > lastY + 4, goingUp = y < lastY - 4;
  if (goingDown && y > 240 && !nav.classList.contains("open")) header.classList.add("is-hidden");
  if (goingUp || y < 240) header.classList.remove("is-hidden");
  lastY = y;

  // Banner parallax: the photo moves a little slower than the page
  if (bannerImg && !reduceMotion && !fxOn) {
    const r = bannerImg.parentElement.getBoundingClientRect();
    if (r.bottom > 0 && r.top < innerHeight) {
      const progress = (r.top + r.height / 2 - innerHeight / 2) / innerHeight; // -1 … 1 across the screen
      bannerImg.style.transform = `translateY(${(progress * -8).toFixed(2)}%)`;
    }
  }
  ticking = false;
}
window.addEventListener("scroll", () => {
  if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
}, { passive: true });
onScroll();

// ---------- Added items fly into the bag ----------
function flyToBag(img) {
  const bump = () => { bagBtn.classList.remove("bump"); void bagBtn.offsetWidth; bagBtn.classList.add("bump"); };
  // Bring the header back so the bag is on screen; aim where it will land
  const wasHidden = header.classList.contains("is-hidden");
  header.classList.remove("is-hidden");
  if (!img || reduceMotion || !img.animate) return bump();
  const from = img.getBoundingClientRect(), bagRect = bagBtn.getBoundingClientRect();
  const to = { left: bagRect.left, width: bagRect.width, height: bagRect.height, top: bagRect.top + (wasHidden ? header.offsetHeight : 0) };
  const ghost = img.cloneNode();
  ghost.className = "fly";
  Object.assign(ghost.style, { left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px` });
  document.body.appendChild(ghost);
  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  ghost.animate([
    { transform: "translate(0, 0) scale(1)", opacity: 1, borderRadius: "4px" },
    { transform: `translate(${dx * 0.55}px, ${dy * 0.35 - 60}px) scale(.45)`, opacity: 1, offset: 0.55 },
    { transform: `translate(${dx}px, ${dy}px) scale(.06)`, opacity: .3, borderRadius: "50%" },
  ], { duration: 750, easing: "cubic-bezier(.5, 0, .3, 1)" }).onfinish = () => { ghost.remove(); bump(); };
}
