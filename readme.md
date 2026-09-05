# AdClear - Fast & Lightweight Ad Blocker Extension

**AdClear** is a **Manifest V3** browser extension designed to block ads, tracking scripts, and unwanted web page elements quickly and efficiently.

## Key Features

- **Network-Level Filtering:** Automatically blocks ad requests, analytics, and tracking scripts using the Chrome `declarativeNetRequest` API.
- **Interactive Element Zapper:** A visual element selector that allows users to manually hide annoying divs or banners with a single click.
- **Domain-Based Persistence:** Element hiding rules are automatically saved in `chrome.storage.local` on a per-domain basis.
- **Real-Time Control:** An interactive popup UI featuring statistical counters and a Reset button to restore hidden elements.
- **Privacy-Focused:** 100% local browser processing with zero data collection (*Zero-Logs*).

## Tech Stack

- **Core Engine:** JavaScript (ES6+), Manifest V3 API (`declarativeNetRequest`, `storage`, `action`)
- **Content Scripting:** DOM Manipulation, `MutationObserver`
- **UI & Styling:** HTML5, CSS3

## Installation (Developer Mode)

1. Clone this repository or download the source code files.
2. Open Google Chrome / Microsoft Edge / Opera.
3. Navigate to the extensions page via `chrome://extensions/`.
4. Enable **Developer mode** using the toggle switch in the top-right corner.
5. Click **Load unpacked** and select the `AdClear` project folder.