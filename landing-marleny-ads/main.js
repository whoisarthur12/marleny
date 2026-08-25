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

  /* No backend yet — validate natively, then show an inline success state. */
  function initConsultForm() {
    var form = $("#consult-form");
    var success = $("#form-success");
    if (!form || !success) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;

      // TODO: aquí se conecta el envío real (WhatsApp API / CRM) cuando esté definido.
      $$("input", form).forEach(function (input) { input.disabled = true; });
      var btn = $("button[type=submit]", form);
      if (btn) btn.disabled = true;
      success.hidden = false;
    });
  }

  function boot() {
    safe(initReveals, "initReveals");
    safe(initConsultForm, "initConsultForm");
    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
