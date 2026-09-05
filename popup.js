async function initPopup() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url) return;

  const url = new URL(tab.url);
  const currentDomain = url.hostname;

  const toggleStatus = document.getElementById("toggleStatus");
  const statusText = document.getElementById("statusText");
  const mainActions = document.getElementById("mainActions");
  const zapCount = document.getElementById("zapCount");
  const resetBtn = document.getElementById("resetBtn");
  const toggleListBtn = document.getElementById("toggleListBtn");
  const listContainer = document.getElementById("listContainer");
  const itemList = document.getElementById("itemList");

  // Load Whitelist State
  chrome.storage.local.get(["whitelistedDomains"], (result) => {
    const whitelist = result.whitelistedDomains || [];
    const isWhitelisted = whitelist.includes(currentDomain);

    toggleStatus.checked = !isWhitelisted;
    updateUIState(!isWhitelisted);
  });

  function updateUIState(isEnabled) {
    if (isEnabled) {
      statusText.textContent = "● Protection Active";
      statusText.className = "status";
      mainActions.style.display = "flex";
      loadSavedElements();
    } else {
      statusText.textContent = "○ Protection Disabled";
      statusText.className = "status disabled";
      mainActions.style.display = "none";
      listContainer.style.display = "none";
      zapCount.textContent = "OFF";
    }
  }

  // Toggle On/Off Event
  toggleStatus.addEventListener("change", () => {
    const isEnabled = toggleStatus.checked;

    chrome.storage.local.get(["whitelistedDomains"], (result) => {
      let whitelist = result.whitelistedDomains || [];

      if (!isEnabled) {
        if (!whitelist.includes(currentDomain)) whitelist.push(currentDomain);
      } else {
        whitelist = whitelist.filter((d) => d !== currentDomain);
      }

      chrome.storage.local.set({ whitelistedDomains: whitelist }, () => {
        updateUIState(isEnabled);

        // Update aturan jaringan di background.js
        chrome.runtime.sendMessage({ action: "UPDATE_NETWORK_RULES" }, () => {
          // Kirim pesan ke content script & refresh tab
          chrome.tabs.sendMessage(tab.id, {
            action: "TOGGLE_WHITELIST",
            isEnabled,
          });
        });
      });
    });
  });

  function loadSavedElements() {
    chrome.storage.local.get([currentDomain], (result) => {
      const savedSelectors = result[currentDomain] || [];
      zapCount.textContent = savedSelectors.length;
      resetBtn.disabled = savedSelectors.length === 0;
      toggleListBtn.disabled = savedSelectors.length === 0;

      itemList.innerHTML = "";
      savedSelectors.forEach((selector, index) => {
        const li = document.createElement("li");
        li.className = "item-row";
        li.innerHTML = `
          <span class="selector-text" title="${selector}">${selector}</span>
          <button class="btn-del-item" data-index="${index}">✕</button>
        `;
        itemList.appendChild(li);
      });

      document.querySelectorAll(".btn-del-item").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          removeSingleSelector(parseInt(e.target.getAttribute("data-index")));
        });
      });
    });
  }

  function removeSingleSelector(index) {
    chrome.storage.local.get([currentDomain], (result) => {
      let savedSelectors = result[currentDomain] || [];
      const removedSelector = savedSelectors.splice(index, 1)[0];

      chrome.storage.local.set({ [currentDomain]: savedSelectors }, () => {
        chrome.tabs.sendMessage(tab.id, {
          action: "REMOVE_SINGLE_SELECTOR",
          selector: removedSelector,
        });
        loadSavedElements();
      });
    });
  }

  toggleListBtn.addEventListener("click", () => {
    const isVisible = listContainer.style.display === "block";
    listContainer.style.display = isVisible ? "none" : "block";
    toggleListBtn.textContent = isVisible
      ? "📋 Lihat List Elemen"
      : "🔒 Sembunyikan List";
  });

  document.getElementById("zapBtn").addEventListener("click", () => {
    chrome.tabs.sendMessage(tab.id, { action: "START_ZAPPER" });
    window.close();
  });

  resetBtn.addEventListener("click", () => {
    chrome.storage.local.remove([currentDomain], () => {
      chrome.tabs.sendMessage(tab.id, { action: "RESET_ZAPPER" });
      window.location.reload();
    });
  });
}

initPopup();
