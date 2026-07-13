document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;

  /* ---------------------------------------------------------------------
     Mobile nav toggle
     ------------------------------------------------------------------- */
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  const closeMobileNav = () => {
    if (!navToggle || !navLinks) return;
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  };

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.classList.toggle("nav-open", isOpen);
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMobileNav);
    });
  }

  /* ---------------------------------------------------------------------
     "Case Studies" dropdown
     ------------------------------------------------------------------- */
  document.querySelectorAll(".has-dropdown > .nav-link-btn").forEach((btn) => {
    btn.setAttribute("aria-haspopup", "true");
    btn.addEventListener("click", () => {
      const parent = btn.closest(".has-dropdown");
      const isOpen = parent.classList.contains("open");
      document.querySelectorAll(".has-dropdown.open").forEach((el) => {
        el.classList.remove("open");
        el.querySelector(".nav-link-btn")?.setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        parent.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".has-dropdown")) {
      document.querySelectorAll(".has-dropdown.open").forEach((el) => {
        el.classList.remove("open");
        el.querySelector(".nav-link-btn")?.setAttribute("aria-expanded", "false");
      });
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    const openDropdown = document.querySelector(".has-dropdown.open");
    if (openDropdown) {
      openDropdown.classList.remove("open");
      const btn = openDropdown.querySelector(".nav-link-btn");
      btn?.setAttribute("aria-expanded", "false");
      btn?.focus();
      return;
    }
    if (navLinks && navLinks.classList.contains("open")) {
      closeMobileNav();
      navToggle?.focus();
    }
  });

  /* ---------------------------------------------------------------------
     Theme + language toggles
     ------------------------------------------------------------------- */
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

  /* ---------------------------------------------------------------------
     Sticky nav — subtle state change once the page has scrolled
     ------------------------------------------------------------------- */
  const siteNav = document.querySelector(".site-nav");
  if (siteNav) {
    const sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.position = "absolute";
    sentinel.style.top = "0";
    sentinel.style.height = "1px";
    sentinel.style.width = "1px";
    document.body.prepend(sentinel);

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        ([entry]) => siteNav.classList.toggle("is-scrolled", !entry.isIntersecting)
      ).observe(sentinel);
    }
  }

  /* ---------------------------------------------------------------------
     Quiet entrance / scroll reveal — IntersectionObserver with a
     no-JS-required fallback (elements are visible by default if this
     never runs; the fallback below just skips the animation instantly).
     ------------------------------------------------------------------- */
  const revealTargets = document.querySelectorAll(".reveal, .reveal-stagger");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!("IntersectionObserver" in window) || prefersReducedMotion) {
    revealTargets.forEach((el) => el.classList.add("no-js"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach((el) => revealObserver.observe(el));
  }
});
