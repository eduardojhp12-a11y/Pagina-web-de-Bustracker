(() => {
  const root = document.documentElement;
  const intro = document.querySelector(".site-intro");
  if (intro && root.classList.contains("show-intro")) {
    window.setTimeout(() => {
      intro.remove();
      root.classList.remove("show-intro");
      try {
        sessionStorage.setItem("bustracker-intro-seen", "true");
      } catch (error) {
        console.warn("No se pudo guardar el estado de la animación de inicio.", error);
      }
    }, 2300);
  }

  const themeButton = document.querySelector("#theme-toggle");
  const themeIcon = themeButton.querySelector("use");
  const menuButton = document.querySelector("#menu-toggle");
  const menuIcon = menuButton.querySelector("use");
  const nav = document.querySelector("#site-navigation");
  const navMore = nav.querySelector(".nav-more");
  const storedTheme = localStorage.getItem("bustracker-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const socialProfiles = [
    { name: "Instagram", href: "https://www.instagram.com/bustracker_mcbo/", icon: "instagram" },
    { name: "Facebook", href: "https://www.facebook.com/profile.php?id=61594666055762", icon: "facebook" },
    { name: "TikTok", href: "https://www.tiktok.com/@bustrackermaracaibo?is_from_webapp=1&sender_device=pc", icon: "tiktok" }
  ];

  function createSocialIcon(name) {
    const namespace = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(namespace, "svg");
    const drawings = {
      instagram: [
        ["rect", { x: "3", y: "3", width: "18", height: "18", rx: "5", fill: "none", stroke: "currentColor", "stroke-width": "2" }],
        ["circle", { cx: "12", cy: "12", r: "4", fill: "none", stroke: "currentColor", "stroke-width": "2" }],
        ["circle", { cx: "17.6", cy: "6.7", r: "1.1", fill: "currentColor" }]
      ],
      facebook: [
        ["path", { d: "M13.4 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.6-1.6h1.7V3.8c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.2v3h2.8v8h3.4Z", fill: "currentColor" }]
      ],
      tiktok: [
        ["path", { d: "M19.2 8.6a5.9 5.9 0 0 1-3.4-1.1v7.3a5.8 5.8 0 1 1-5.8-5.8c.4 0 .8 0 1.2.1v3.2a2.7 2.7 0 1 0 1.5 2.4V3h3.2c.2 2 1.7 3.5 3.6 3.7v1.9Z", fill: "currentColor" }]
      ]
    };

    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    drawings[name].forEach(([tag, attributes]) => {
      const shape = document.createElementNS(namespace, tag);
      Object.entries(attributes).forEach(([attribute, value]) => shape.setAttribute(attribute, value));
      svg.appendChild(shape);
    });
    return svg;
  }

  document.querySelectorAll(".footer-grid").forEach(grid => {
    const navSocial = document.createElement("nav");
    const heading = document.createElement("p");
    const links = document.createElement("div");
    navSocial.className = "footer-socials";
    navSocial.setAttribute("aria-label", "Redes sociales");
    heading.className = "footer-socials-title";
    heading.textContent = "Redes del proyecto";
    links.className = "social-links";

    socialProfiles.forEach(profile => {
      const item = profile.href ? document.createElement("a") : document.createElement("span");
      item.className = profile.href ? "social-link" : "social-link social-link-pending";
      if (profile.href) {
        item.href = profile.href;
        item.target = "_blank";
        item.rel = "noopener noreferrer";
      } else {
        item.setAttribute("aria-label", `${profile.name}: perfil oficial pendiente de agregar`);
      }
      item.appendChild(createSocialIcon(profile.icon));
      const label = document.createElement("span");
      label.textContent = profile.href ? profile.name : `${profile.name} · perfil pendiente`;
      item.appendChild(label);
      links.appendChild(item);
    });

    navSocial.append(heading, links);
    grid.appendChild(navSocial);
  });

  const heroVideo = document.querySelector(".home-hero-video");
  if (heroVideo) {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

    function playHeroVideo() {
      if (document.visibilityState !== "visible") return;
      heroVideo.play().catch(error => {
        console.warn("No se pudo reproducir el video de fondo; se mostrará la imagen de respaldo.", error);
      });
    }

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") heroVideo.pause();
      else if (!motionPreference.matches && heroVideo.paused) playHeroVideo();
    });
    motionPreference.addEventListener("change", () => {
      if (motionPreference.matches) heroVideo.pause();
      else playHeroVideo();
    });

    if (motionPreference.matches || document.visibilityState !== "visible") {
      heroVideo.pause();
    } else {
      playHeroVideo();
    }
  }

  function setTheme(theme) {
    const dark = theme === "dark";
    root.dataset.theme = theme;
    themeButton.setAttribute("aria-label", dark ? "Activar modo claro" : "Activar modo oscuro");
    themeIcon.setAttribute("href", dark ? "#sun" : "#moon");
    document.querySelector('meta[name="theme-color"]').setAttribute("content", dark ? "#0c1724" : "#f5f8fc");
  }

  setTheme(storedTheme || (prefersDark ? "dark" : "light"));
  themeButton.addEventListener("click", () => {
    const theme = root.dataset.theme === "dark" ? "light" : "dark";
    setTheme(theme);
    localStorage.setItem("bustracker-theme", theme);
  });

  function closeMenu() {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menú");
    menuIcon.setAttribute("href", "#menu");
  }

  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    nav.classList.toggle("open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    menuIcon.setAttribute("href", open ? "#close" : "#menu");
  });

  nav.addEventListener("click", event => {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("click", event => {
    if (menuButton.getAttribute("aria-expanded") === "true" &&
        !nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      if (menuButton.getAttribute("aria-expanded") === "true") {
        closeMenu();
        menuButton.focus();
      }
      navMore.open = false;
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) closeMenu();
  });

  document.querySelectorAll("[data-accordion]").forEach(group => {
    group.querySelectorAll("details").forEach(detail => {
      detail.addEventListener("toggle", () => {
        if (!detail.open) return;
        group.querySelectorAll("details").forEach(other => {
          if (other !== detail) other.open = false;
        });
      });
    });
  });

  const year = document.querySelector("#current-year");
  if (year) year.textContent = String(new Date().getFullYear());

  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const revealItems = document.querySelectorAll(".card, .explore-card, .team-card, .impact-item, .flow-card, .model-card, .timeline-item, .hero-image, .image-promo, .visual-card, .process-visual");
  if (!motionPreference.matches && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    revealItems.forEach((item, index) => {
      item.dataset.reveal = "";
      item.style.setProperty("--reveal-delay", `${index % 3 * 80}ms`);
      revealObserver.observe(item);
    });
  }
})();
