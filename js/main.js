document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("open");
      toggle.setAttribute(
        "aria-expanded",
        links.classList.contains("open") ? "true" : "false"
      );
    });
  }

  document.querySelectorAll(".has-dropdown > .nav-link-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const parent = btn.closest(".has-dropdown");
      const isOpen = parent.classList.contains("open");
      document
        .querySelectorAll(".has-dropdown.open")
        .forEach((el) => el.classList.remove("open"));
      if (!isOpen) parent.classList.add("open");
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".has-dropdown")) {
      document
        .querySelectorAll(".has-dropdown.open")
        .forEach((el) => el.classList.remove("open"));
    }
  });

  const root = document.documentElement;

  const themeToggle = document.querySelector(".theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  }

  const langToggle = document.querySelector(".lang-toggle");
  if (langToggle) {
    const syncLangLabel = () => {
      langToggle.textContent = root.getAttribute("data-lang") === "en" ? "中" : "EN";
    };
    syncLangLabel();
    langToggle.addEventListener("click", () => {
      const next = root.getAttribute("data-lang") === "en" ? "zh" : "en";
      root.setAttribute("data-lang", next);
      localStorage.setItem("lang", next);
      if (window.applyTranslations) window.applyTranslations(next);
      syncLangLabel();
    });
  }
});
