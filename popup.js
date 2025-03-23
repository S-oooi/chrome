// popup.js
let translationPara; // 在全局作用域声明

document.addEventListener('DOMContentLoaded', () => {
  translationPara = document.getElementById('translation'); // 初始化
  if (!translationPara) {
    console.error('未找到 translation 元素');
    return;
  }

  // 初始加载时获取文本
  chrome.storage.local.get('copiedText', (data) => {
    translationPara.textContent = data.copiedText || 'Copy text to show here...';
  });

  // 监听存储变化，实时更新
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.copiedText) {
      console.log('更新文本:', changes.copiedText.newValue); // 调试用
      translationPara.textContent = changes.copiedText.newValue || 'Copy text to show here...';
    }
  });
});