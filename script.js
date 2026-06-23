document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const navToggle = document.getElementById("navToggle");
  const body = document.body;
  const nav = document.getElementById("siteNav");

  if (navToggle && nav) {
    function setNavState(isOpen) {
      body.classList.toggle("nav-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    }

    navToggle.addEventListener("click", () => {
      setNavState(!body.classList.contains("nav-open"));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        setNavState(false);
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && body.classList.contains("nav-open")) {
        setNavState(false);
        navToggle.focus();
      }
    });
  }

  const params = new URLSearchParams(window.location.search);
  const successEl = document.getElementById("formSuccess");
  if (successEl && params.get("sent") === "1") {
    successEl.hidden = false;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    successEl.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center" });
  }

});
