/**
 * Evidențiază primul paragraf din pagină.
 */
function highlightFirstParagraph() {
  const p = document.querySelector('p:first-of-type');
  if (p) {
    p.style.backgroundColor = 'yellow';
    console.log('Primul paragraf evidențiat:', p.innerText);
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'collectData') {
    console.log('Colectez date de pe pagină…');

    // 1. Extrage toate paragrafele
    const paragraphs = Array.from(document.querySelectorAll('p'))
      .map(el => el.innerText.trim())
      .filter(t => t.length > 0);

    // 2. Construiește obiectul cu datele paginii
    const pageData = {
      url: window.location.href,
      title: document.title,
      fullText: paragraphs.join('\n\n'),
      paragraphs: paragraphs
    };

    console.log('Date colectate:', pageData);

    // 3. Evidențiază primul paragraf
    highlightFirstParagraph();

    // 4. Trimite datele înapoi
    sendResponse({
      status: 'success',
      collectedData: pageData
    });

    return true;
  }
});