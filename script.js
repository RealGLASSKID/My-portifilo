/* =========================================================
   GLASSKID PORTFOLIO — MAIN SCRIPT
   Vanilla JS, ES6+. Organized into sections:
   1. Utilities
   2. Preloader
   3. Custom Cursor
   4. Navigation (menu toggle, scroll spy, hide/show, smooth scroll)
   5. Hero Animations (split text, typing, parallax, spotlight)
   6. Scroll Reveal Animations
   7. Counters
   8. Skills Animation
   9. Project Cards (tilt)
   10. Magnetic Buttons + Ripple
   11. Text Scramble
   12. Contact Form
   13. Scroll-to-top
   ========================================================= */

(() => {
  "use strict";

  /* ===========================================================
     1. UTILITIES
  =========================================================== */
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const isFinePointer = window.matchMedia("(pointer: fine)").matches;

  const debounce = (fn, wait = 150) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  };

  const throttle = (fn, limit = 100) => {
    let inThrottle = false;
    return (...args) => {
      if (!inThrottle) {
        fn(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  };

  const lerp = (start, end, amt) => start + (end - start) * amt;

  const onReady = (cb) => {
    if (document.readyState !== "loading") cb();
    else document.addEventListener("DOMContentLoaded", cb);
  };

  /* ===========================================================
     2. PRELOADER
  =========================================================== */
  const initPreloader = () => {
    const preloader = document.getElementById("preloader");
    if (!preloader) return;
    const fill = document.getElementById("preloaderFill");

    let progress = 0;
    const tick = () => {
      progress += Math.random() * 18;
      if (progress > 92) progress = 92;
      if (fill) fill.style.width = `${progress}%`;
      if (progress < 92) requestAnimationFrame(() => setTimeout(tick, 60));
    };
    tick();

    const finish = () => {
      if (fill) fill.style.width = "100%";
      setTimeout(() => {
        preloader.classList.add("loaded");
        document.body.style.overflow = "";
        document.documentElement.classList.add("page-loaded");
      }, 250);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("load", finish, { once: true });
    // Safety net in case 'load' is delayed by slow external assets
    setTimeout(finish, 3500);
  };

  /* ===========================================================
     3. CUSTOM CURSOR
  =========================================================== */
  const initCustomCursor = () => {
    if (!isFinePointer || prefersReducedMotion) return;

    const dot = document.getElementById("cursor-dot");
    const outline = document.getElementById("cursor-outline");
    if (!dot || !outline) return;

    document.body.classList.add("cursor-enabled");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outlineX = mouseX;
    let outlineY = mouseY;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%,-50%)`;
    });

    const raf = () => {
      outlineX = lerp(outlineX, mouseX, 0.18);
      outlineY = lerp(outlineY, mouseY, 0.18);
      outline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) translate(-50%,-50%)`;
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    const hoverTargets = "a, button, input, textarea, .tilt-card, [data-cursor-hover]";
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(hoverTargets)) outline.classList.add("cursor-hover");
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(hoverTargets)) outline.classList.remove("cursor-hover");
    });
    document.addEventListener("mousedown", () => outline.classList.add("cursor-click"));
    document.addEventListener("mouseup", () => outline.classList.remove("cursor-click"));

    document.addEventListener("mouseleave", () => {
      dot.style.opacity = "0";
      outline.style.opacity = "0";
    });
    document.addEventListener("mouseenter", () => {
      dot.style.opacity = "1";
      outline.style.opacity = "1";
    });
  };

  /* ===========================================================
     4. NAVIGATION
  =========================================================== */
  const initNavigation = () => {
    const menuBtn = document.getElementById("menuBtn");
    const navLinks = document.getElementById("navLinks");
    const siteNav = document.getElementById("siteNav");

    // --- Mobile floating nav open/close (same trigger/target as before,
    //     now with a smooth animated class instead of an instant "hidden") ---
    if (menuBtn && navLinks) {
      menuBtn.setAttribute("aria-expanded", "true");

      menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isHidden = navLinks.classList.toggle("mobile-nav-hidden");
        menuBtn.setAttribute("aria-expanded", String(!isHidden));
      });

      navLinks.addEventListener("click", (e) => e.stopPropagation());

      document.addEventListener("click", () => {
        navLinks.classList.add("mobile-nav-hidden");
        menuBtn.setAttribute("aria-expanded", "false");
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          navLinks.classList.add("mobile-nav-hidden");
          menuBtn.setAttribute("aria-expanded", "false");
        }
      });
    }

    // --- Smooth scroll for every in-page anchor link ---
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        const targetId = link.getAttribute("href");
        if (!targetId || targetId === "#") {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
          return;
        }
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: prefersReducedMotion ? "auto" : "smooth",
            block: "start",
          });
        }
      });
    });

    // --- Hide/show nav on scroll direction (desktop only, sticky bar) ---
    if (siteNav) {
      let lastY = window.scrollY;
      const desktopQuery = window.matchMedia("(min-width: 768px)");

      const onScroll = () => {
        const y = window.scrollY;
        siteNav.classList.toggle("nav-scrolled", y > 40);

        if (desktopQuery.matches) {
          if (y > lastY && y > 160) {
            siteNav.classList.add("nav-hidden");
          } else {
            siteNav.classList.remove("nav-hidden");
          }
        } else {
          siteNav.classList.remove("nav-hidden");
        }
        lastY = y;
      };

      window.addEventListener("scroll", throttle(onScroll, 80), { passive: true });
    }

    // --- Scroll spy: highlight active section in desktop + mobile + footer nav ---
    const sections = document.querySelectorAll("main section[id], header, section[id]");
    const navAnchors = document.querySelectorAll('a[href^="#"]');

    const setActive = (id) => {
      navAnchors.forEach((a) => {
        const href = a.getAttribute("href");
        const matches = id ? href === `#${id}` : href === "#";
        a.classList.toggle("desktop-active", matches);
        a.classList.toggle("mobile-active", matches);
      });
    };

    if ("IntersectionObserver" in window && sections.length) {
      const spyObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActive(entry.target.id || "");
            }
          });
        },
        { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
      );
      sections.forEach((s) => spyObserver.observe(s));
    }
  };

  /* ===========================================================
     5. HERO ANIMATIONS
  =========================================================== */
  // --- Split text reveal on the main headline ---
  // The heading's words are pre-split directly in the HTML (see index.html)
  // and the rise-in animation is driven entirely by CSS (.split-word in
  // style.css). No JS DOM rebuild here — that removes the one thing that
  // could previously make the heading go blank if it ever failed.

  const initHeroAnimations = () => {
    const glasskid = document.getElementById("glasskid");
    if (!glasskid) return;

    const text = glasskid.textContent; // "GLASSKID"
    glasskid.innerHTML = "";

    // Split into individual letters
    [...text].forEach((letter, index) => {
      const span = document.createElement("span");
      span.className = "glass-letter";
      span.textContent = letter;
      span.style.setProperty("--delay", `${index * 0.08}s`); // stagger
      glasskid.appendChild(span);
    });
  };

  // Run it
  document.addEventListener("DOMContentLoaded", initHeroAnimations);
  // --- Typing effect cycling through roles ---
  const typedEl = document.getElementById("typedRole");
  if (typedEl && !prefersReducedMotion) {
    const roles = ["Fullstack Web Developer", "Artist", "Songwriter", "Multi Instrumentalist"];
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const type = () => {
      const current = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(type, 1600);
          return;
        }
      } else {
        charIndex--;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }
      setTimeout(type, deleting ? 35 : 65);
    };
    type();
  }

  // --- Mouse parallax + spotlight on hero ---
  const heroHeader = document.querySelector("header");
  const heroImg = document.getElementById("heroImg");
  const spotlight = document.getElementById("heroSpotlight");

  if (heroHeader && isFinePointer && !prefersReducedMotion) {
    const handleMove = throttle((e) => {
      const rect = heroHeader.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width;
      const relY = (e.clientY - rect.top) / rect.height;

      if (heroImg) {
        const moveX = (relX - 0.5) * 18;
        const moveY = (relY - 0.5) * 18;
        heroImg.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      }
      if (spotlight) {
        spotlight.style.setProperty("--cursor-x", `${e.clientX - rect.left}px`);
        spotlight.style.setProperty("--cursor-y", `${e.clientY - rect.top}px`);
      }
    }, 30);

    heroHeader.addEventListener("mousemove", handleMove);
  }

/* ===========================================================
   6. SCROLL REVEAL ANIMATIONS
=========================================================== */
const initScrollReveal = () => {
  const revealEls = document.querySelectorAll("[data-reveal]");
  if (!revealEls.length) return;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  revealEls.forEach((el, i) => {
    el.style.setProperty("--reveal-delay", `${Math.min(i % 6, 5) * 0.08}s`);
    observer.observe(el);
  });
};

/* ===========================================================
   7. COUNTERS
=========================================================== */
const initCounters = () => {
  const counters = document.querySelectorAll("[data-counter]");
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.counter, 10) || 0;
    if (prefersReducedMotion) {
      el.textContent = target;
      return;
    }
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((c) => observer.observe(c));
  } else {
    counters.forEach(animateCounter);
  }
};

/* ===========================================================
   8. SKILLS ANIMATION
=========================================================== */
const initSkillsAnimation = () => {
  const bars = document.querySelectorAll(".skill-fill");
  if (!bars.length) return;

  const fill = (el) => {
    const width = el.dataset.width || "0";
    requestAnimationFrame(() => {
      el.style.width = `${width}%`;
    });
  };

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    bars.forEach(fill);
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fill(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  bars.forEach((b) => observer.observe(b));
};

/* ===========================================================
   9. PROJECT CARDS — subtle 3D tilt
=========================================================== */
const initProjectTilt = () => {
  if (!isFinePointer || prefersReducedMotion) return;
  const cards = document.querySelectorAll(".tilt-card");

  cards.forEach((card) => {
    const handleMove = (e) => {
      const rect = card.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${(-relY * 6).toFixed(2)}deg) rotateY(${(relX * 6).toFixed(2)}deg) translateZ(0)`;
    };
    const reset = () => {
      card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
    };
    card.addEventListener("mousemove", throttle(handleMove, 40));
    card.addEventListener("mouseleave", reset);
  });
};

/* ===========================================================
   10. MAGNETIC BUTTONS + RIPPLE
=========================================================== */
const initMagneticButtons = () => {
  const buttons = document.querySelectorAll(".magnetic-btn");

  buttons.forEach((btn) => {
    if (isFinePointer && !prefersReducedMotion) {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${relX * 0.25}px, ${relY * 0.35}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "translate(0,0)";
      });
    }

    // Ripple works regardless of pointer type
    btn.addEventListener("click", (e) => {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height);
      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });
};

/* ===========================================================
   11. TEXT SCRAMBLE (applied to the large faint section labels)
=========================================================== */
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = "!<>-_\\/[]{}—=+*^?#________";
  }
  setText(newText) {
    const oldText = this.el.textContent;
    const length = Math.max(oldText.length, newText.length);
    const queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 20);
      const end = start + Math.floor(Math.random() * 20);
      queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    return new Promise((resolve) => {
      this.resolve = resolve;
      this.queue = queue;
      this.update();
    });
  }
  update() {
    let output = "";
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      const { from, to, start, end } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        output += this.randomChar();
      } else {
        output += from;
      }
    }
    this.el.textContent = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(() => this.update());
      this.frame++;
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

const initTextScramble = () => {
  const targets = document.querySelectorAll("[data-scramble]");
  if (!targets.length || prefersReducedMotion || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const fx = new TextScramble(el);
          fx.setText(el.textContent.trim());
          obs.unobserve(el);
        }
      });
    },
    { threshold: 0.6 }
  );
  targets.forEach((el) => observer.observe(el));
};

/* ===========================================================
   12. CONTACT FORM — validation, loading, success
=========================================================== */
const initContactForm = () => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const submitBtn = document.getElementById("contactSubmitBtn");
  const successBox = document.getElementById("formSuccess");

  const fields = {
    name: form.querySelector('[name="name"]'),
    email: form.querySelector('[name="email"]'),
    subject: form.querySelector('[name="subject"]'),
    message: form.querySelector('[name="message"]'),
  };

  const errorFor = (field) => field?.parentElement.querySelector(".field-error-msg");

  const validators = {
    name: (v) => (v.trim().length >= 2 ? "" : "Please enter your name."),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Enter a valid email address."),
    subject: (v) => (v.trim().length >= 3 ? "" : "Give it a short subject."),
    message: (v) => (v.trim().length >= 10 ? "" : "Message should be at least 10 characters."),
  };

  const validateField = (key) => {
    const field = fields[key];
    if (!field) return true;
    const msgEl = errorFor(field);
    const error = validators[key](field.value);
    field.classList.toggle("form-field-error", Boolean(error));
    if (msgEl) msgEl.textContent = error;
    return !error;
  };

  Object.keys(fields).forEach((key) => {
    const field = fields[key];
    if (!field) return;
    // ensure an error message slot exists
    if (!errorFor(field)) {
      const msg = document.createElement("p");
      msg.className = "field-error-msg";
      field.parentElement.appendChild(msg);
    }
    field.addEventListener("blur", () => validateField(key));
    field.addEventListener("input", () => {
      if (field.classList.contains("form-field-error")) validateField(key);
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const allValid = Object.keys(fields).every((key) => validateField(key));
    if (!allValid) return;

    if (submitBtn) submitBtn.classList.add("btn-loading");
    if (submitBtn) submitBtn.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        form.reset();
        if (successBox) {
          successBox.classList.add("show");
          successBox.setAttribute("role", "status");
        }
      } else {
        throw new Error("Submission failed");
      }
    } catch (err) {
      if (successBox) {
        successBox.textContent =
          "Something went wrong sending your message — please email glasskid01@gmail.com directly.";
        successBox.classList.add("show");
      }
    } finally {
      if (submitBtn) {
        submitBtn.classList.remove("btn-loading");
        submitBtn.disabled = false;
      }
    }
  });
};

/* ===========================================================
   13. SCROLL-TO-TOP
=========================================================== */
const initScrollTop = () => {
  const btn = document.getElementById("scrollTopBtn");
  if (!btn) return;

  const toggle = throttle(() => {
    btn.classList.toggle("visible", window.scrollY > 480);
  }, 150);

  window.addEventListener("scroll", toggle, { passive: true });
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });
};

/* ===========================================================
   INIT
=========================================================== */
onReady(() => {
  initPreloader();
  initCustomCursor();
  initNavigation();
  initHeroAnimations();
  initScrollReveal();
  initCounters();
  initSkillsAnimation();
  initProjectTilt();
  initMagneticButtons();
  initTextScramble();
  initContactForm();
  initScrollTop();
});
}) ();
