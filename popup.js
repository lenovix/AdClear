async function initPopup() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url) return;

  const url = new URL(tab.url);
  const currentDomain = url.hostname;

  // Read count from storage for current domain
  chrome.storage.local.get([currentDomain], (result) => {
    const savedSelectors = result[currentDomain] || [];
    const countEl = document.getElementById("zapCount");
    const resetBtn = document.getElementById("resetBtn");

    countEl.textContent = savedSelectors.length;
    resetBtn.disabled = savedSelectors.length === 0;
  });

  // Trigger Zapper Mode
  document.getElementById("zapBtn").addEventListener("click", () => {
    chrome.tabs.sendMessage(tab.id, { action: "START_ZAPPER" });
    window.close();
  });

  // Trigger Reset Action
  document.getElementById("resetBtn").addEventListener("click", () => {
    chrome.storage.local.remove([currentDomain], () => {
      chrome.tabs.sendMessage(tab.id, { action: "RESET_ZAPPER" });
      window.location.reload(); // Refresh popup interface
    });
  });
}

initPopup();
