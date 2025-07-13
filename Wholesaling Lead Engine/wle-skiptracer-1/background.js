// === background.js ===
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "startSkiptrace") {
    fetchRowsNeedingSkiptrace().then(rows => {
      rows.forEach((row, index) => {
        setTimeout(() => {
          const searchUrl = `https://www.truepeoplesearch.com/results?name=${encodeURIComponent(row.owner)}&citystatezip=${encodeURIComponent(row.zip)}`;
          chrome.tabs.create({ url: searchUrl, active: false });
        }, index * 15000); // 15s delay per lead
      });
    }).catch(error => {
      console.error("Failed to fetch skiptrace rows:", error);
    });
  }
});

async function fetchRowsNeedingSkiptrace() {
  // ✅ Replace with your actual published Web App URL (NOT Apps Script preview URL)
  const res = await fetch("https://script.google.com/macros/s/AKfycbzoCrY49nKy5MbZjQgq_-9DJDobuGdcRb46OCWouioWo9S0dxS2Cp3N61hy9SP-f_6E/exec");
  const json = await res.json();
  return json.leads || []; // Each: { rowId, owner, zip }
}
