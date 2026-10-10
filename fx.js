// ============================================================
//  Studio Clayrity: motion layer, built on Motion (motion.dev),
//  the framework-free edition of Framer Motion.
//  Runs only when Motion loaded and the visitor hasn't asked for reduced motion;
//  otherwise the simpler CSS animations in styles.css stay in charge.
//  The circle of the logo emblem is the recurring motif: the intro closes into it,
//  the hero photo and the making-of photos open out of it, catalogue photos iris open.
// ============================================================
(() => {
  if (!window.Motion || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  try {
  const { animate, inView, stagger } = window.Motion;
  document.documentElement.classList.add("fx");

  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const small = matchMedia("(max-width: 640px)").matches; // phones get lighter versions of a few effects
  const easeOut = [0.22, 1, 0.36, 1];
  const easeInOut = [0.65, 0, 0.35, 1];
  const softSpring = { type: "spring", stiffness: 110, damping: 20, mass: 0.9 };
  const snappySpring = { type: "spring", stiffness: 260, damping: 22 };
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const circle = (r, x = 50, y = 50) => `circle(${r}% at ${x}% ${y}%)`;
  const rand = (lo, hi) => lo + Math.random() * (hi - lo);

  // Wrap each word (or letter) in a mask so it can slide up into view.
  // "3d" splits into unmasked letters that can rotate in space (masks would flatten them).
  function split(el, by = "word") {
    const text = el.textContent.trim();
    el.setAttribute("aria-label", text);
    if (by === "3d") {
      el.innerHTML = [...text].map((p) => `<span class="l3" aria-hidden="true">${p === " " ? "&nbsp;" : p}</span>`).join("");
      return $$(".l3", el);
    }
    const parts = by === "letter" ? [...text] : text.split(/\s+/);
    el.innerHTML = parts
      .map((p) => (p === " " ? " " : `<span class="w" aria-hidden="true"><span class="w__in">${p}</span></span>`)) // a real space lets long names wrap
      .join(by === "letter" ? "" : " ");
    return $$(".w__in", el);
  }

  // Build solid 3D letters. Each letter = a glazed face + `depth` clay layers stacked behind it.
  // Words stay together so the title can still wrap on narrow screens.
  function buildSolidTitle(el, depth) {
    const text = el.textContent.trim();
    el.setAttribute("aria-label", text);
    const clay = (k) => { // light terracotta at the front to dark fired clay at the back
      const a = [208, 134, 100], b = [94, 47, 28], f = k / Math.max(1, depth - 1);
      return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * f)).join(",")})`;
    };
    let i = 0;
    el.innerHTML = text.split(/\s+/).map((word) => `<span class="t3w">${[...word].map((ch) => {
      const sides = Array.from({ length: depth }, (_, k) =>
        `<span class="t3__side" style="--d:${k + 1};color:${clay(k)}">${ch}</span>`).join("");
      return `<span class="t3" style="--i:${i++}" aria-hidden="true"><span class="t3__in">${sides}<span class="t3__face">${ch}</span></span></span>`;
    }).join("")}</span>`).join(" ");
    return $$(".t3", el);
  }
  // ---------- Intro: emblem and name appear, then the curtain closes into the emblem's circle ----------
  let seen = false;
  try { seen = sessionStorage.getItem("clayrity-intro") === "1"; sessionStorage.setItem("clayrity-intro", "1"); } catch {}
  let introDone = Promise.resolve();
  if (!seen && scrollY < 50) {
    const intro = document.createElement("div");
    intro.className = "intro";
    intro.innerHTML = `
      <div class="intro__inner">
        <div class="intro__emblem">
          <svg class="intro__ring" viewBox="0 0 100 100"><circle cx="50" cy="50" r="49" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg>
          <img src="images/logo-emblem.png" alt="">
        </div>
        <div class="intro__mark">Studio Clayrity</div>
        <div class="intro__sub">Hand-thrown ceramics</div>
      </div>`;
    document.body.appendChild(intro);
    const emblem = $(".intro__emblem img", intro);
    const ring = $(".intro__ring circle", intro);
    const introMark = $(".intro__mark", intro);
    const letters = split(introMark, "3d");
    emblem.style.opacity = 0;
    letters.forEach((l) => { l.style.opacity = 0; l.style.transform = "rotateX(-100deg) translateZ(-120px)"; });
    introMark.style.transform = "rotateY(-24deg) rotateX(10deg)";
    $(".intro__sub", intro).style.opacity = 0;

    introDone = new Promise((resolve) => {
     try {
      let finished = false;
      const lift = () => {
        if (finished) return;
        finished = true;
        // Close the curtain into the emblem: a shrinking circle centred on it
        const r = emblem.getBoundingClientRect();
        const x = ((r.left + r.width / 2) / innerWidth) * 100, y = ((r.top + r.height / 2) / innerHeight) * 100;
        try {
          animate(intro, { clipPath: [circle(150, x, y), circle(0, x, y)] }, { duration: 1.1, ease: easeInOut })
            .then(() => intro.remove());
        } catch { intro.remove(); }
        setTimeout(resolve, 380); // the hero starts opening while the curtain closes
      };
      intro.addEventListener("click", lift);
      setTimeout(() => { if (intro.isConnected) intro.remove(); resolve(); }, 4000); // hard stop
      animate(emblem, { opacity: [0, 1], scale: [0.7, 1], rotate: [-25, 0] }, { type: "spring", stiffness: 120, damping: 14, delay: 0.1 });
      animate(ring, { strokeDashoffset: [1, 0] }, { duration: 1.2, ease: easeInOut, delay: 0.2 });
      animate(letters, { rotateX: [-100, 0], z: [-120, 0], opacity: [0, 1] },
        { type: "spring", stiffness: 140, damping: 14, delay: stagger(0.045, { startDelay: 0.45 }) });
      animate(introMark, { rotateY: [-24, 0], rotateX: [10, 0] }, { duration: 1.6, ease: easeOut, delay: 0.35 });
      animate($(".intro__sub", intro), { opacity: [0, 1], y: [8, 0] }, { duration: 0.6, delay: 1.1 });
      setTimeout(lift, 2300);
     } catch (err) {
      // The intro failed on this browser: drop it and show the plain page
      console.error("Intro stopped:", err);
      intro.remove();
      resolve();
      setTimeout(plainPage, 0);
     }
    });
  }

  // ---------- Hero: a 3D orbit. The coin spins, the ring of cups turns, drag to spin it ----------
  const hero = $(".hero");
  const orbit = $("#orbit");
  const tiltEl = $(".orbit__tilt");
  const ringEl = $("#orbit-ring");
  const wordsEl = $("#orbit-words");
  const coinWrap = $(".coin");
  const coinSpin = $("#coin");
  const heroHead = $(".hero__head");
  const heroFoot = $(".hero__foot");
  const heroTitle = $(".hero__title");
  // The title is built as solid 3D letters: a glazed front face plus stacked clay layers behind it
  const titleLetters = buildSolidTitle(heroTitle, small ? 7 : 13);
  const titleCores = titleLetters.map((l) => $(".t3__in", l));
  const orbIns = $$(".orb__in", ringEl);
  const heroEyebrow = $(".eyebrow", heroHead);
  const footBits = [...heroFoot.children];

  titleLetters.forEach((l) => { l.style.opacity = 0; l.style.transform = "translateZ(-700px)"; });
  orbIns.forEach((o) => (o.style.opacity = 0));
  [coinWrap, wordsEl, heroEyebrow, ...footBits].forEach((el) => (el.style.opacity = 0));

  let ringA = 0, coinA = 0, coinBoost = 0, vel = 0, heroP = 0, titleSettled = Infinity, ripple = 0;
  let otx = 0, oty = 0, aimX = 0, aimY = 0, dragging = false, dragDist = 0, lastX = 0, lastT = 0, running = false, frameT = 0;

  introDone.then(() => {
    coinBoost = 900; // the coin arrives spinning fast, then settles
    animate(coinWrap, { opacity: [0, 1], scale: [0.2, 1] }, { type: "spring", stiffness: 90, damping: 12 });
    animate(orbIns, { opacity: [0, 1], scale: [0.3, 1], y: [60, 0] }, { type: "spring", stiffness: 120, damping: 15, delay: stagger(0.06, { startDelay: 0.25 }) });
    animate(wordsEl, { opacity: [0, 1] }, { duration: 1.2, delay: 0.9 });
    animate(heroEyebrow, { opacity: [0, 1], y: [12, 0] }, { duration: 0.8, ease: easeOut, delay: 0.2 });
    // Letters fly in from deep in the scene, tumbling, and lock into place
    titleLetters.forEach((l, i) => {
      animate(l, { z: [-700, 0], rotateY: [rand(-140, 140), 0], rotateX: [rand(-70, 70), 0], opacity: [0, 1] },
        { type: "spring", stiffness: 70, damping: 11, mass: 0.9, delay: 0.3 + i * 0.055 });
    });
    titleSettled = performance.now() + 2200; // the idle ripple starts once they've landed
    animate(footBits, { opacity: [0, 1], y: [18, 0] }, { duration: 0.9, ease: easeOut, delay: stagger(0.12, { startDelay: 1.1 }) });
  });

  function orbitFrame(t) {
    if (!running) return;
    const dt = Math.min((t - frameT) / 1000, 0.05) || 0.016;
    frameT = t;
    if (!dragging) { ringA += (14 + vel) * dt; vel *= 0.95; }
    coinA += (40 + coinBoost) * dt;
    coinBoost *= 0.965;
    otx += (aimX - otx) * 0.06;
    oty += (aimY - oty) * 0.06;
    tiltEl.style.transform =
      `translateZ(${(-240 - 520 * heroP).toFixed(1)}px) rotateX(${(-22 + oty - 18 * heroP).toFixed(2)}deg) rotateY(${otx.toFixed(2)}deg)`;
    ringEl.style.transform = `rotateY(${ringA.toFixed(2)}deg)`;
    wordsEl.style.transform = `rotateY(${(-ringA * 1.6).toFixed(2)}deg)`;
    coinSpin.style.transform = `rotateY(${coinA.toFixed(2)}deg)`;
    // Title: a slow 3D sway (so its depth shows) plus a lean toward the mouse
    const sec = t / 1000;
    const swayY = Math.sin(sec * 0.55) * (small ? 9 : 14), swayX = Math.sin(sec * 0.37) * 5;
    heroTitle.style.transform = `rotateX(${(swayX + oty * 1.4).toFixed(2)}deg) rotateY(${(swayY + otx * 1.3).toFixed(2)}deg)`;
    // A gentle ripple runs through the letters, each lifting toward you in turn
    if (t > titleSettled) {
      ripple = Math.min(1, ripple + dt * 0.6);
      titleCores.forEach((c, i) => {
        const w = Math.sin(sec * 1.8 - i * 0.45);
        c.style.transform = `translateZ(${(w * 14 * ripple).toFixed(1)}px) rotateX(${(w * -6 * ripple).toFixed(2)}deg)`;
      });
    }
    requestAnimationFrame(orbitFrame);
  }
  inView(hero, () => {
    running = true; frameT = performance.now(); requestAnimationFrame(orbitFrame);
    return () => (running = false);
  });

  // Drag (or swipe) sideways to spin the ring; it keeps turning with momentum
  orbit.addEventListener("pointerdown", (e) => {
    dragging = true; dragDist = 0; lastX = e.clientX; lastT = performance.now(); vel = 0;
  });
  addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const now = performance.now();
    const dx = e.clientX - lastX;
    ringA += dx * 0.35;
    dragDist += Math.abs(dx);
    vel = (dx * 0.35) / Math.max((now - lastT) / 1000, 0.008);
    vel = Math.max(-600, Math.min(600, vel));
    lastX = e.clientX; lastT = now;
  }, { passive: true });
  const endDrag = () => { dragging = false; };
  addEventListener("pointerup", endDrag);
  addEventListener("pointercancel", endDrag);
  orbit.addEventListener("click", (e) => { if (dragDist > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
  if (finePointer) {
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      aimX = ((e.clientX - r.left) / r.width - 0.5) * 16;
      aimY = ((e.clientY - r.top) / r.height - 0.5) * -10;
    });
    hero.addEventListener("pointerleave", () => { aimX = 0; aimY = 0; });
  }
  if (finePointer) {
    titleLetters.forEach((l) => {
      let spinning = false;
      l.addEventListener("pointerenter", () => {
        if (spinning || performance.now() < titleSettled) return;
        spinning = true;
        animate(l, { rotateY: [0, 360], z: [0, 60, 0] }, { duration: 1.1, ease: [0.65, 0, 0.35, 1] }).then(() => (spinning = false));
      });
    });
  }
  // ---------- Header logo: emblem spins in, letters flip into place; hover rolls a 3D wave ----------
  const logo = $(".header .logo");
  const brandEmblem = $(".header .brand__emblem");
  if (logo) {
    const logoLetters = split(logo, "3d");
    logoLetters.forEach((l) => { l.style.opacity = 0; l.style.transform = "rotateY(90deg)"; });
    if (brandEmblem) brandEmblem.style.opacity = 0;
    introDone.then(() => {
      if (brandEmblem) animate(brandEmblem, { opacity: [0, 1], rotate: [-180, 0], scale: [0.5, 1] }, { ...softSpring, delay: 0.2 });
      animate(logoLetters, { rotateY: [90, 0], opacity: [0, 1] }, { type: "spring", stiffness: 180, damping: 16, delay: stagger(0.04, { startDelay: 0.3 }) });
    });
    let rolling = false;
    $(".header .brand").addEventListener("pointerenter", () => {
      if (rolling) return;
      rolling = true;
      if (brandEmblem) animate(brandEmblem, { rotate: [0, 360] }, { duration: 1, ease: easeInOut });
      animate(logoLetters, { rotateX: [0, 360], z: [0, 30, 0] }, { duration: 0.9, ease: easeInOut, delay: stagger(0.035) })
        .then(() => (rolling = false));
    });
  }

  // ---------- Scroll-linked layers: hero, making-of sequence, banner, progress line ----------
  const banner = $(".banner");
  const bannerImg = banner && $("img", banner);
  const bannerText = banner && $(".banner__text", banner);
  const bar = document.createElement("div");
  bar.className = "progress";
  document.body.appendChild(bar);

  // Making-of sequence
  const process = $(".process");
  const pImgs = process ? $$(".process__img", process) : [];
  const pPics = pImgs.map((f) => $("img", f));
  const pSteps = process ? $$(".process__step", process) : [];
  const pMeter = process ? $$(".process__meter span", process) : [];
  const pMark = process && $(".process__mark", process);
  const n = pSteps.length;

  function drawProcess() {
    const r = process.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    const travel = Math.max(1, r.height - innerHeight);
    const pos = clamp01(-r.top / travel) * n; // 0 … n through the section
    pImgs.forEach((f, i) => {
      // Each photo opens out of a circle as its step begins (the first is open from the start)
      const t = i === 0 ? 1 : clamp01((pos - i + 0.35) / 0.5);
      f.style.clipPath = t >= 1 ? "none" : circle(t * 75, 50, 50);
      f.style.zIndex = i;
      // A slow push-in while the photo is on screen
      const life = clamp01((pos - i + 0.35) / 1.35);
      pPics[i].style.transform = `scale(${(1.14 - 0.1 * life).toFixed(3)})`;
    });
    // The lamp motif blooms at each change of photo
    if (pMark) {
      const frac = pos - Math.floor(pos);
      const near = Math.floor(pos) > 0 && Math.floor(pos) < n ? Math.max(0, 1 - Math.abs(frac - 0.15) / 0.2) : 0;
      pMark.style.opacity = (near * 0.9).toFixed(3);
      pMark.style.transform = `scale(${(0.7 + near * 0.3).toFixed(3)})`;
    }
    pSteps.forEach((s, i) => {
      let rel = pos - (i + 0.5); // 0 when this step is centred
      if ((i === 0 && rel < 0) || (i === n - 1 && rel > 0)) rel = 0; // first and last steps stay put at the ends
      const o = clamp01(1 - Math.abs(rel) * 1.9);
      s.style.opacity = o.toFixed(3);
      s.style.transform = `translateY(${(rel * -70).toFixed(1)}px)`;
      s.style.visibility = o > 0.01 ? "visible" : "hidden";
    });
    pMeter.forEach((m, i) => m.style.setProperty("--fill", clamp01(pos - i).toFixed(3)));
  }

  function onScrollFrame() {
    const y = scrollY;
    // Hero: the orbit sinks back into the distance (see orbitFrame); text lifts and fades
    heroP = clamp01(y / (hero.offsetTop + hero.offsetHeight));
    heroHead.style.transform = `translateY(${(-60 * heroP).toFixed(1)}px)`;
    heroHead.style.opacity = (1 - 1.3 * heroP).toFixed(3);
    heroFoot.style.opacity = (1 - 1.6 * heroP).toFixed(3);
    if (process) drawProcess();
    if (banner) {
      const r = banner.getBoundingClientRect();
      if (r.bottom > -100 && r.top < innerHeight + 100) {
        const bp = clamp01((innerHeight - r.top) / (innerHeight + r.height));
        bannerImg.style.transform = `translateY(${(-9 + 18 * bp).toFixed(2)}%) scale(${(1.14 - 0.12 * bp).toFixed(3)})`;
        bannerText.style.transform = `translateY(${(70 - 140 * bp).toFixed(1)}px)`;
      }
    }
    bar.style.transform = `scaleX(${clamp01(y / Math.max(1, document.documentElement.scrollHeight - innerHeight)).toFixed(4)})`;
  }
  let scrollQueued = false;
  addEventListener("scroll", () => {
    if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(() => { scrollQueued = false; onScrollFrame(); }); }
  }, { passive: true });
  addEventListener("resize", onScrollFrame);
  onScrollFrame();

  // ---------- Reveals: sections rise in; headings arrive word by word ----------
  const headings = $$(".section-head h2, .banner h2, .story__intro h2, .bulk h2").filter((h) => !h.children.length);
  const headingWords = new Map(headings.map((h) => [h, split(h)]));
  headingWords.forEach((words) => words.forEach((w) => (w.style.transform = "translateY(110%)")));
  headingWords.forEach((words, h) => {
    const stop = inView(h, () => {
      stop();
      introDone.then(() => animate(words, { y: ["110%", "0%"] }, { ...softSpring, delay: stagger(0.06) }));
    }, { margin: "0px 0px -8% 0px" });
  });

  $$(".reveal").forEach((el) => {
    el.style.opacity = 0;
    el.style.transform = "translateY(36px)";
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
    const order = Math.min(siblings.indexOf(el), 5);
    const stop = inView(el, () => {
      stop();
      introDone.then(() => animate(el, { opacity: [0, 1], y: [36, 0] }, { ...softSpring, delay: order * 0.08 }));
    }, { margin: "0px 0px -8% 0px" });
  });

  // ---------- Promise strip: the icons draw themselves in, one after another ----------
  const promiseItems = $$(".promise__item");
  if (promiseItems.length) {
    const stopPromise = inView(".promise", () => {
      stopPromise();
      introDone.then(() => promiseItems.forEach((it, i) => setTimeout(() => it.classList.add("is-drawn"), 350 + i * 170)));
    }, { margin: "0px 0px -10% 0px" });
  }
  // ---------- Catalogue entrance: cards rise softly, photos iris open like the emblem ----------
  const IRIS_CLOSED = circle(0, 50, 55), IRIS_OPEN = circle(85, 50, 55);
  function revealCards(cards) {
    cards.forEach((c, i) => {
      const d = (i % 4) * 0.08;
      animate(c, { opacity: [0, 1], y: [28, 0] }, { duration: 0.9, ease: easeOut, delay: d });
      const img = $(".card__img > img", c);
      if (img) {
        animate(img, { clipPath: [IRIS_CLOSED, IRIS_OPEN] }, { duration: 1.1, ease: easeInOut, delay: d + 0.05 });
        animate(img, { scale: [1.12, 1] }, { duration: 1.4, ease: easeOut, delay: d + 0.05 });
      }
    });
  }
  const gridEl = $("#grid");
  const firstCards = $$(".card", gridEl);
  firstCards.forEach((c) => {
    c.style.opacity = 0;
    const img = $(".card__img > img", c);
    if (img) img.style.clipPath = IRIS_CLOSED;
  });
  const rows = [];
  firstCards.forEach((c, i) => (rows[Math.floor(i / 4)] = rows[Math.floor(i / 4)] || []).push(c));
  rows.forEach((row) => {
    const stop = inView(row[0], () => { stop(); introDone.then(() => revealCards(row)); }, { margin: "0px 0px -8% 0px" });
  });

  const wallCards = $$("#wall .card");
  wallCards.forEach((c) => { c.style.opacity = 0; c.style.transform = "translateX(60px)"; });
  const stopWall = inView("#wall", () => {
    stopWall();
    introDone.then(() => animate(wallCards, { opacity: [0, 1], x: [60, 0] }, { duration: 1, ease: easeOut, delay: stagger(0.06) }));
  }, { margin: "0px 0px -10% 0px" });

  // ---------- Catalogue filtering: leavers fade out in place, stayers glide, newcomers iris in ----------
  const countEl = $("#count");
  let shownCount = $$(".card", gridEl).length;
  const countText = (k) => `${k} ${k === 1 ? "piece" : "pieces"}`;

  window.fx = {
    snapshot(grid) {
      const cards = new Map();
      $$(".card", grid).forEach((c) => cards.set(c.dataset.pid, { rect: c.getBoundingClientRect(), node: c.cloneNode(true) }));
      return cards;
    },
    flip(grid, before) {
      const after = new Set();
      let fresh = 0;
      $$(".card", grid).forEach((c) => {
        after.add(c.dataset.pid);
        const was = before.get(c.dataset.pid);
        if (was) {
          const now = c.getBoundingClientRect();
          const dx = was.rect.left - now.left, dy = was.rect.top - now.top;
          if (dx || dy) animate(c, { x: [dx, 0], y: [dy, 0] }, { type: "spring", stiffness: 140, damping: 22 });
        } else {
          const d = 0.12 + Math.min(fresh++, 12) * 0.05;
          animate(c, { opacity: [0, 1], y: [16, 0] }, { duration: 0.7, ease: easeOut, delay: d });
          const img = $(".card__img > img", c);
          if (img) animate(img, { clipPath: [IRIS_CLOSED, IRIS_OPEN], scale: [1.08, 1] }, { duration: 0.9, ease: easeInOut, delay: d });
        }
      });

      // A copy of each card that left fades and settles where it stood
      before.forEach(({ rect, node }, pid) => {
        if (after.has(pid) || rect.bottom < 0 || rect.top > innerHeight) return;
        Object.assign(node.style, {
          position: "fixed", left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px`,
          margin: 0, zIndex: 45, pointerEvents: "none", opacity: "", transform: "",
        });
        document.body.appendChild(node);
        animate(node, { opacity: [1, 0], scale: [1, 0.96], y: [0, 10] }, { duration: 0.35, ease: [0.4, 0, 1, 1] }).then(() => node.remove());
      });

      const target = $$(".card", grid).length;
      const from = shownCount;
      shownCount = target;
      animate(from, target, { duration: 0.6, ease: easeOut, onUpdate: (v) => (countEl.textContent = countText(Math.round(v))) });
    },
  };

  // One underline glides between the catalogue tabs
  const chipsEl = $("#chips");
  if (chipsEl) {
    const underline = document.createElement("span");
    underline.className = "chips__bar";
    chipsEl.appendChild(underline);
    let first = true;
    const moveBar = () => {
      const active = $(".chip.active", chipsEl);
      if (!active) return;
      const to = { x: active.offsetLeft, width: active.offsetWidth };
      if (first) { first = false; underline.style.transform = `translateX(${to.x}px)`; underline.style.width = `${to.width}px`; return; }
      animate(underline, to, { type: "spring", stiffness: 380, damping: 32 });
      chipsEl.scrollTo({ left: active.offsetLeft - 24, behavior: "smooth" });
    };
    new MutationObserver(moveBar).observe(chipsEl, { subtree: true, attributes: true, attributeFilter: ["class"] });
    addEventListener("resize", () => { first = true; moveBar(); });
    moveBar();
  }

  // ---------- Glaze ticker: drifts, speeds up with scrolling, follows its direction ----------
  const ticker = $(".glazes");
  const track = $(".glazes__track");
  if (ticker && track) {
    let x = 0, vel = 0, dir = 1, slow = 1, slowTarget = 1, running = false;
    let lastT = performance.now(), lastY = scrollY;
    const tick = (t) => {
      if (!running) return;
      const dt = Math.min((t - lastT) / 1000, 0.05);
      lastT = t;
      const dy = (scrollY - lastY) / Math.max(dt, 0.001);
      lastY = scrollY;
      vel += (dy - vel) * 0.12;
      if (Math.abs(dy) > 20) dir = dy > 0 ? 1 : -1;
      slow += (slowTarget - slow) * 0.08;
      const speed = (40 + Math.min(Math.abs(vel) * 0.45, 800)) * slow;
      x -= speed * dt * dir;
      const half = track.scrollWidth / 2;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      const skew = small ? 0 : Math.max(-8, Math.min(8, vel * -0.005)) * slow;
      track.style.transform = `translateX(${x.toFixed(1)}px) skewX(${skew.toFixed(2)}deg)`;
      requestAnimationFrame(tick);
    };
    inView(ticker, () => {
      running = true; lastT = performance.now(); lastY = scrollY; requestAnimationFrame(tick);
      return () => (running = false);
    });
    ticker.addEventListener("pointerenter", () => (slowTarget = 0.15));
    ticker.addEventListener("pointerleave", () => (slowTarget = 1));
  }

  // ---------- Footer wordmark: a solid 3D block that tips up, follows the mouse, letters pop out ----------
  const mark = $(".footer__mark");
  if (mark) {
    mark.innerHTML = `<span class="mark3d">${mark.textContent.trim()}</span>`;
    const block = $(".mark3d", mark);
    const letters = split(block, "3d");
    letters.forEach((l) => { l.style.opacity = 0; l.style.transform = "rotateX(-90deg) translateY(60px)"; });
    const stop = inView(mark, () => {
      stop();
      animate(letters, { rotateX: [-90, 0], y: [60, 0], opacity: [0, 1] },
        { type: "spring", stiffness: 120, damping: 13, delay: stagger(0.05) });
    }, { margin: "0px 0px -5% 0px" });

    let mx = 0, my = 0, rx = 0, ry = 0, live = false;
    const loop = () => {
      if (!live) return;
      const toEnd = document.documentElement.scrollHeight - (scrollY + innerHeight);
      const tip = clamp01(toEnd / (innerHeight * 0.55)); // lies back until you reach the bottom
      rx += (my * -14 - rx) * 0.08;
      ry += (mx * 22 - ry) * 0.08;
      block.style.transform = `rotateX(${(tip * 62 + rx).toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      requestAnimationFrame(loop);
    };
    inView(mark, () => { live = true; requestAnimationFrame(loop); return () => (live = false); }, { margin: "200px 0px 0px 0px" });
    if (finePointer) {
      addEventListener("pointermove", (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; }, { passive: true });
      letters.forEach((l) => l.addEventListener("pointerenter", () =>
        animate(l, { z: [0, 90, 0], rotateX: [0, -28, 0], color: ["#2b211b", "#b4583a", "#2b211b"] }, { duration: 0.8, ease: easeOut })));
    }
  }

  // ---------- Bag: items slide in when it opens ----------
  $("#bag-open").addEventListener("click", () => {
    const lines = $$("#bag-items .line, #bag-items .drawer__empty");
    if (lines.length) animate(lines, { opacity: [0, 1], x: [40, 0] }, { ...snappySpring, delay: stagger(0.05, { startDelay: 0.12 }) });
  });

  if (!finePointer) return; // the rest needs a mouse

  // ---------- Hover: catalogue cards lift gently; other photos tilt slightly toward the cursor ----------
  let tilted = null, lifted = null;
  const untilt = (el) => animate(el, { rotateX: 0, rotateY: 0, transformPerspective: 900 }, { type: "spring", stiffness: 160, damping: 16 });
  document.addEventListener("pointermove", (e) => {
    const lift = e.target.closest("#grid .card__img, #wall .card__img");
    if (lifted && lifted !== lift) {
      animate(lifted, { y: 0, boxShadow: "0 0px 0px rgba(43,33,27,0)" }, { duration: 0.5, ease: easeOut });
      lifted = null;
    }
    if (lift && lift !== lifted) {
      lifted = lift;
      animate(lift, { y: -6, boxShadow: "0 18px 34px rgba(43,33,27,0.16)" }, { duration: 0.5, ease: easeOut });
    }
    const img = lift ? null : e.target.closest(".cat__img, .size-tile__img, .occ__img");
    if (tilted && tilted !== img) { untilt(tilted); tilted = null; }
    if (!img) return;
    tilted = img;
    const r = img.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
    animate(img, { rotateY: px * 7, rotateX: py * -7, transformPerspective: 900 }, { type: "spring", stiffness: 200, damping: 22 });
  }, { passive: true });
  document.addEventListener("pointerleave", () => { if (tilted) { untilt(tilted); tilted = null; } });

  // ---------- Magnetic buttons ----------
  $$(".btn, .arrow, .wa-float, .bag-btn, .link-arrow").forEach((el) => {
    const pull = el.classList.contains("wa-float") ? 0.3 : 0.18;
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      animate(el, { x: (e.clientX - r.left - r.width / 2) * pull, y: (e.clientY - r.top - r.height / 2) * pull }, snappySpring);
    });
    el.addEventListener("pointerleave", () => animate(el, { x: 0, y: 0 }, { type: "spring", stiffness: 200, damping: 12 }));
  });

  // ---------- Cursor ring ----------
  const cursor = document.createElement("div");
  cursor.className = "cursor";
  document.body.appendChild(cursor);
  let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy, shown = false, state = "";
  addEventListener("pointermove", (e) => {
    tx = e.clientX; ty = e.clientY;
    if (!shown) { shown = true; cx = tx; cy = ty; animate(cursor, { opacity: 1 }, { duration: 0.3 }); }
    const next = e.target.closest(".wall__track") ? "drag"
      : e.target.closest("a, button, select, input, textarea, label, .card__img") ? "link" : "";
    if (next !== state) {
      state = next;
      cursor.classList.toggle("is-drag", state === "drag");
      cursor.textContent = state === "drag" ? "Drag" : "";
      animate(cursor, { scale: state === "drag" ? 2.4 : state === "link" ? 1.6 : 1, opacity: state === "link" ? 0.45 : 1 }, snappySpring);
    }
  }, { passive: true });
  document.addEventListener("pointerleave", () => { shown = false; animate(cursor, { opacity: 0 }, { duration: 0.2 }); });
  (function follow() {
    cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
    cursor.style.left = `${cx.toFixed(1)}px`; cursor.style.top = `${cy.toFixed(1)}px`;
    requestAnimationFrame(follow);
  })();
  } catch (err) {
    // Something in the motion layer failed on this browser: show the plain, fully visible page instead
    console.error("Motion layer stopped:", err);
    plainPage();
  }

  function plainPage() {
    document.documentElement.classList.remove("fx");
    const intro = document.querySelector(".intro");
    if (intro) intro.remove();
    document.querySelectorAll(".w__in, .l3, .orb__in, .card, .reveal, .hero *, .header *, .footer__mark *, .process__step").forEach((el) => {
      el.style.opacity = "";
      el.style.transform = "";
      el.style.filter = "";
    });
    document.querySelectorAll(".card__img > img").forEach((img) => (img.style.clipPath = ""));
  }

  // Safety net: if the opening hasn't finished after 6 seconds (a browser quirk), reveal everything
  setTimeout(() => {
    const title = document.querySelector(".hero__title .t3, .hero__title .l3");
    if (document.querySelector(".intro") || (title && getComputedStyle(title).opacity === "0")) plainPage();
  }, 6000);
})();
