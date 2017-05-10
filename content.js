addEventListener("message", e => {
  if (e.data.from !== 'web') return;

  chrome.runtime.sendMessage(e.data.content, function (response) {
    postMessage({
      from: 'extension',
      id: e.data.id,
      error: response.error,
      content: response.content
    }, "*")
  })
});
