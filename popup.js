document.getElementById("analyzeButton").addEventListener("click", function() {
    // Get the active tab and send a message to collect data
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var activeTab = tabs[0];
      if (activeTab) {
        console.log("Sending message to collect data on tab:", activeTab.url);
        chrome.tabs.sendMessage(activeTab.id, { action: "collectData" }, function(response) {
          if (response && response.status === "success") {
            alert("Data collection complete for this page!");
  
            // Log the collected data in the console
            console.log("Collected Data:", response.collectedData);
  
            // Optionally, you can update the UI to display the collected data in the popup
            const collectedDataContainer = document.getElementById("collectedData");
            collectedDataContainer.textContent = JSON.stringify(response.collectedData, null, 2);
          } else {
            alert("No data collected. Ensure you're on a supported page.");
          }
        });
      } else {
        alert("Unable to get the active tab.");
      }
    });
  });
  
  // Optional: Add a button to clear the collected data
  document.getElementById("clearDataButton").addEventListener("click", function() {
    collectedData = [];  // Clear the collected data variable
    alert("Collected data cleared!");
  });
  