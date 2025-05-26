chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'analyzeText') {
    fetch('https://capital-fully-mammoth.ngrok-free.app/classic/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: msg.text })
    })
      .then(r => {
        if (!r.ok) throw new Error(r.status);
        return r.json();
      })
      .then(data => sendResponse({ status: 'ok', data }))
      .catch(err => sendResponse({ status: 'error', error: err.toString() }));

    // Indică faptul că sendResponse e asincron
    return true;
  }
});
