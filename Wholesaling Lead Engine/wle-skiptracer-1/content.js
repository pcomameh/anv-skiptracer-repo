function scrapeLeadInfo() {
  const name = document.querySelector("h1")?.innerText || "";
  const phoneMatch = document.body.innerText.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const emailMatch = document.body.innerText.match(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/);

  const result = {
    name: name,
    phone: phoneMatch ? phoneMatch[0] : "",
    email: emailMatch ? emailMatch[0] : ""
  };

  console.log("Scraped Lead Info:", result);
  alert(`Name: ${result.name}\nPhone: ${result.phone}\nEmail: ${result.email}`);

  chrome.runtime.sendMessage({ type: "LEAD_SCRAPED", payload: result });
}