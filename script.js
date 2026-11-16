/* The Dental Zone · Dr. Jyotirmoy Das — site script */

/* ---- Chamber settings: edit numbers here if they change ----
   All chambers send to 01728885550 (owner, 2026-11-15).
   wa  = WhatsApp number in international format, digits only (880 + number without the first 0)
   days = clinic days, 0=Sunday ... 6=Saturday                                                    */
const CHAMBERS = {
  dhaka:     { name: "দি ডেন্টাল জোন, ঢাকা (মিরপুর)",       wa: "8801728885550", days: [6,0,1,2,3], daysText: "শনি–বুধবার, সন্ধ্যা ৬টা–রাত ১০টা" },
  madaripur: { name: "দি ডেন্টাল জোন, মাদারীপুর (মেডিসিন মার্কেট)", wa: "8801728885550", days: [4,5], daysText: "বৃহস্পতি ও শুক্রবার" },
  planet:    { name: "প্ল্যানেট হাসপাতাল, মাদারীপুর",           wa: "8801728885550", days: [4,5], daysText: "বৃহস্পতি ও শুক্রবার" }
};
const DAY_BN = ["রবিবার","সোমবার","মঙ্গলবার","বুধবার","বৃহস্পতিবার","শুক্রবার","শনিবার"];
const bnDigits = s => String(s).replace(/\d/g, d => "০১২৩৪৫৬৭৮৯"[d]);
const enDigits = s => String(s).replace(/[০-৯]/g, d => "০১২৩৪৫৬৭৮৯".indexOf(d));
const waLink = (num, text) => "https://wa.me/" + num + (text ? "?text=" + encodeURIComponent(text) : "");
const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => [...el.querySelectorAll(q)];

/* ---- mobile menu ---- */
const menuBtn = $(".menu-btn"), nav = $(".nav");
function setHeaderH(){ document.documentElement.style.setProperty("--hh", $(".header").getBoundingClientRect().bottom + "px"); }
menuBtn.addEventListener("click", () => { setHeaderH(); const o = nav.classList.toggle("open"); menuBtn.setAttribute("aria-expanded", o); });
$$(".nav a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

/* ---- reveal on scroll ---- */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
function observeReveal(root = document){ $$(".reveal:not(.in)", root).forEach(el => io.observe(el)); }
observeReveal();

/* ---- lazy map embeds ---- */
const mapIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.src = e.target.dataset.src; mapIO.unobserve(e.target); } }), { rootMargin: "300px" });
$$("iframe[data-src]").forEach(f => mapIO.observe(f));

/* ---- booking form ---- */
const form = $("#bookForm"), dateIn = $("#date"), hint = $("#dateHint"), err = $("#formErr");
const pick = $("#datePick");
const MON_BN = ["জানু","ফেব্রু","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টে","অক্টো","নভে","ডিসে"];
const ymd = d => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
function chosen(){ const r = $("input[name=chamber]:checked"); return r ? r.value : ""; }
// chip-style date picker: next open days of the chosen chamber (works in every browser, incl. Facebook in-app)
function renderDates(){
  const c = chosen(); hint.classList.remove("warn");
  if (!c) { pick.innerHTML = ""; dateIn.value = ""; hint.textContent = "প্রথমে চেম্বার নির্বাচন করুন; সেই চেম্বার খোলা থাকার তারিখগুলো এখানে দেখাবে।"; return; }
  const ch = CHAMBERS[c], prev = dateIn.value, out = [];
  const d = new Date(); d.setHours(0, 0, 0, 0);
  for (let i = 0; out.length < 8 && i < 60; i++, d.setDate(d.getDate() + 1)) if (ch.days.includes(d.getDay())) out.push(new Date(d));
  const todayKey = ymd(new Date());
  pick.innerHTML = out.map(x => { const k = ymd(x); return '<button type="button" role="radio" data-d="' + k + '" class="' + (k === prev ? "on" : "") + '"><b>' + DAY_BN[x.getDay()].replace("বার", "") + (k === todayKey ? " (আজ)" : "") + '</b><span>' + bnDigits(x.getDate()) + " " + MON_BN[x.getMonth()] + '</span></button>'; }).join("");
  if (!out.some(x => ymd(x) === prev)) dateIn.value = "";
  hint.textContent = "এই চেম্বারে রোগী দেখা হয়: " + ch.daysText + "। তারিখ না বেছে নিলেও চলবে।";
}
pick.addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  const on = !b.classList.contains("on");
  $$("button", pick).forEach(x => { x.classList.remove("on"); x.setAttribute("aria-checked", "false"); });
  if (on) { b.classList.add("on"); b.setAttribute("aria-checked", "true"); dateIn.value = b.dataset.d; } else dateIn.value = "";
});
function checkDate(){ return true; }
$$("input[name=chamber]").forEach(r => r.addEventListener("change", renderDates));

// "WhatsApp" buttons on chamber cards pre-select that chamber
$$("[data-chamber]").forEach(a => a.addEventListener("click", () => {
  const r = $("#c-" + a.dataset.chamber); if (r) { r.checked = true; renderDates(); }
  setTimeout(() => $("#name").focus({ preventScroll: true }), 600);
}));

form.addEventListener("submit", e => {
  e.preventDefault(); err.textContent = "";
  const c = chosen(), name = $("#name").value.trim(), phone = enDigits($("#phone").value.trim());
  if (!c) return err.textContent = "অনুগ্রহ করে একটি চেম্বার নির্বাচন করুন।";
  if (!name) { $("#name").focus(); return err.textContent = "অনুগ্রহ করে রোগীর নাম লিখুন।"; }
  if (!/^(\+?88)?01[3-9]\d{8}$/.test(phone.replace(/[\s-]/g, ""))) { $("#phone").focus(); return err.textContent = "সঠিক মোবাইল নম্বর লিখুন (যেমন: 01XXXXXXXXX)।"; }
  if (!checkDate()) return err.textContent = "নির্বাচিত তারিখে এই চেম্বার বন্ধ থাকে। অন্য তারিখ বেছে নিন।";
  const ch = CHAMBERS[c], age = $("#age").value.trim(), svc = $("#service").value, msg = $("#msg").value.trim();
  let dateTxt = "";
  if (dateIn.value) { const [y, m, d] = dateIn.value.split("-"); dateTxt = bnDigits(`${d}/${m}/${y}`) + " (" + DAY_BN[new Date(dateIn.value + "T00:00:00").getDay()] + ")"; }
  const lines = [
    "*অ্যাপয়েন্টমেন্টের অনুরোধ* (ওয়েবসাইট থেকে)",
    "",
    "চেম্বার: " + ch.name,
    "রোগীর নাম: " + name,
    "মোবাইল: " + bnDigits(phone),
    age ? ("বয়স: " + bnDigits(age)) : null,
    svc ? ("চিকিৎসার ধরন: " + svc) : null,
    dateTxt ? ("পছন্দের তারিখ: " + dateTxt) : null,
    msg ? ("সমস্যা / যে চিকিৎসা চান: " + msg) : null,
    "",
    "অনুগ্রহ করে সিরিয়াল নিশ্চিত করুন। ধন্যবাদ।"
  ].filter(l => l !== null);
  const url = waLink(ch.wa, lines.join("\n"));
  // phones and in-app browsers (Facebook, Messenger) often block new windows: open WhatsApp in the same tab there
  const mobile = /Android|iPhone|iPad|iPod|FBAN|FBAV|Instagram|Line\//i.test(navigator.userAgent);
  let w = null;
  if (!mobile) { try { w = window.open(url, "_blank"); } catch (_) {} }
  if (!w) window.location.href = url;
  err.style.color = "var(--green)";
  err.textContent = "হোয়াটসঅ্যাপ খুলছে… বার্তাটি পাঠাতে হোয়াটসঅ্যাপে Send চাপুন। না খুললে সরাসরি কল করুন: ০১৭২৮-৮৮৫৫৫০";
});
form.addEventListener("input", () => { if (err.style.color) { err.style.color = ""; err.textContent = ""; } });

/* ---- floating WhatsApp ---- */
const fab = $("#fab"), fabBtn = $(".fab-btn");
fabBtn.addEventListener("click", () => { const o = fab.classList.toggle("open"); fabBtn.setAttribute("aria-expanded", o); });
document.addEventListener("click", e => { if (!fab.contains(e.target)) fab.classList.remove("open"); });
$$("[data-wa]").forEach(a => { const ch = CHAMBERS[a.dataset.wa]; a.href = waLink(ch.wa, "হ্যালো, দি ডেন্টাল জোনের ওয়েবসাইট থেকে যোগাযোগ করছি। " + ch.name + " চেম্বারে সিরিয়াল সম্পর্কে জানতে চাই।"); });

/* ---- lightbox ---- */
const lb = $("#lb"), lbIn = $(".lb-in");
function openLB(html){ lbIn.innerHTML = html; lb.classList.add("show"); document.body.style.overflow = "hidden"; }
function closeLB(){ lb.classList.remove("show"); lbIn.innerHTML = ""; document.body.style.overflow = ""; }
lb.addEventListener("click", e => { if (e.target === lb || e.target.classList.contains("lb-x")) closeLB(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") { closeLB(); fab.classList.remove("open"); } });

/* ---- stats count-up ---- */
const cIO = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; cIO.unobserve(e.target);
  const el = e.target, end = +el.dataset.count, t0 = performance.now();
  const tick = now => { const p = Math.min(1, (now - t0) / 1400); el.textContent = bnDigits(Math.round(end * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}), { threshold: .5 });
$$("[data-count]").forEach(el => cIO.observe(el));

/* ---- animated treatment explainers (+ optional 3D YouTube video per treatment, data/explainers.json) ---- */
(function(){
  const cv = $("#exCanvas"); if (!cv || !window.DZExplainer) return;
  const X = window.DZExplainer, ctx = cv.getContext("2d"), tabs = $("#exTabs"), play = $("#exPlay");
  const modeEl = $("#exMode"), vid = $("#exVideo");
  const SHORT = ["রুট ক্যানেল", "ক্রাউন (ক্যাপ)", "ইমপ্ল্যান্ট", "ব্রেস", "ভিনিয়ার"];
  let cur = 0, t0 = performance.now(), paused = false, pausedAt = 0, visible = false, mode = "anim";
  const VIDS = {};
  tabs.innerHTML = X.SCENES.map((s, i) => '<button type="button" role="tab" class="' + (i ? "" : "on") + '"><i>' + bnDigits(i + 1) + '</i>' + (SHORT[i] || s.title) + '</button>').join("");
  const mark = () => $$("button", tabs).forEach((x, k) => x.classList.toggle("on", k === cur));
  const vidFor = i => ytId(VIDS[X.SCENES[i].key] || "");
  function setMode(m){
    const id = vidFor(cur);
    mode = id ? m : "anim";
    modeEl.hidden = !id;
    $$("button", modeEl).forEach(b => b.classList.toggle("on", b.dataset.m === mode));
    if (mode === "video") {
      vid.innerHTML = '<button type="button" class="ex-yt" aria-label="ভিডিও চালান"><img src="https://img.youtube.com/vi/' + id + '/hqdefault.jpg" alt=""><span></span></button>';
      $(".ex-yt", vid).onclick = () => { vid.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>'; };
      vid.hidden = false; play.hidden = true;
    } else { vid.innerHTML = ""; vid.hidden = true; play.hidden = false; }
  }
  $$("button", tabs).forEach((b, i) => b.onclick = () => { cur = i; t0 = performance.now(); paused = false; play.textContent = "❚❚"; mark(); setMode("video"); });
  modeEl.onclick = e => { const b = e.target.closest("button"); if (b) { setMode(b.dataset.m); t0 = performance.now(); } };
  play.onclick = () => { paused = !paused; play.textContent = paused ? "▶" : "❚❚"; if (paused) pausedAt = performance.now(); else t0 += performance.now() - pausedAt; };
  new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(cv);
  const loop = now => {
    if (visible && !paused && mode === "anim") {
      let t = (now - t0) / 1000;
      if (t > X.duration(cur)) { cur = (cur + 1) % X.SCENES.length; t0 = now; t = 0; mark(); setMode("video"); }
      X.draw(ctx, cur, t);
    }
    requestAnimationFrame(loop);
  };
  fetch("data/explainers.json", { cache: "no-cache" })
    .then(r => { if (!r.ok) throw 0; return r.json(); })
    .catch(() => window.EXPLAINER_FALLBACK || {})
    .then(d => { (d.videos || []).forEach(v => { if (v.show !== false && v.youtube) VIDS[v.key] = v.youtube; }); setMode("video"); });
  document.fonts.ready.then(() => { X.draw(ctx, 0, 0.5); requestAnimationFrame(loop); });
})();

/* ---- before/after sliders + gallery (data/gallery.json, edited from the admin panel) ---- */
const esc = s => String(s || "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const rel = p => String(p || "").replace(/^\//, "");
function ytId(u){ const m = String(u).match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/); return m ? m[1] : ""; }

let goToSlide = () => {};
function setupSliders(all, order){
  const wrap = $("#baWrap"), fb = $("#baFilters"); if (!all.length) { wrap.style.display = "none"; if (fb) fb.style.display = "none"; return; }
  let list = all;
  const ba = $("#ba"), bImg = $(".ba-before", ba), aImg = $(".ba-after", ba);
  let idx = 0, drag = false, pos = 50;
  const setPos = p => { pos = Math.max(0, Math.min(100, p)); ba.style.setProperty("--pos", pos + "%"); };
  function show(i){
    idx = (i + list.length) % list.length; const it = list[idx];
    bImg.src = it.before; aImg.src = it.after; ba.classList.remove("fade"); void ba.offsetWidth; ba.classList.add("fade");
    $("#baTitle").textContent = it.title; $("#baCap").textContent = it.caption || "";
    $("#baCount").textContent = "কেস " + bnDigits(idx + 1) + " / " + bnDigits(list.length) + (it.category ? " · " + it.category : "");
    $$("#baThumbs button").forEach((b, k) => b.classList.toggle("on", k === idx));
    setPos(50);
  }
  function setCat(c){
    list = c === "সব" ? all : all.filter(i => i.category === c);
    $("#baThumbs").innerHTML = list.map(it => '<button type="button" aria-label="' + esc(it.title) + '"><img src="' + esc(it.after) + '" alt="" loading="lazy"></button>').join("");
    $$("#baThumbs button").forEach((b, i) => b.onclick = () => show(i));
    $("#baThumbs").scrollTop = 0; idx = 0;
  }
  if (fb) {
    const cs = ["সব", ...order.filter(c => all.some(i => i.category === c))];
    fb.innerHTML = cs.length > 2 ? cs.map((c, i) => '<button type="button" class="' + (i ? "" : "on") + '" data-c="' + esc(c) + '">' + esc(c) + '</button>').join("") : "";
    fb.onclick = e => { const b = e.target.closest("button"); if (!b) return; $$("button", fb).forEach(x => x.classList.toggle("on", x === b)); setCat(b.dataset.c); show(0); };
  }
  setCat("সব");
  goToSlide = it => {
    if (fb) $$("button", fb).forEach((x, k) => x.classList.toggle("on", k === 0));
    setCat("সব"); show(Math.max(0, all.indexOf(it)));
    wrap.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  $("#baPrev").onclick = () => show(idx - 1); $("#baNext").onclick = () => show(idx + 1);
  const move = e => { const r = ba.getBoundingClientRect(); setPos((e.clientX - r.left) / r.width * 100); };
  ba.addEventListener("pointerdown", e => { drag = true; ba.setPointerCapture(e.pointerId); move(e); });
  ba.addEventListener("pointermove", e => { if (drag) move(e); });
  ba.addEventListener("pointerup", () => drag = false); ba.addEventListener("pointercancel", () => drag = false);
  // hint: sweep the handle once when first seen
  new IntersectionObserver((es, o) => {
    if (!es[0].isIntersecting) return; o.disconnect();
    const t0 = performance.now();
    const a = now => { const t = (now - t0) / 1800; if (drag) return; if (t > 1) return setPos(50); setPos(50 + 35 * Math.sin(t * Math.PI * 2)); requestAnimationFrame(a); };
    requestAnimationFrame(a);
  }, { threshold: .5 }).observe(ba);
  show(0);
}

function renderGallery(data){
  const all = (data.items || []).filter(i => i.show !== false).map(i => ({ ...i, image: rel(i.image), video: rel(i.video), before: rel(i.before), after: rel(i.after) }));
  const sl = all.filter(i => i.type === "slider" && i.before && i.after);
  setupSliders(sl, data.categories || []);
  const items = all.filter(i => i.type === "slider" ? sl.includes(i) : (i.image || i.video || i.link));
  const cats = ["সব", ...(data.categories || []).filter(c => items.some(i => i.category === c))];
  const fEl = $("#gFilters"), gEl = $("#gGrid");
  fEl.innerHTML = cats.length > 2 ? cats.map((c, i) => '<button type="button" class="' + (i ? "" : "on") + '" data-c="' + esc(c) + '">' + esc(c) + '</button>').join("") : "";
  const LIMIT = 8; let showAll = false, curCat = "সব";
  function card(it){
    const yt = it.type === "youtube" ? ytId(it.link) : "";
    const thumb = it.image || (yt ? "https://img.youtube.com/vi/" + yt + "/hqdefault.jpg" : "assets/img/og-cover.jpg");
    const isVid = it.type === "video" || it.type === "youtube" || it.type === "facebook";
    const media = it.type === "slider"
      ? '<div class="g-split"><img src="' + esc(it.before) + '" alt="' + esc(it.title) + ' (আগে)" loading="lazy"><span>আগে</span></div><div class="g-split"><img src="' + esc(it.after) + '" alt="' + esc(it.title) + ' (পরে)" loading="lazy"><span class="a">পরে</span></div>'
      : '<img src="' + esc(thumb) + '" alt="' + esc(it.title) + '" loading="lazy">';
    return '<figure class="g-item reveal"><div class="g-media' + (it.type === "slider" ? " g-ba" : "") + '" data-n="' + items.indexOf(it) + '">' + media
      + (it.category ? '<span class="g-tag">' + esc(it.category) + '</span>' : "")
      + (isVid ? '<div class="g-play"><span></span></div>' : "")
      + '</div><figcaption class="g-cap"><b>' + esc(it.title) + '</b>' + (it.caption ? '<small>' + esc(it.caption) + '</small>' : "") + '</figcaption></figure>';
  }
  function draw(cat){
    curCat = cat;
    const list = cat === "সব" ? items : items.filter(i => i.category === cat);
    const vis = showAll || cat !== "সব" ? list : list.slice(0, LIMIT);
    let html = vis.length ? vis.map(card).join("") : '<div class="g-empty">এই বিভাগে এখনো কোনো ছবি যোগ করা হয়নি।</div>';
    if (!showAll && cat === "সব" && list.length > LIMIT) html += '<div class="g-empty"><button type="button" class="btn btn-ghost" id="gMore">আরও দেখুন (' + bnDigits(list.length - LIMIT) + 'টি)</button></div>';
    gEl.innerHTML = html; observeReveal(gEl);
    const m = $("#gMore"); if (m) m.onclick = () => { showAll = true; draw(curCat); };
  }
  fEl.onclick = e => { const b = e.target.closest("button"); if (!b) return; $$("button", fEl).forEach(x => x.classList.toggle("on", x === b)); draw(b.dataset.c); };
  gEl.onclick = e => {
    const m = e.target.closest(".g-media"); if (!m) return;
    const it = items[+m.dataset.n];
    if (it.type === "slider") return goToSlide(it);
    if (it.type === "video" && it.video) openLB('<video src="' + esc(it.video) + '" poster="' + esc(it.image) + '" controls autoplay playsinline></video>');
    else if (it.type === "youtube" && ytId(it.link)) openLB('<iframe src="https://www.youtube-nocookie.com/embed/' + ytId(it.link) + '?autoplay=1" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>');
    else if (it.link && it.type !== "photo") window.open(it.link, "_blank", "noopener");
    else openLB('<img src="' + esc(it.image) + '" alt="' + esc(it.title) + '">');
  };
  draw("সব");
}
fetch("data/gallery.json", { cache: "no-cache" })
  .then(r => { if (!r.ok) throw 0; return r.json(); })
  .catch(() => window.GALLERY_FALLBACK || { items: [] })
  .then(renderGallery);

/* ---- links like drjyotirmoy.com/#appointment: keep the section in place while images, maps and the gallery load ---- */
if (location.hash.length > 1) {
  const tgt = document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (tgt) {
    $$(".reveal", tgt).forEach(el => el.classList.add("in")); tgt.classList.add("in");
    let user = false; const stop = () => { user = true; };
    ["wheel", "touchstart", "keydown", "mousedown"].forEach(ev => window.addEventListener(ev, stop, { once: true, passive: true }));
    const go = () => { if (!user) tgt.scrollIntoView({ block: "start" }); };
    const ro = new ResizeObserver(go); ro.observe(document.body);
    go(); setTimeout(() => ro.disconnect(), 5000);
  }
}
