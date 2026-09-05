// Mengelola aturan dinamis declarativeNetRequest untuk domain yang di-whitelist
async function updateDynamicRules() {
  const { whitelistedDomains = [] } =
    await chrome.storage.local.get("whitelistedDomains");

  // Ambil semua aturan session saat ini untuk dihapus
  const existingRules = await chrome.declarativeNetRequest.getSessionRules();
  const ruleIdsToRemove = existingRules.map((rule) => rule.id);

  if (whitelistedDomains.length === 0) {
    await chrome.declarativeNetRequest.updateSessionRules({
      removeRuleIds: ruleIdsToRemove,
      addRules: [],
    });
    return;
  }

  // Buat aturan pengecualian (allow) dengan priority tinggi untuk domain di-whitelist
  const newRules = whitelistedDomains.map((domain, index) => ({
    id: index + 1000,
    priority: 2, // Priority lebih tinggi dari rules.json (priority 1),
    action: { type: "allowAllRequests" },
    condition: {
      initiatorDomains: [domain],
      resourceTypes: [
        "main_frame",
        "sub_frame",
        "stylesheet",
        "script",
        "image",
        "font",
        "object",
        "xmlhttprequest",
        "ping",
        "csp_report",
        "media",
        "websocket",
        "other",
      ],
    },
  }));

  await chrome.declarativeNetRequest.updateSessionRules({
    removeRuleIds: ruleIdsToRemove,
    addRules: newRules,
  });
}

// Jalankan saat ekstensi di-install/di-update
chrome.runtime.onInstalled.addListener(() => {
  updateDynamicRules();
});

// Jalankan saat browser dibuka
chrome.runtime.onStartup.addListener(() => {
  updateDynamicRules();
});

// Listener saat status whitelist diubah dari popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "UPDATE_NETWORK_RULES") {
    updateDynamicRules().then(() => {
      sendResponse({ status: "success" });
    });
    return true;
  }
});
