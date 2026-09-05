const currentDomain = window.location.hostname;

// === 1. Pembersih DOM Otomatis & Aturan Tersimpan ===
const commonAdSelectors = [
  ".adsbygoogle",
  '[id^="div-gpt-ad"]',
  ".ad-banner",
  ".sponsor-post",
  'iframe[src*="ads"]',
];

function applyAllRules() {
  // Sembunyikan iklan umum
  commonAdSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => {
      el.style.setProperty("display", "none", "important");
    });
  });

  // Terapkan aturan Zapper tersimpan di domain ini
  chrome.storage.local.get([currentDomain], (result) => {
    const savedSelectors = result[currentDomain] || [];
    savedSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => {
        el.style.setProperty("display", "none", "important");
      });
    });
  });
}

applyAllRules();

const observer = new MutationObserver(() => applyAllRules());
if (document.body) {
  observer.observe(document.body, { childList: true, subtree: true });
}

// === 2. Logika Element Zapper ===
let isZapModeActive = false;

function enableZapMode() {
  isZapModeActive = true;
  document.body.style.cursor = "crosshair";

  document.addEventListener("mouseover", handleMouseOver, true);
  document.addEventListener("mouseout", handleMouseOut, true);
  document.addEventListener("click", handleClick, true);
}

function disableZapMode() {
  isZapModeActive = false;
  document.body.style.cursor = "default";

  document.removeEventListener("mouseover", handleMouseOver, true);
  document.removeEventListener("mouseout", handleMouseOut, true);
  document.removeEventListener("click", handleClick, true);
}

function handleMouseOver(e) {
  if (!isZapModeActive) return;
  e.target.style.outline = "2px solid #ef4444";
  e.target.style.outlineOffset = "-2px";
}

function handleMouseOut(e) {
  if (!isZapModeActive) return;
  e.target.style.outline = "";
  e.target.style.outlineOffset = "";
}

function handleClick(e) {
  if (!isZapModeActive) return;
  e.preventDefault();
  e.stopPropagation();

  const targetEl = e.target;
  const selector = getUniqueSelector(targetEl);

  targetEl.style.outline = "";
  targetEl.style.setProperty("display", "none", "important");

  // Simpan ke storage
  chrome.storage.local.get([currentDomain], (result) => {
    const existingSelectors = result[currentDomain] || [];
    if (!existingSelectors.includes(selector)) {
      existingSelectors.push(selector);
      chrome.storage.local.set({ [currentDomain]: existingSelectors });
    }
  });

  disableZapMode();
}

function getUniqueSelector(el) {
  if (el.id) return `#${CSS.escape(el.id)}`;
  if (
    el.className &&
    typeof el.className === "string" &&
    el.className.trim() !== ""
  ) {
    const classes = Array.from(el.classList)
      .map((c) => `.${CSS.escape(c)}`)
      .join("");
    return `${el.tagName.toLowerCase()}${classes}`;
  }
  return el.tagName.toLowerCase();
}

// Mendengarkan trigger dari popup.js
// Tambahkan aksi ini pada runtime listener di bagian bawah content.js:
chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "START_ZAPPER") {
    enableZapMode();
  } else if (request.action === "RESET_ZAPPER") {
    chrome.storage.local.get([currentDomain], (result) => {
      const savedSelectors = result[currentDomain] || [];
      savedSelectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((el) => {
          el.style.removeProperty("display");
        });
      });
    });
  } else if (request.action === "REMOVE_SINGLE_SELECTOR") {
    // Tampilkan kembali hanya elemen spesifik yang dihapus dari list
    document.querySelectorAll(request.selector).forEach((el) => {
      el.style.removeProperty("display");
    });
  }
});
