document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const navToggle = document.getElementById("navToggle");
  const body = document.body;
  const nav = document.getElementById("siteNav");

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const isOpen = body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        body.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }
  const params = new URLSearchParams(window.location.search);
  const successEl = document.getElementById("formSuccess");
  if (successEl && params.get("sent") === "1") {
    successEl.hidden = false;
    successEl.scrollIntoView({ behavior: "smooth", block: "center" });
  }

});
