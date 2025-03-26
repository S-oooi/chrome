const DEEPSEEK_API_KEY = "sk-7a3923494dce40d7bd7cb885bd87bd01"; // 替换为你的 DeepSeek API 密钥
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'COPIED_TEXT') {
    const copiedText = request.text;
    console.log('Background copied text saved:', copiedText);

    // 存储原文和初始翻译状态
    chrome.storage.local.set({ 
      copiedText: copiedText, 
      llmResponse: '翻译中...' 
    }, () => {
      // 检查是否已有弹窗
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

      // 调用 DeepSeek API 翻译
      fetchDeepSeekResponse(copiedText).then(response => {
        chrome.storage.local.set({ llmResponse: response });
      }).catch(error => {
        chrome.storage.local.set({ llmResponse: '翻译失败: ' + error.message });
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

chrome.windows.onRemoved.addListener((windowId) => {
  chrome.storage.local.get('popupWindowId', (data) => {
    if (data.popupWindowId === windowId) {
      chrome.storage.local.remove('popupWindowId');
    }
  });
});

// DeepSeek API 调用函数
async function fetchDeepSeekResponse(text) {
  const requestBody = {
    model: "deepseek-chat", // 使用 DeepSeek 的聊天模型，可根据文档调整
    messages: [
      { role: "system", content: "你是一个翻译软件，把收到的英文翻译成中文返回。" },
      { role: "user", content: text }
    ]
  };
  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });
    if (!response.ok) throw new Error('API 请求失败: ' + response.status);
    const data = await response.json();
    return data.choices?.[0]?.message?.content || "翻译失败";
  } catch (error) {
    console.error("DeepSeek API 错误:", error);
    return "错误: " + error.message;
  }
}