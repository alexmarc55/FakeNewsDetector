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
        if (!(response && response.status === 'success')) {
          alert('Nu s-au colectat date.');
          return;
        }
        const fullText = response.collectedData.fullText;

        // 2) Sumarizează textul cu API-ul de sumarizare
        container.textContent = 'Sumarizare în curs…';
        chrome.runtime.sendMessage(
          { action: 'summarizeText', text: fullText },
          sumRes => {
            if (sumRes.status !== 'ok') {
              container.textContent = `Eroare sumarizare: ${sumRes.error}`;
              return;
            }
            // Afișează textul sumarizat
            container.textContent = sumRes.data.summary;

            // 3) După sumar, lansează analiza Fake/Real
            fakeDiv.textContent = 'Analiză Fake/Real în curs…';
            chrome.runtime.sendMessage(
              { action: 'analyzeText', text: fullText },
              apiRes => {
                if (apiRes.status === 'ok') {
                  const fakePct = apiRes.data.Fake * 100;
                  const realPct = apiRes.data.Real * 100;
                  fakeDiv.innerHTML = 
                    `Fake: ${fakePct.toFixed(2)}%<br>` +
                    `Real: ${realPct.toFixed(2)}%`;
                } else {
                  fakeDiv.textContent = `Eroare la analiză: ${apiRes.error}`;
                }
              }
            );
          }
        );
      });
    });
  });

  clearBtn.addEventListener('click', () => {
    container.textContent = 'Nu există date colectate.';
    fakeDiv.textContent   = '';
  });
});
