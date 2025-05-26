document.addEventListener('DOMContentLoaded', () => {
  const analyzeBtn = document.getElementById('analyzeButton');
  const clearBtn   = document.getElementById('clearDataButton');
  const container  = document.getElementById('collectedData');
  const fakeDiv    = document.getElementById('fakeData');

  analyzeBtn.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const tab = tabs[0];
      if (!tab) {
        alert('Nicio filă activă.');
        return;
      }

      // 1) Cere content script să colecteze textul paginii
      chrome.tabs.sendMessage(tab.id, { action: 'collectData' }, response => {
        if (response && response.status === 'success') {
          const data = response.collectedData;
          container.textContent = data.fullText;
          fakeDiv.textContent = 'Analiză în curs…';

          // 2) Trimite textul la background.js pentru apel API
          chrome.runtime.sendMessage(
            { action: 'analyzeText', text: data.fullText },
            apiRes => {
              if (apiRes.status === 'ok') {
                const fakePct = apiRes.data.Fake * 100;
                const realPct = apiRes.data.Real * 100;
                fakeDiv.innerHTML = 
                  `Fake: ${fakePct.toFixed(2)}%<br>` +
                  `Real: ${realPct.toFixed(2)}%`;
              } else {
                fakeDiv.textContent = `Eroare la apel API: ${apiRes.error}`;
              }
            }
          );

        } else {
          alert('Nu s-au colectat date.');
        }
      });
    });
  });

  clearBtn.addEventListener('click', () => {
    container.textContent = 'Nu există date colectate.';
    fakeDiv.textContent   = '';
  });
});
