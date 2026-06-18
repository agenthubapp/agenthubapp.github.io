/* AgentHub marketing site — tiny vanilla JS, no dependencies. */
(function () {
  "use strict";

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
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
})();
