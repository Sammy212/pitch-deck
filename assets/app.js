/* ============================================================
   BRAND — the only block you need to edit.
   ============================================================ */
const BRAND = {
    name: "dataDocs",
    location: "Lagos, Nigeria",
    year: "2026",
    email: "hello@datadocs.com.ng",
    phone: "+234 703 620 9261",
    site: "datadocs.com.ng"
};

/* ============================================================ */
const slides = Array.from(document.querySelectorAll(".slide"));
const progress = document.getElementById("progress");
const overview = document.getElementById("overview");
const ovGrid = document.getElementById("ovGrid");
const notesBar = document.getElementById("notesBar");
const notesText = document.getElementById("notesText");

let current = 0;
let notesOpen = false;

function applyBrand() {
    document.title = BRAND.name + " — Web & Mobile Product Engineering";
    document.querySelectorAll("[data-brand]").forEach((el) => {
        const key = el.getAttribute("data-brand");
        if (BRAND[key]) el.textContent = BRAND[key];
    });
    document.querySelectorAll("[data-brand-link]").forEach((el) => {
        const key = el.getAttribute("data-brand-link");
        if (!BRAND[key]) return;
        el.textContent = BRAND[key];
        if (key === "email") el.href = "mailto:" + BRAND.email;
        if (key === "phone") el.href = "tel:" + BRAND.phone.replace(/[^\d+]/g, "");
        if (key === "site") el.href = BRAND.site.startsWith("http") ? BRAND.site : "https://" + BRAND.site;
    });
};

function pad(n) { return String(n).padStart(2, "0"); }

function render() {
    slides.forEach((s, i) => s.classList.toggle("is-active", i === current));
    progress.style.width = ((current + 1) / slides.length) * 100 + "%";

    const note = slides[current].querySelector(".notes");
    notesText.textContent = note ? note.textContent : "No note for this slide.";

    Array.from(ovGrid.children).forEach((c, i) => c.classList.toggle("is-current", i === current));

    if (history.replaceState) history.replaceState(null, "", "#" + (current + 1));
    slides[current].scrollTop = 0;
};

function go(i) {
    current = Math.max(0, Math.min(slides.length - 1, i));
    render();
};

function buildChrome() {
    slides.forEach((s, i) => {
        const counter = s.querySelector(".counter");
        if (counter) counter.textContent = pad(i + 1) + " / " + pad(slides.length);

        const card = document.createElement("button");
        card.type = "button";
        card.className = "ov-card";
        card.innerHTML = '<span class="n">' + pad(i + 1) + '</span><span class="t"></span>';
        card.querySelector(".t").textContent = s.dataset.title || "Slide " + (i + 1);
        card.addEventListener("click", () => {
            go(i);
            overview.classList.remove("is-open");
        });
        ovGrid.appendChild(card);
    });
};

document.getElementById("btnNext").addEventListener("click", () => go(current + 1));
document.getElementById("btnPrev").addEventListener("click", () => go(current - 1));
document.getElementById("btnGrid").addEventListener("click", () => overview.classList.toggle("is-open"));

document.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    if (k === "escape") { overview.classList.remove("is-open"); return; }
    if (k === "arrowright" || k === "pagedown" || e.key === " ") { e.preventDefault(); go(current + 1); }
    else if (k === "arrowleft" || k === "pageup") { e.preventDefault(); go(current - 1); }
    else if (k === "home") go(0);
    else if (k === "end") go(slides.length - 1);
    else if (k === "g") overview.classList.toggle("is-open");
    else if (k === "n") { notesOpen = !notesOpen; notesBar.classList.toggle("is-open", notesOpen); }
    else if (k === "f") {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen();
    };
});

/* swipe on touch devices */
let touchX = null;
document.addEventListener("touchstart", (e) => { touchX = e.changedTouches[0].clientX; }, { passive: true });
document.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 60) go(current + (dx < 0 ? 1 : -1));
    touchX = null;
}, { passive: true });

applyBrand();
buildChrome();
const fromHash = parseInt(window.location.hash.replace("#", ""), 10);
go(Number.isFinite(fromHash) && fromHash > 0 ? fromHash - 1 : 0);