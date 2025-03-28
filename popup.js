let translationPara, originalSpan;

document.addEventListener('DOMContentLoaded', () => {
  originalSpan = document.getElementById('original');
  translationPara = document.getElementById('translation');
  if (!originalSpan || !translationPara) {
    console.error('未找到元素: original 或 translation');
    return;
  }

  // 初始加载
  chrome.storage.local.get(['copiedText', 'llmResponse'], (data) => {
    console.log('初始加载:', data);
    originalSpan.textContent = data.copiedText || 'Copy text to translate...';
    translationPara.textContent = data.llmResponse || 'Waiting for translation...';
  });

  // 监听翻译结果变化
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.copiedText) {
      originalSpan.textContent = changes.copiedText.newValue || 'Copy text to translate...';
    }
    if (changes.llmResponse) {
      translationPara.textContent = changes.llmResponse.newValue || 'Waiting for translation...';
    }
  });
});