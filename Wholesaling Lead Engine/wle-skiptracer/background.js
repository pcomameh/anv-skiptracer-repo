chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.action === "startSkiptrace" && Array.isArray(msg.urls)) {
    const urls = msg.urls.slice(0, 10); // Limit to 10

    urls.forEach((url, i) => {
      setTimeout(() => {
        chrome.tabs.create({ url, active: false });
      }, i * 15000); // 15 seconds apart
    });

    console.log("✅ Opening tabs for:", urls);
  }
});