
const SILICON_FLOW_API_KEY = "sk-918a85d620604652a27ed72f92022ee7";
const SILICON_FLOW_API_URL = "https://api.deepseek.com/v1/chat/completions";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'COPIED_TEXT') {
    const copiedText = request.text;
    console.log('Background copied text saved:', copiedText);
    chrome.storage.local.set({ copiedText: copiedText }, () => {
      chrome.storage.local.get('popupWindowId', (data) => {
        if (data.popupWindowId) {
          chrome.windows.update(data.popupWindowId, { focused: true }, (window) => {
            if (chrome.runtime.lastError) {
              chrome.storage.local.remove('popupWindowId');
              createPopup();
            }
          });
        } else {
          createPopup();
        }
      });
    });
  }
});

function createPopup() {
  chrome.windows.create({
    url: 'popup.html',
    type: 'popup',
    width: 300,
    height: 200,
    left: 100,
    top: 100
  }, (window) => {
    if (window) {
      console.log('弹窗创建成功，窗口ID:', window.id);
      chrome.storage.local.set({ popupWindowId: window.id });
    }
  });
}
// 清理弹窗状态
chrome.windows.onRemoved.addListener((windowId) => {
  chrome.storage.local.get('popupWindowId', (data) => {
    if (data.popupWindowId === windowId) {
      chrome.storage.local.remove('popupWindowId');
    }
  });
});