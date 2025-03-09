chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "collectData") {
      console.log("Collecting data from the page...");
  
      // Collect basic data directly from the DOM
      const pageData = {
        url: window.location.href,
        title: document.title,
        content: document.body.innerText,  // Collect text content of the page
      };
  
      console.log("Page Data Collected:", pageData);  // Log the collected data for debugging
  
      // Store the data in chrome storage
      chrome.storage.local.set({ pageData: pageData }, function() {
        console.log("Data saved to storage.");
        sendResponse({ status: "success" });
      });
  
      // Ensure the response is asynchronous
      return true;
    }
  });
  