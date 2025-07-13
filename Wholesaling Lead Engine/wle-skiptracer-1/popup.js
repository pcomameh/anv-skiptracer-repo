document.getElementById('start').addEventListener('click', async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: scrapeLeadInfo
  });
});

function scrapeLeadInfo() {
  const body = document.body.innerText;
  const phoneMatch = body.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const emailMatch = body.match(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/);
  const nameMatch = body.match(/[A-Z][a-z]+\s[A-Z][a-z]+/);

  const result = {
    name: nameMatch ? nameMatch[0] : "",
    phone: phoneMatch ? phoneMatch[0] : "",
    email: emailMatch ? emailMatch[0] : ""
  };

  console.log("Scraped Lead Info:", result);
  alert(`Name: ${result.name}\nPhone: ${result.phone}\nEmail: ${result.email}`);

  chrome.runtime.sendMessage({ type: "LEAD_SCRAPED", payload: result });
}