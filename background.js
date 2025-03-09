// Declare a variable to hold the collected data
let collectedData = [];

// Listen for the message to collect data
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

    // Save data to the variable
    collectedData.push(pageData);

    console.log("Data stored in variable:", collectedData); // Log the stored data in the variable

    // Send a response to notify the popup that the data collection was successful
    sendResponse({ status: "success", collectedData: collectedData });

    // Ensure the response is asynchronous
    return true;
  }
});
