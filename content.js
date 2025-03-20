document.addEventListener('copy', () => {
    const text = window.getSelection().toString();
    if (text) {
      chrome.runtime.sendMessage({type: 'COPIED_TEXT', text: text});
    }
  });