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

  document.querySelectorAll("form[data-formsubmit-ajax]").forEach((form) => {
    const submitButton = form.querySelector('button[type="submit"]');
    const successMessage = form.querySelector(".form-success");
    const errorMessage = form.querySelector(".form-error");
    const defaultButtonText = submitButton ? submitButton.textContent : "";

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const endpoint = form.action.replace("https://formsubmit.co/", "https://formsubmit.co/ajax/");
      const formData = new FormData(form);

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
      }
      if (successMessage) successMessage.hidden = true;
      if (errorMessage) errorMessage.hidden = true;

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" }
        });
        const isJson = response.headers.get("content-type")?.includes("application/json");
        const result = isJson ? await response.json() : {};
        const message = String(result.message || "");

        if (!response.ok || !isJson || result.success === false || result.success === "false") {
          throw new Error(message || "FormSubmit could not send the submission.");
        }

        form.reset();
        form.querySelectorAll("select").forEach((select) => {
          select.dispatchEvent(new Event("change", { bubbles: true }));
        });
        if (successMessage) successMessage.hidden = false;
      } catch (error) {
        if (errorMessage) {
          const needsActivation = /activate|confirm/i.test(error.message);
          errorMessage.innerHTML = needsActivation
            ? 'FormSubmit needs the TripQuest inbox to confirm this form before it can deliver messages. Please check <a href="mailto:thetripquestapp@gmail.com">thetripquestapp@gmail.com</a> for the activation email.'
            : 'Something blocked the send. Please email <a href="mailto:thetripquestapp@gmail.com">thetripquestapp@gmail.com</a> directly.';
          errorMessage.hidden = false;
        }
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = defaultButtonText;
        }
      }
    });
  });

});
