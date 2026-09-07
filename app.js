/* AgentHub marketing site — tiny vanilla JS, no dependencies, no build step. */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

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
    if (window.innerWidth > 860) closeMenu();
  });

  /* --- footer year --- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* --- hero loop video: only turn on for visitors who don't ask for less motion.
     CSS defaults to the poster image; this class is the only thing that reveals
     the <video>, so a reduced-motion visitor (or anyone with JS off) just sees
     the still frame. --- */
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion) {
    document.querySelectorAll(".hero-visual").forEach(function (el) {
      el.classList.add("js-video");
    });
  }

  /* --- storyboard: each step gets a quiet highlight as it enters the viewport.
     Every step is fully visible without this — it only adds the "lit" border,
     so it degrades to a plain 3-up list with no JS. --- */
  var steps = document.querySelectorAll(".story-step");
  if (steps.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    steps.forEach(function (step) { io.observe(step); });
  }
})();
