let translationPara;

document.addEventListener('DOMContentLoaded', () => {
  translationPara = document.getElementById('translation');
  if (!translationPara) {
    console.error('未找到 translation 元素');
    return;
  }

  // 初始加载
  chrome.storage.local.get('llmResponse', (data) => {
    translationPara.textContent = data.llmResponse || 'Copy text to translate...';
  });

  // 监听翻译结果变化
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.llmResponse) {
      console.log('翻译更新:', changes.llmResponse.newValue);
      translationPara.textContent = changes.llmResponse.newValue || 'Copy text to translate...';
    }
  });
});