// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'COPIED_TEXT') {
    const copiedText = request.text;
    console.log('Background copied text saved:', copiedText);

    // 存储复制的文本
    chrome.storage.local.set({ copiedText: copiedText }, () => {
      // 创建弹窗
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
    });
  }
});
