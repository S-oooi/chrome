//// 监听 copy 事件
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'COPIED_TEXT') {
      const copiedText = request.text;
      console.log('Background copied text saved:', copiedText);
    }})