const currentDomain = window.location.hostname;
let isProtectionEnabled = true;

const commonAdSelectors = [
  ".adsbygoogle",
  '[id^="div-gpt-ad"]',
  ".ad-banner",
  ".sponsor-post",
  'iframe[src*="ads"]',
];

function applyAllRules() {
  chrome.storage.local.get(["whitelistedDomains", currentDomain], (result) => {
    const whitelist = result.whitelistedDomains || [];
    isProtectionEnabled = !whitelist.includes(currentDomain);

    if (!isProtectionEnabled) return;

    // Sembunyikan iklan umum
    commonAdSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => {
        el.style.setProperty("display", "none", "important");
      });
    });

    // Terapkan aturan Zapper tersimpan
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

// === Logika Zapper & Listener ===
let isZapModeActive = false;

function enableZapMode() {
  if (!isProtectionEnabled) return;
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

// Runtime Listeners
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
    document.querySelectorAll(request.selector).forEach((el) => {
      el.style.removeProperty("display");
    });
  } else if (request.action === "TOGGLE_WHITELIST") {
    isProtectionEnabled = request.isEnabled;
    window.location.reload(); // Refresh halaman saat toggle diubah
  }
});
