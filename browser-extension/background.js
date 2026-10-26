const REDACT_SELECTION = "payloadforge-redact-selection";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ installedAt: new Date().toISOString() });
  chrome.contextMenus.create({
    id: REDACT_SELECTION,
    title: "PayloadForge: Redact secrets",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId !== REDACT_SELECTION || !info.selectionText) return;
  chrome.storage.local.set({ selectedText: info.selectionText });
  chrome.action.openPopup().catch(() => {});
});
