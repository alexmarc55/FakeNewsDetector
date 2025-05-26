// background.js

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  // Debug: ce mesaj primim?
  console.log('Background received message:', msg);

  // 1) Sumarizare
  if (msg.action === 'summarizeText') {
    const summaryUrl = 'https://capital-fully-mammoth.ngrok-free.app/summary/summarize';
    console.log('⚙️ Fetching summary from:', summaryUrl);

    fetch(summaryUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: msg.text })
    })
    .then(response => {
      console.log('→ Summary fetch status:', response.status, response.statusText);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(data => {
      console.log('✅ Summary data:', data);
      sendResponse({ status: 'ok', data });
    })
    .catch(err => {
      console.error('❌ Summary fetch error:', err);
      sendResponse({ status: 'error', error: err.toString() });
    });

    return true;  // răspuns asincron
  }

  // 2) Analiză Fake/Real
  if (msg.action === 'analyzeText') {
    const analyzeUrl = 'https://capital-fully-mammoth.ngrok-free.app/classic/predict';
    console.log('⚙️ Fetching analysis from:', analyzeUrl);

    fetch(analyzeUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: msg.text })
    })
    .then(response => {
      console.log('→ Analysis fetch status:', response.status, response.statusText);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(data => {
      console.log('✅ Analysis data:', data);
      sendResponse({ status: 'ok', data });
    })
    .catch(err => {
      console.error('❌ Analysis fetch error:', err);
      sendResponse({ status: 'error', error: err.toString() });
    });

    return true;  // răspuns asincron
  }
});
