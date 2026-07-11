/* AgentHub marketing site — tiny vanilla JS, no dependencies. */
(function () {
  "use strict";

  document.documentElement.classList.add("js");
  var staticMode = new URLSearchParams(window.location.search).has("static");
  var reduce = staticMode || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* --- sticky nav: add a hairline border once scrolled --- */
  var nav = document.getElementById("nav");
  function onScroll() {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* --- mobile menu --- */
  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("mobileMenu");
  var toggleIcon = document.getElementById("navToggleIcon");
  function setIcon(open) {
    if (toggleIcon) toggleIcon.setAttribute("href", open ? "#i-x" : "#i-menu");
  }
  function closeMenu() {
    if (!menu || !toggle) return;
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    setIcon(false);
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      setIcon(open);
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }
  window.addEventListener("resize", function () {
    if (window.innerWidth > 640) closeMenu();
  });

  /* --- scroll reveal --- */
  var revealEls = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* --- hero: the run loop -------------------------------------------------
     A little theatre: ticket lands → context pack builds → plan approved →
     gates pass one by one → Draft PR opens. Loops forever; reduced-motion
     users get the finished state, statically. --- */
  var stage = document.getElementById("runStage");
  if (stage) {
    var steps = stage.querySelectorAll(".rs-step");
    var gates = stage.querySelectorAll(".gate");
    var pr = document.getElementById("rsPr");
    var showAll = function () {
      steps.forEach(function (s) { s.classList.add("on"); });
      gates.forEach(function (g) { g.classList.remove("run"); g.classList.add("pass"); });
      if (pr) pr.classList.add("on");
    };
    if (reduce) {
      showAll();
    } else {
      var timers = [];
      var at = function (ms, fn) { timers.push(setTimeout(fn, ms)); };
      var play = function () {
        timers.forEach(clearTimeout); timers = [];
        steps.forEach(function (s) { s.classList.remove("on"); });
        gates.forEach(function (g) { g.classList.remove("run", "pass"); });
        if (pr) pr.classList.remove("on");

        at(400, function () { steps[0] && steps[0].classList.add("on"); });
        at(1300, function () { steps[1] && steps[1].classList.add("on"); });
        at(2400, function () { steps[2] && steps[2].classList.add("on"); });
        /* gates: run → pass, staggered */
        var base = 3100, gap = 950;
        gates.forEach(function (g, i) {
          at(base + i * gap, function () { g.classList.add("run"); });
          at(base + i * gap + 780, function () { g.classList.remove("run"); g.classList.add("pass"); });
        });
        at(base + gates.length * gap + 500, function () { if (pr) pr.classList.add("on"); });
        at(base + gates.length * gap + 5200, play); /* hold, then loop */
      };
      /* start when visible, pause politely when tabbed away */
      var started = false;
      var startOnce = function () { if (!started) { started = true; play(); } };
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries, obs) {
          entries.forEach(function (e) { if (e.isIntersecting) { startOnce(); obs.disconnect(); } });
        }, { threshold: 0.3 }).observe(stage);
      } else {
        startOnce();
      }
      document.addEventListener("visibilitychange", function () {
        if (document.hidden) { timers.forEach(clearTimeout); timers = []; }
        else if (started) { play(); }
      });
    }
  }

  /* --- product tabs --- */
  var tabBtns = document.querySelectorAll(".tab-btn");
  var tabPanels = document.querySelectorAll(".tab-panel");
  var tabTitle = document.getElementById("tabTitle");
  var tabCap = document.getElementById("tabCap");
  var TAB_META = {
    board:   { t: "agenthub — Mission Control", c: "<b>Mission Control</b> — board or list, a split workspace with live preview, and ⌘K to jump anywhere." },
    run:     { t: "agenthub — run · AH-942",    c: "<b>Run cockpit</b> — a live phase timeline, streaming logs, and the quality scorecard that decides the PR." },
    inspect: { t: "agenthub — inspect · AH-888", c: "<b>Inspect</b> — Figma beside the real build. Pin what's off, send pins to the agent, sign off when it's right." },
    nova2:   { t: "agenthub — nova",             c: "<b>Nova</b> — a proactive assistant with one-tap actions, on the app and on your lock screen." },
    ask:     { t: "agenthub — ask",              c: "<b>Ask</b> — a Cursor-grade agent chat over your project: tool-step timeline, reviewable diffs, per-hunk revert." }
  };
  tabBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var id = btn.getAttribute("data-tab");
      tabBtns.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle("active", active);
        b.setAttribute("aria-selected", active ? "true" : "false");
      });
      tabPanels.forEach(function (p) {
        p.classList.toggle("active", p.getAttribute("data-panel") === id);
      });
      var meta = TAB_META[id];
      if (meta) {
        if (tabTitle) tabTitle.textContent = meta.t;
        if (tabCap) tabCap.innerHTML = meta.c;
      }
    });
  });

  /* --- bento cursor spotlight --- */
  if (!reduce && window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".bento-card").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - r.left) + "px");
        card.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }

  /* --- stat count-up --- */
  var counters = document.querySelectorAll("[data-count]");
  function runCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    if (reduce) { el.textContent = String(target); return; }
    var t0 = null, dur = 1100;
    function tick(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if (counters.length) {
    if (!("IntersectionObserver" in window) || reduce) {
      counters.forEach(function (el) { el.textContent = el.getAttribute("data-count"); });
    } else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { runCounter(entry.target); cio.unobserve(entry.target); }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { cio.observe(el); });
    }
  }

  /* --- copy install commands --- */
  var copyBtn = document.getElementById("copyCmd");
  if (copyBtn) {
    var original = copyBtn.innerHTML;
    copyBtn.addEventListener("click", function () {
      var cmds = Array.prototype.map
        .call(document.querySelectorAll("#cmdBlock .cmd"), function (n) { return n.textContent; })
        .join("\n");
      var done = function () {
        copyBtn.innerHTML = '<svg aria-hidden="true"><use href="#i-check"/></svg> Copied';
        setTimeout(function () { copyBtn.innerHTML = original; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(cmds).then(done).catch(function () { fallbackCopy(cmds, done); });
      } else {
        fallbackCopy(cmds, done);
      }
    });
  }
  function fallbackCopy(text, done) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); done(); } catch (e) { /* no-op */ }
    document.body.removeChild(ta);
  }

  /* --- footer year --- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* --- Download buttons: point straight at the latest release's .dmg (one-click), and show its
         version. Falls back to the static /releases/latest page link if the GitHub API is unreachable
         (rate-limited / offline). No manual link edits needed on each release. --- */
  var REPO = "agenthubapp/agenthubapp.github.io";
  var dlButtons = document.querySelectorAll(".js-dl");
  var verEl = document.getElementById("dlVersion");
  if (dlButtons.length) {
    fetch("https://api.github.com/repos/" + REPO + "/releases/latest", { headers: { Accept: "application/vnd.github+json" } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (rel) {
        if (!rel) return;
        if (verEl && rel.tag_name) verEl.textContent = rel.tag_name;
        var dmg = (rel.assets || []).filter(function (a) { return /\.dmg$/i.test(a.name); })[0];
        if (dmg && dmg.browser_download_url) {
          dlButtons.forEach(function (a) { a.setAttribute("href", dmg.browser_download_url); });
        }
      })
      .catch(function () { /* keep the static /releases/latest fallback */ });
  }
})();
