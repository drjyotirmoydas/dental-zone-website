/* Animated treatment explainers (canvas). Used on the website and to render MP4s.
   window.DZExplainer.draw(ctx, sceneIndex, t)  — t in seconds; pure function of t. */
(function () {
  const W = 1080, H = 1080;
  const C = { blue: "#1D5FA8", deep: "#103A6E", sky: "#EAF3FD", red: "#C8202A", green: "#167A34",
    tooth: "#FFFDF6", enamel: "#FFFFFF", dentin: "#F6EBCF", toothLine: "#9AA9BD", pulp: "#E0505A", pulpClean: "#FCE3E3",
    gum: "#F2A0A8", gumD: "#D9737F", bone: "#F1E3C8", boneDot: "#E2CFA8", gp: "#F08A24", metal: "#9AA6B2", metalD: "#5F6B78" };
  const FONT = '"Noto Sans Bengali", "Hind Siliguri", system-ui, sans-serif';

  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const ease = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const lerp = (a, b, p) => a + (b - a) * p;

  const SCENES = [
    { key: "rct", title: "মানসম্মত রুট ক্যানেল চিকিৎসা", en: "Root Canal Treatment", steps: [
      "দাঁতের ভেতরের নার্ভ (পাল্প) সংক্রমিত",
      "ক্যানেল পরিষ্কার ও জীবাণুমুক্ত করা হয়",
      "ক্যানেল বিশেষ উপাদানে ভরাট করা হয়",
      "ক্যাপ (ক্রাউন) দিয়ে দাঁত সুরক্ষিত" ] },
    { key: "crown", title: "উন্নত ক্রাউন (ক্যাপ-ব্রিজ)", en: "Crown & Bridge", steps: [
      "ভাঙা বা দুর্বল দাঁত",
      "দাঁতকে ক্যাপের জন্য প্রস্তুত করা হয়",
      "মাপ নিয়ে নিখুঁত ক্যাপ তৈরি",
      "ক্যাপ বসিয়ে দাঁত আগের মতো মজবুত" ] },
    { key: "implant", title: "ডেন্টাল ইমপ্ল্যান্ট", en: "Dental Implant", steps: [
      "হারানো দাঁতের ফাঁকা জায়গা",
      "সিবিসিটি পরিকল্পনায় হাড়ে ইমপ্ল্যান্ট স্থাপন",
      "ইমপ্ল্যান্ট হাড়ের সাথে মিশে যায়",
      "অ্যাবাটমেন্ট ও ক্রাউন: নতুন দাঁত" ] },
    { key: "braces", title: "আঁকাবাঁকা, ফাঁকা ও উঁচু দাঁতের চিকিৎসায় ব্রেস", en: "Orthodontic Braces", steps: [
      "আঁকাবাঁকা ও এলোমেলো দাঁত",
      "প্রতিটি দাঁতে ব্র্যাকেট লাগানো হয়",
      "তারের মৃদু চাপে দাঁত ধীরে সরে",
      "সোজা দাঁত, সুন্দর হাসি" ] },
    { key: "veneer", title: "ভিনিয়ার", en: "Veneers", steps: [
      "বিবর্ণ, ভাঙা বা ফাঁকা সামনের দাঁত",
      "দাঁতের সামনের অংশ সামান্য প্রস্তুত",
      "পাতলা ভিনিয়ার বসানো হয়",
      "উজ্জ্বল ও সমান হাসি" ] }
  ];
  const STEP = 3.2, HOLD = 1.6;
  const duration = i => SCENES[i].steps.length * STEP + HOLD;

  /* ---------- frame ---------- */
  function bg(ctx) {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#F5F9FE"); g.addColorStop(1, "#DDEBFA");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  function windowClip(ctx) {
    rr(ctx, 50, 240, W - 100, 630, 36);
    ctx.fillStyle = "#fff"; ctx.shadowColor = "rgba(16,58,110,.12)"; ctx.shadowBlur = 30; ctx.fill(); ctx.shadowBlur = 0;
    rr(ctx, 50, 240, W - 100, 630, 36); ctx.clip();
    ctx.fillStyle = "rgba(29,95,168,.06)"; ctx.beginPath(); ctx.arc(W / 2, 520, 330, 0, 7); ctx.fill();
  }
  function frame(ctx, sc, step, local) {
    ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
    ctx.fillStyle = C.red; ctx.font = `600 30px ${FONT}`; ctx.fillText(sc.en.toUpperCase(), W / 2, 78);
    ctx.fillStyle = C.deep; let fs = 54; ctx.font = `700 ${fs}px ${FONT}`;
    while (ctx.measureText(sc.title).width > W - 120) { fs -= 2; ctx.font = `700 ${fs}px ${FONT}`; }
    ctx.fillText(sc.title, W / 2, 145);
    const n = sc.steps.length, gap = 120, x0 = W / 2 - gap * (n - 1) / 2;
    ctx.strokeStyle = "#BCD3EE"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x0, 196); ctx.lineTo(x0 + gap * (n - 1), 196); ctx.stroke();
    for (let i = 0; i < n; i++) {
      const on = i <= step;
      ctx.fillStyle = on ? C.blue : "#fff"; ctx.strokeStyle = C.blue; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(x0 + gap * i, 196, i === step ? 22 : 17, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = on ? "#fff" : C.blue; ctx.font = `700 22px ${FONT}`; ctx.textBaseline = "middle";
      ctx.fillText("১২৩৪৫৬"[i], x0 + gap * i, 198); ctx.textBaseline = "alphabetic";
    }
    const cap = sc.steps[step], a = ease(local / .35);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(0, (1 - a) * 18);
    ctx.font = `600 42px ${FONT}`; let cw = Math.min(W - 80, ctx.measureText(cap).width + 90);
    ctx.fillStyle = C.blue; ctx.shadowColor = "rgba(16,58,110,.25)"; ctx.shadowBlur = 20;
    rr(ctx, W / 2 - cw / 2, 900, cw, 88, 44); ctx.fill(); ctx.shadowBlur = 0;
    ctx.fillStyle = "#fff"; ctx.fillText(cap, W / 2, 958);
    ctx.restore();
    ctx.fillStyle = "#5F7896"; ctx.font = `500 24px ${FONT}`;
    ctx.fillText("দি ডেন্টাল জোন  ·  ডা. জ্যোতির্ময় দাস", W / 2, 1050);
  }
  function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

  /* ---------- side-view molar ---------- */
  function molarPath(ctx) {
    ctx.beginPath();
    ctx.moveTo(-140, 0); ctx.lineTo(-152, -150);
    ctx.quadraticCurveTo(-145, -232, -78, -228); ctx.quadraticCurveTo(-22, -224, 0, -196);
    ctx.quadraticCurveTo(22, -224, 78, -228); ctx.quadraticCurveTo(145, -232, 152, -150);
    ctx.lineTo(140, 0);
    ctx.quadraticCurveTo(132, 160, 88, 300); ctx.quadraticCurveTo(66, 318, 50, 292);
    ctx.quadraticCurveTo(38, 150, 20, 40); ctx.quadraticCurveTo(0, 28, -20, 40);
    ctx.quadraticCurveTo(-38, 150, -50, 292); ctx.quadraticCurveTo(-66, 318, -88, 300);
    ctx.quadraticCurveTo(-132, 160, -140, 0); ctx.closePath();
  }
  function crownPath(ctx, pad = 0, top = 0) { // occlusal crown shape from y=-50 up
    ctx.beginPath();
    ctx.moveTo(-142 - pad, -45); ctx.lineTo(-152 - pad, -150);
    ctx.quadraticCurveTo(-146 - pad, -236 - pad - top, -78, -232 - pad - top); ctx.quadraticCurveTo(-22, -228 - pad - top, 0, -200 - pad - top);
    ctx.quadraticCurveTo(22, -228 - pad - top, 78, -232 - pad - top); ctx.quadraticCurveTo(146 + pad, -236 - pad - top, 152 + pad, -150);
    ctx.lineTo(142 + pad, -45); ctx.quadraticCurveTo(0, -30, -142 - pad, -45); ctx.closePath();
  }
  function pulpPath(ctx, fillTo = 1) {
    // chamber + 2 canals; fillTo trims from top (for filling animation drawn separately)
    ctx.beginPath();
    ctx.moveTo(-72, -95); ctx.quadraticCurveTo(-70, -140, -30, -132); ctx.quadraticCurveTo(0, -120, 30, -132);
    ctx.quadraticCurveTo(70, -140, 72, -95); ctx.lineTo(66, -40);
    ctx.quadraticCurveTo(70, 130, 70, 278); ctx.lineTo(64, 280); ctx.quadraticCurveTo(52, 120, 40, -30);
    ctx.lineTo(-40, -30); ctx.quadraticCurveTo(-52, 120, -64, 280); ctx.lineTo(-70, 278);
    ctx.quadraticCurveTo(-70, 130, -66, -40); ctx.closePath();
  }
  function bone(ctx, y = 40) {
    const g = ctx.createLinearGradient(0, y, 0, y + 420); g.addColorStop(0, "#F7ECD6"); g.addColorStop(1, "#E6D2AC");
    ctx.fillStyle = g; ctx.fillRect(-W, y, W * 2, 700);
    ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fillRect(-W, y, W * 2, 14); // cortical plate
    ctx.strokeStyle = "rgba(190,160,110,.45)"; ctx.lineWidth = 3;
    for (let i = 0; i < 90; i++) { const x = ((i * 137) % 1000) - 500, yy = y + 34 + ((i * 71) % 320), r = 6 + (i % 5) * 2; ctx.beginPath(); ctx.ellipse(x, yy, r * 1.4, r, (i % 7) * .4, 0, 7); ctx.stroke(); }
  }
  function gum(ctx, y = -40) {
    const g = ctx.createLinearGradient(0, y - 12, 0, y + 110); g.addColorStop(0, "#F7B5BC"); g.addColorStop(.5, C.gum); g.addColorStop(1, "#E58C96");
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-W, y + 30);
    for (let x = -W; x <= W; x += 40) ctx.lineTo(x, y + 12 * Math.sin(x / 60));
    ctx.lineTo(W, y + 110); ctx.lineTo(-W, y + 110); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(217,115,127,.6)"; ctx.lineWidth = 3; ctx.beginPath();
    for (let x = -W; x <= W; x += 40) x === -W ? ctx.moveTo(x, y + 12 * Math.sin(x / 60)) : ctx.lineTo(x, y + 12 * Math.sin(x / 60)); ctx.stroke();
  }
  function drawMolar(ctx, o = {}) {
    ctx.save();
    ctx.shadowColor = "rgba(16,58,110,.18)"; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8;
    molarPath(ctx); ctx.fillStyle = C.dentin; ctx.fill(); ctx.shadowColor = "transparent";
    ctx.save(); molarPath(ctx); ctx.clip();
    const eg = ctx.createLinearGradient(0, -240, 0, -40); eg.addColorStop(0, "#FFFFFF"); eg.addColorStop(1, "#F3F1EA");
    crownPath(ctx); ctx.fillStyle = eg; ctx.fill();
    if (o.pulp !== false) {
      pulpPath(ctx); ctx.fillStyle = o.pulpColor || C.pulp; ctx.fill();
      if (!o.pulpColor || o.pulpColor === C.pulp) { const pg = ctx.createLinearGradient(-70, 0, 70, 0); pg.addColorStop(0, "rgba(120,0,20,.25)"); pg.addColorStop(.5, "rgba(255,255,255,.12)"); pg.addColorStop(1, "rgba(120,0,20,.25)"); pulpPath(ctx); ctx.fillStyle = pg; ctx.fill(); }
    }
    shade(ctx, -155, 155);
    ctx.fillStyle = "rgba(255,255,255,.7)"; ctx.beginPath(); ctx.ellipse(-95, -170, 14, 40, .25, 0, 7); ctx.fill();
    ctx.restore();
    molarPath(ctx); ctx.strokeStyle = C.toothLine; ctx.lineWidth = 4; ctx.stroke();
    ctx.restore();
  }

  /* ---------- scenes ---------- */
  const DRAW = {
    rct(ctx, s, p, t) {
      ctx.save(); ctx.translate(W / 2, 590); ctx.scale(.88, .88);
      bone(ctx, 40); gum(ctx, -40);
      const pulse = .5 + .5 * Math.sin(t * 5);
      let pulpColor = s === 0 ? `rgb(${200 + 40 * pulse},${60 + 20 * pulse},70)` : s === 1 ? mix("#E0505A", "#FCE3E3", p) : "#FCE3E3";
      drawMolar(ctx, { pulpColor });
      // decay
      if (s < 3) { ctx.fillStyle = s === 0 ? "#5B3A29" : `rgba(91,58,41,${1 - (s === 1 ? p : 1)})`; ctx.beginPath(); ctx.ellipse(-60, -205, 38, 22, -.2, 0, 7); ctx.fill(); }
      // infection glow at root tip
      if (s === 0) { ctx.fillStyle = `rgba(224,80,90,${.25 + .25 * pulse})`; ctx.beginPath(); ctx.arc(-70, 300, 40, 0, 7); ctx.fill(); ctx.beginPath(); ctx.arc(70, 300, 40, 0, 7); ctx.fill(); }
      // access + file
      if (s === 1) {
        const d = Math.abs(Math.sin(t * 2.6)) * 300;
        [[-56, 1], [56, -1]].forEach(([x, k]) => {
          const tipY = -120 + d * (k > 0 ? 1 : .9);
          ctx.strokeStyle = "#7B8794"; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x * .6, -330); ctx.lineTo(x + (tipY > -40 ? (x > 0 ? 6 : -6) * (tipY + 40) / 320 : 0), tipY); ctx.stroke();
          ctx.fillStyle = x < 0 ? C.blue : C.green; rr(ctx, x * .6 - 16, -400, 32, 70, 8); ctx.fill();
        });
      }
      // gutta-percha filling (bottom up)
      if (s >= 2) {
        const f = s === 2 ? ease(p) : 1;
        ctx.save(); molarPath(ctx); ctx.clip(); pulpPath(ctx); ctx.clip();
        const top = lerp(290, -140, f); ctx.fillStyle = C.gp; ctx.fillRect(-100, top, 200, 440); ctx.restore();
      }
      // crown cap
      if (s === 3) {
        const dy = lerp(-140, 0, ease(p)), a = clamp(p * 3);
        ctx.save(); ctx.globalAlpha = a; ctx.translate(0, dy);
        crownPath(ctx, 10, 6); ctx.fillStyle = "#F4F7FB"; ctx.fill(); ctx.strokeStyle = C.blue; ctx.lineWidth = 5; ctx.stroke();
        ctx.restore();
        if (p > .8) sparkle(ctx, 120, -250, t);
      }
      ctx.restore();
    },
    crown(ctx, s, p, t) {
      ctx.save(); ctx.translate(W / 2, 590); ctx.scale(.88, .88);
      bone(ctx, 40); gum(ctx, -40);
      // tooth body
      ctx.save(); molarPath(ctx); ctx.fillStyle = C.dentin; ctx.fill(); molarPath(ctx); ctx.clip();
      const cut = s === 0 ? 0 : s === 1 ? ease(p) : 1;
      // enamel shrinking to stump
      ctx.save(); ctx.translate(0, cut * 40); ctx.scale(1 - cut * .22, 1 - cut * .3);
      crownPath(ctx); ctx.fillStyle = cut > .5 ? C.dentin : C.enamel; ctx.fill(); ctx.restore();
      pulpPath(ctx); ctx.fillStyle = "#F5B7B5"; ctx.fill();
      ctx.restore();
      // erase removed part (draw background-ish over the top when prepared)
      if (cut > 0) {
        ctx.save(); ctx.globalCompositeOperation = "destination-over"; ctx.restore();
      }
      ctx.save(); // outline (stump)
      if (cut < 1) { molarPath(ctx); ctx.strokeStyle = C.toothLine; ctx.lineWidth = 4; ctx.stroke(); }
      ctx.restore();
      if (cut > 0) { // stump outline drawn over a light mask for the removed shell
        ctx.save(); crownPath(ctx, 4); ctx.fillStyle = `rgba(234,243,253,${cut})`; ctx.fill();
        ctx.translate(0, 40); ctx.scale(.78, .7); crownPath(ctx); ctx.fillStyle = C.dentin; ctx.fill(); ctx.strokeStyle = C.toothLine; ctx.lineWidth = 5; ctx.stroke(); ctx.restore();
      }
      // crack
      if (s === 0) { ctx.strokeStyle = "#5B3A29"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(20, -200); ctx.lineTo(5, -150); ctx.lineTo(28, -110); ctx.lineTo(12, -60); ctx.stroke();
        ctx.fillStyle = "#EAF3FD"; ctx.beginPath(); ctx.moveTo(78, -232); ctx.lineTo(150, -200); ctx.lineTo(118, -170); ctx.closePath(); ctx.fill(); }
      // new crown hovering / seating
      if (s >= 2) {
        const dy = s === 2 ? lerp(-200, -130, ease(p)) + 8 * Math.sin(t * 3) : lerp(-130, 0, ease(p));
        ctx.save(); ctx.globalAlpha = s === 2 ? clamp(p * 2) : 1; ctx.translate(0, dy);
        crownPath(ctx, 10, 6); const g = ctx.createLinearGradient(0, -240, 0, -40); g.addColorStop(0, "#FFFFFF"); g.addColorStop(1, "#E8EEF5");
        ctx.fillStyle = g; ctx.fill(); ctx.strokeStyle = C.blue; ctx.lineWidth = 5; ctx.stroke(); ctx.restore();
        if (s === 3 && p > .8) sparkle(ctx, 130, -260, t);
      }
      ctx.restore();
    },
    implant(ctx, s, p, t) {
      ctx.save(); ctx.translate(W / 2, 590); ctx.scale(.88, .88);
      bone(ctx, 40); gum(ctx, -40);
      // neighbours
      [-330, 330].forEach(x => { ctx.save(); ctx.translate(x, 0); ctx.scale(.85, .85); drawMolar(ctx, { pulpColor: "#F5B7B5" }); ctx.restore(); });
      // gum over gap
      ctx.fillStyle = C.gum; ctx.beginPath(); ctx.ellipse(0, -20, 150, 40, 0, Math.PI, 0); ctx.fill();
      // implant screw
      if (s >= 1) {
        const y = s === 1 ? lerp(-230, 30, ease(p)) : 30, rot = s === 1 ? p * 18 : 0;
        if (s >= 2) { const a = s === 2 ? ease(p) : 1; ctx.fillStyle = `rgba(22,122,52,${.18 * a})`; ctx.beginPath(); ctx.ellipse(0, 170, 95 + 10 * Math.sin(t * 3), 170, 0, 0, 7); ctx.fill(); }
        screw(ctx, 0, y, rot);
      }
      // abutment + crown
      if (s === 3) {
        const a1 = ease(clamp(p / .45)), a2 = ease(clamp((p - .45) / .55));
        ctx.save(); ctx.globalAlpha = a1; ctx.translate(0, lerp(-120, 0, a1));
        ctx.fillStyle = C.metal; rr(ctx, -34, -90, 68, 100, 10); ctx.fill(); ctx.strokeStyle = C.metalD; ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
        ctx.save(); ctx.globalAlpha = a2; ctx.translate(0, lerp(-140, 0, a2));
        crownPath(ctx, 0, 0); ctx.fillStyle = "#fff"; ctx.fill(); ctx.strokeStyle = C.blue; ctx.lineWidth = 5; ctx.stroke(); ctx.restore();
        if (p > .85) sparkle(ctx, 140, -260, t);
      }
      ctx.restore();
    },
    braces(ctx, s, p, t) {
      ctx.save(); ctx.translate(W / 2, 470);
      mouth(ctx);
      const align = s <= 1 ? 0 : s === 2 ? ease(p) : 1;
      const T = frontTeeth(align, [[0, 0], [-8, 14], [10, -22], [-12, 20], [9, 10], [0, 0]], [0, .14, -.18, .2, -.12, 0]);
      T.forEach(o => tooth(ctx, o, "#FFFDF4"));
      // brackets + wire
      const showB = s === 1 ? ease(p) : (s === 2 ? 1 : s === 3 ? 1 - ease(clamp((p - .3) / .5)) : 0);
      if (showB > 0) {
        ctx.save(); ctx.globalAlpha = showB;
        const wireOn = s >= 2 ? 1 : clamp((p - .55) / .4);
        if (wireOn > 0) { ctx.strokeStyle = "#7E8A96"; ctx.lineWidth = 5; ctx.beginPath(); T.forEach((o, i) => { const x = o.x, y = o.y + o.h * .45; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.globalAlpha = showB * wireOn; ctx.stroke(); ctx.globalAlpha = showB; }
        T.forEach(o => { ctx.save(); ctx.translate(o.x, o.y + o.h * .45); ctx.rotate(o.r); ctx.fillStyle = "#AEB8C2"; rr(ctx, -16, -14, 32, 28, 5); ctx.fill(); ctx.strokeStyle = "#6E7A86"; ctx.lineWidth = 2; ctx.stroke(); ctx.restore(); });
        ctx.restore();
      }
      if (s === 3 && p > .8) sparkle(ctx, 250, -60, t);
      ctx.restore();
    },
    veneer(ctx, s, p, t) {
      ctx.save(); ctx.translate(W / 2, 470);
      mouth(ctx);
      const close = s >= 2 ? (s === 2 ? ease(p) : 1) : 0;
      const T = frontTeeth(0, null, null, 1 - close);
      const prep = s === 1 ? ease(p) : s > 1 ? 1 : 0;
      T.forEach((o, i) => {
        tooth(ctx, o, mix("#E9D9A6", "#EEDFB8", prep), i === 2 && s < 2 ? "chip" : null);
        // veneer shell
        if (s >= 2) {
          const a = s === 2 ? ease(clamp(p * 1.3 - i * .05)) : 1;
          ctx.save(); ctx.globalAlpha = a; ctx.translate(0, (1 - a) * 80); tooth(ctx, o, "#FDFDFB"); ctx.restore();
        }
      });
      if (s === 1) { ctx.strokeStyle = `rgba(29,95,168,${.6 * Math.abs(Math.sin(t * 4))})`; ctx.lineWidth = 3; T.forEach(o => { ctx.save(); ctx.translate(o.x, o.y); rr(ctx, -o.w / 2 + 6, 6, o.w - 12, o.h - 12, 14); ctx.stroke(); ctx.restore(); }); }
      if (s === 3) { sparkle(ctx, -150, 40, t); if (p > .5) sparkle(ctx, 170, 20, t + 1); }
      ctx.restore();
    }
  };

  function frontTeeth(align, offs, rots, gapK = 0) {
    const ws = [70, 78, 96, 96, 78, 70], hs = [150, 170, 200, 200, 170, 150];
    const gaps = [6, 6, 6 + 34 * gapK, 6, 6];
    let total = ws.reduce((a, b) => a + b, 0) + gaps.reduce((a, b) => a + b, 0), x = -total / 2;
    return ws.map((w, i) => {
      const o = { w, h: hs[i], x: x + w / 2, y: 0, r: 0 }; x += w + (gaps[i] || 0);
      if (offs) { o.x += offs[i][0] * (1 - align); o.y += offs[i][1] * (1 - align); o.r = rots[i] * (1 - align); }
      return o;
    });
  }
  function tooth(ctx, o, col, flaw) {
    ctx.save(); ctx.translate(o.x, o.y); ctx.rotate(o.r);
    ctx.beginPath(); ctx.moveTo(-o.w / 2, 0); ctx.lineTo(o.w / 2, 0);
    ctx.lineTo(o.w / 2, o.h - 30); ctx.quadraticCurveTo(o.w / 2, o.h, o.w / 2 - 26, o.h);
    if (flaw === "chip") { ctx.lineTo(-o.w / 2 + 40, o.h); ctx.lineTo(-o.w / 2, o.h - 40); }
    else { ctx.lineTo(-o.w / 2 + 26, o.h); ctx.quadraticCurveTo(-o.w / 2, o.h, -o.w / 2, o.h - 30); }
    ctx.closePath();
    ctx.shadowColor = "rgba(40,0,10,.35)"; ctx.shadowBlur = 10; ctx.shadowOffsetY = 4;
    ctx.fillStyle = col; ctx.fill(); ctx.shadowColor = "transparent";
    ctx.save(); ctx.clip();
    const sg = ctx.createLinearGradient(-o.w / 2, 0, o.w / 2, 0); sg.addColorStop(0, "rgba(150,120,70,.28)"); sg.addColorStop(.3, "rgba(150,120,70,0)"); sg.addColorStop(.75, "rgba(150,120,70,0)"); sg.addColorStop(1, "rgba(150,120,70,.3)");
    ctx.fillStyle = sg; ctx.fillRect(-o.w / 2, 0, o.w, o.h);
    const vg = ctx.createLinearGradient(0, 0, 0, o.h); vg.addColorStop(0, "rgba(200,160,90,.25)"); vg.addColorStop(.35, "rgba(200,160,90,0)"); vg.addColorStop(.85, "rgba(220,235,250,0)"); vg.addColorStop(1, "rgba(200,225,250,.45)");
    ctx.fillStyle = vg; ctx.fillRect(-o.w / 2, 0, o.w, o.h);
    ctx.restore();
    ctx.strokeStyle = "rgba(170,150,105,.7)"; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.6)"; ctx.beginPath(); ctx.ellipse(-o.w / 2 + 20, o.h * .4, 7, o.h * .24, 0, 0, 7); ctx.fill();
    ctx.restore();
  }
  function shade(ctx, x0, x1) { // soft cylindrical side shading over current clip/path area
    const g = ctx.createLinearGradient(x0, 0, x1, 0);
    g.addColorStop(0, "rgba(120,95,50,.22)"); g.addColorStop(.22, "rgba(120,95,50,0)"); g.addColorStop(.7, "rgba(120,95,50,0)"); g.addColorStop(1, "rgba(120,95,50,.26)");
    ctx.fillStyle = g; ctx.fillRect(x0, -800, x1 - x0, 1600);
  }
  function mouth(ctx) {
    const mg = ctx.createRadialGradient(0, 120, 40, 0, 120, 440); mg.addColorStop(0, "#5E1622"); mg.addColorStop(1, "#8C2F3A");
    ctx.fillStyle = mg; ctx.beginPath(); ctx.ellipse(0, 120, 430, 230, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = "#C46A72"; ctx.lineWidth = 26; ctx.beginPath(); ctx.ellipse(0, 120, 443, 243, 0, 0, 7); ctx.stroke();
    const gg = ctx.createLinearGradient(0, -130, 0, 30); gg.addColorStop(0, "#F7B5BC"); gg.addColorStop(1, "#E58C96");
    ctx.fillStyle = gg; ctx.beginPath(); ctx.ellipse(0, -10, 420, 120, 0, Math.PI, 0); ctx.lineTo(420, 30); ctx.lineTo(-420, 30); ctx.fill();
  }
  function screw(ctx, x, y, rot) {
    ctx.save(); ctx.translate(x, y);
    const g = ctx.createLinearGradient(-40, 0, 40, 0); g.addColorStop(0, "#7D8894"); g.addColorStop(.5, "#D5DCE3"); g.addColorStop(1, "#7D8894");
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-38, 0); ctx.lineTo(38, 0); ctx.lineTo(26, 260); ctx.quadraticCurveTo(0, 290, -26, 260); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#5F6B78"; ctx.lineWidth = 4;
    const ph = (rot % 1) * 26;
    for (let yy = 14 + ph; yy < 255; yy += 26) { const w = 38 - yy * .047 + 8; ctx.beginPath(); ctx.moveTo(-w, yy); ctx.lineTo(w, yy - 9); ctx.stroke(); }
    ctx.fillStyle = "#B9C3CD"; rr(ctx, -40, -14, 80, 18, 5); ctx.fill();
    ctx.restore();
  }
  function sparkle(ctx, x, y, t) {
    const s = 1 + .25 * Math.sin(t * 6);
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = "#F4C542";
    ctx.beginPath(); for (let i = 0; i < 8; i++) { const r = i % 2 ? 9 : 30, a = i * Math.PI / 4; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.closePath(); ctx.fill(); ctx.restore();
  }
  function mix(a, b, p) {
    const h = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)); const A = h(a), B = h(b);
    return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], clamp(p)))).join(",")})`;
  }

  function draw(ctx, i, t) {
    const sc = SCENES[i], n = sc.steps.length;
    let step = Math.min(n - 1, Math.floor(t / STEP)), local = t - step * STEP;
    if (t >= n * STEP) { step = n - 1; local = STEP + (t - n * STEP); }
    const p = clamp(local / (STEP * .75));
    bg(ctx);
    ctx.save(); windowClip(ctx); DRAW[sc.key](ctx, step, p, t); ctx.restore();
    frame(ctx, sc, step, local);
  }
  window.DZExplainer = { SCENES, draw, duration, W, H };
})();
