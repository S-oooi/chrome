// popup.js
document.addEventListener('DOMContentLoaded', () => {
    const translationPara = document.getElementById('translation');
    
    // 获取复制的文本
    chrome.storage.local.get('copiedText', (data) => {
      if (data.copiedText) {
        translationPara.textContent = data.copiedText; // 显示原始文本
      } else {
        translationPara.textContent = 'Copy text to show here...';
      }
    });
  });