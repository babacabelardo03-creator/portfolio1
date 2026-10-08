/* Abelardo Pangan Babac - Portfolio */
"use strict";

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const EMAIL = "abelardobabac34@gmail.com";

/* ---------- Toast ---------- */
const toast = $("#toast");
let toastTimer;
function showToast(msg) {
    clearTimeout(toastTimer);
    toast.textContent = msg;
    toast.classList.add("show");
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}

/* ---------- Light / Dark theme ---------- */
const root = document.documentElement;
const themeBtn = $("#themeToggle");

function applyTheme(theme, save) {
    root.setAttribute("data-theme", theme);
    themeBtn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    if (save) { try { localStorage.setItem("theme", theme); } catch (e) { /* storage blocked */ } }
}
applyTheme(root.getAttribute("data-theme") || "light", false);

themeBtn.addEventListener("click", () => {
    applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark", true);
});

/* follow the OS setting only until the visitor picks one manually */
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    let saved = null;
    try { saved = localStorage.getItem("theme"); } catch (err) { /* ignore */ }
    if (!saved) applyTheme(e.matches ? "dark" : "light", false);
});

/* ---------- Mobile menu ---------- */
const menuToggle = $("#menuToggle");
const navMenu = $("#navMenu");

function setMenu(open) {
    navMenu.classList.toggle("open", open);
    menuToggle.classList.toggle("active", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
}
menuToggle.addEventListener("click", () => setMenu(!navMenu.classList.contains("open")));
$$(".nav-link").forEach((l) => l.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
addEventListener("resize", () => { if (innerWidth > 820) setMenu(false); });

/* ---------- Header + active link ---------- */
const header = $("#header");
const sections = $$("main section[id]");
const links = $$(".nav-link");

function onScroll() {
    header.classList.toggle("scrolled", scrollY > 20);
    const pos = scrollY + 140;
    let current = "";
    sections.forEach((s) => { if (pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight) current = s.id; });
    links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + current));
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Typing effect ---------- */
const typingEl = $("#typingText");
const words = ["Aspiring Web Developer", "Problem Solver", "PHP & MySQL Builder", "Future Software Developer"];
let w = 0, c = 0, deleting = false;

function type() {
    const word = words[w];
    c += deleting ? -1 : 1;
    typingEl.textContent = word.slice(0, c);
    let delay = deleting ? 40 : 80;
    if (!deleting && c === word.length) { deleting = true; delay = 1700; }
    else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; delay = 350; }
    setTimeout(type, delay);
}
if (!matchMedia("(prefers-reduced-motion: reduce)").matches) setTimeout(type, 1800);

/* ---------- Scroll reveal ---------- */
const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); }
    });
}, { threshold: 0.12 });
$$(".reveal").forEach((el) => io.observe(el));

/* ---------- Project filter ---------- */
const filters = $$(".filter");
const projects = $$(".project");
filters.forEach((btn) => btn.addEventListener("click", () => {
    filters.forEach((b) => b.classList.toggle("active", b === btn));
    const f = btn.dataset.filter;
    projects.forEach((p) => { p.hidden = !(f === "all" || p.dataset.cat === f); });
}));

/* ---------- Copy email ---------- */
$("#copyEmail").addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(EMAIL);
        showToast("Email copied to clipboard");
    } catch (e) {
        showToast("Email: " + EMAIL);
    }
});

/* ---------- Contact form -> opens visitor's email app ---------- */
const form = $("#contactForm");
const note = $("#formNote");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    $$("input, textarea", form).forEach((f) => {
        const valid = f.checkValidity() && f.value.trim() !== "";
        f.classList.toggle("invalid", !valid);
        if (!valid) ok = false;
    });
    if (!ok) { note.textContent = "Please fill in all fields with valid information."; return; }

    const name = $("#name").value.trim();
    const from = $("#email").value.trim();
    const msg = $("#message").value.trim();
    const subject = encodeURIComponent("Portfolio message from " + name);
    const body = encodeURIComponent(msg + "\n\n— " + name + " (" + from + ")");

    location.href = "mailto:" + EMAIL + "?subject=" + subject + "&body=" + body;
    note.textContent = "Opening your email app… if nothing happens, email me directly at " + EMAIL + ".";
    showToast("Opening your email app");
    form.reset();
});
$$("input, textarea", form).forEach((f) => f.addEventListener("input", () => f.classList.remove("invalid")));

/* ---------- Footer year ---------- */
$("#year").textContent = new Date().getFullYear();
