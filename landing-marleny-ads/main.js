(function () {
  "use strict";

  var $  = function (sel, scope) { return (scope || document).querySelector(sel); };
  var $$ = function (sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); };

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn("[" + name + "] failed:", e); }
  }

  /* Fade-in + slide-up on scroll, with a safety timeout so nothing
     stays hidden if the observer never fires (old browser, JS hiccup). */
  function initReveals() {
    var items = $$(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -2% 0px" });

    items.forEach(function (el) { io.observe(el); });

    setTimeout(function () {
      items.forEach(function (el) {
        if (!el.classList.contains("is-visible")) el.classList.add("is-visible");
      });
    }, 6000);
  }

  /* Animated count-up for the "150+" social-proof stat, once it enters view. */
  function initCountUp() {
    var el = $("[data-count-to]");
    if (!el) return;
    var target = parseInt(el.getAttribute("data-count-to"), 10) || 0;

    function run() {
      var start = null;
      var duration = 1200;
      function tick(ts) {
        if (start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        el.textContent = Math.round(progress * target);
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    if (!("IntersectionObserver" in window)) { el.textContent = target; return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { run(); io.unobserve(entry.target); }
      });
    }, { threshold: 0.3 });
    io.observe(el);
  }

  function boot() {
    safe(initReveals, "initReveals");
    safe(initCountUp, "initCountUp");
    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
