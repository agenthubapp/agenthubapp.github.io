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
})();
