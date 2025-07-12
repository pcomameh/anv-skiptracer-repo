(async function () {
    const delay = ms => new Promise(res => setTimeout(res, ms));
  
    // Wait for page to finish loading
    await delay(4000);
  
    // Attempt multiple possible result containers
    const card = document.querySelector('.result-card');
    const cards = document.querySelectorAll('.card');
  
    if (!card && cards.length === 0) {
      console.warn("❌ No result-card or fallback card elements found.");
      return;
    }
  
    const result = card || cards[0];
  
    if (!result) {
      console.warn("❌ No recognizable result container found.");
      return;
    }
  
    const fullText = result.innerText;
    const phones = Array.from(result.querySelectorAll("a[href^='tel:']"))
      .map(el => el.textContent.trim())
      .filter(p => /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(p));
  
    const emailMatch = fullText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/);
    const email = emailMatch ? emailMatch[0] : "";
  
    const ownerFirst = "Tracie";
    const ownerLast = "Starkey";
    const address = "2930 Briar Ridge Rd, Columbus, OH 43232";
  
    const payload = {
      firstName: ownerFirst,
      lastName: ownerLast,
      address: address,
      phone1: phones[0] || "",
      email1: email
    };
  
    console.log("📦 Skiptrace Payload:", payload);
  
    fetch("https://script.google.com/macros/s/AKfycbzoCrY49nKy5MbZjQgq_-9DJDobuGdcRb46OCWouioWo9S0dxS2Cp3N61hy9SP-f_6E/exec", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => {
      console.log("✅ Posted to sheet:", res.status);
    }).catch(err => {
      console.error("❌ Post failed:", err);
    });
  
  })();