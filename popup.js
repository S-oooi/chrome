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
      setTimeout(adjustWindowSize, 500);
    }
  });
});

// 调整弹窗大小
function adjustWindowSize() {
  // 强制重新计算尺寸
  const body = document.body;
  body.style.height = 'auto'; // 强制重置高度
  body.style.width = 'auto'; // 强制重置宽度
  const width = Math.max(body.scrollWidth, body.offsetWidth, 280); // 最小宽度 280
  const height = Math.max(body.scrollHeight, body.offsetHeight, 100); // 最小高度 100

  // 加上额外的缓冲空间，确保内容完全显示
  const adjustedWidth = Math.max(width + 50, 280); // 增加更多宽度缓冲
  const adjustedHeight = Math.max(height + 80, 100); // 增加更多高度缓冲

  console.log('计算尺寸:', { 
    scrollWidth: body.scrollWidth, 
    offsetWidth: body.offsetWidth, 
    scrollHeight: body.scrollHeight, 
    offsetHeight: body.offsetHeight, 
    adjustedWidth, 
    adjustedHeight 
  });

  // 获取当前窗口 ID 并调整大小
  chrome.windows.getCurrent((window) => {
    if (window.id) {
      chrome.windows.update(window.id, {
        width: adjustedWidth,
        height: adjustedHeight,
        focused: true
      }, () => {
        if (chrome.runtime.lastError) {
          console.error('调整窗口大小失败:', chrome.runtime.lastError);
        } else {
          console.log('窗口大小调整为:', { width: adjustedWidth, height: adjustedHeight });
        }
      });
    }
  });
}