async function initPopup() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url) return;

  const url = new URL(tab.url);
  const currentDomain = url.hostname;

  const countEl = document.getElementById("zapCount");
  const resetBtn = document.getElementById("resetBtn");
  const toggleListBtn = document.getElementById("toggleListBtn");
  const listContainer = document.getElementById("listContainer");
  const itemList = document.getElementById("itemList");

  // Load status dan list elemen
  function loadSavedElements() {
    chrome.storage.local.get([currentDomain], (result) => {
      const savedSelectors = result[currentDomain] || [];

      countEl.textContent = savedSelectors.length;
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

      // Event listener untuk hapus item individual
      document.querySelectorAll(".btn-del-item").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const itemIdx = parseInt(e.target.getAttribute("data-index"));
          removeSingleSelector(itemIdx);
        });
      });
    });
  }

  // Hapus 1 elemen dari daftar
  function removeSingleSelector(index) {
    chrome.storage.local.get([currentDomain], (result) => {
      let savedSelectors = result[currentDomain] || [];
      const removedSelector = savedSelectors.splice(index, 1)[0];

      chrome.storage.local.set({ [currentDomain]: savedSelectors }, () => {
        // Beri tahu content.js untuk menampilkan kembali elemen tersebut
        chrome.tabs.sendMessage(tab.id, {
          action: "REMOVE_SINGLE_SELECTOR",
          selector: removedSelector,
        });
        loadSavedElements();
      });
    });
  }

  // Toggle List Container UI
  toggleListBtn.addEventListener("click", () => {
    const isVisible = listContainer.style.display === "block";
    listContainer.style.display = isVisible ? "none" : "block";
    toggleListBtn.textContent = isVisible
      ? "📋 Lihat List Elemen"
      : "🔒 Sembunyikan List";
  });

  // Trigger Zapper Mode
  document.getElementById("zapBtn").addEventListener("click", () => {
    chrome.tabs.sendMessage(tab.id, { action: "START_ZAPPER" });
    window.close();
  });

  // Trigger Reset All
  resetBtn.addEventListener("click", () => {
    chrome.storage.local.remove([currentDomain], () => {
      chrome.tabs.sendMessage(tab.id, { action: "RESET_ZAPPER" });
      window.location.reload();
    });
  });

  loadSavedElements();
}

initPopup();
