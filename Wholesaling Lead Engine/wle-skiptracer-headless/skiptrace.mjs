require('dotenv').config();
const https = require('https');
const { URL } = require('url');
const puppeteer = require('puppeteer');
import fetch from 'node-fetch';

const leads = [
  {
    fullName: "Tracie Starkey",
    cityStateZip: "Columbus, OH 43232",
    address: "2930 Briar Ridge Rd, Columbus, OH 43232"
  }
  // Later: Load from CSV or Google Sheets
];

const delay = ms => new Promise(res => setTimeout(res, ms));

(async () => {
  const browser = await puppeteer.launch({ headless: false }); // Set to true for full automation
  const page = await browser.newPage();

  for (const lead of leads) {
    const searchURL = `https://www.truepeoplesearch.com/results?name=${encodeURIComponent(lead.fullName)}&citystatezip=${encodeURIComponent(lead.cityStateZip)}`;

    console.log(`🔍 Opening: ${searchURL}`);
    await page.goto(searchURL, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // TODO: CAPTCHA detection and auto-solving
    await delay(10000); // Allow time to solve CAPTCHA manually

    // Click “View Details” if needed
    const detailButton = await page.$("a[href^='/find/person']");
    if (detailButton) {
      await detailButton.click();
      await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    }

    // Wait for contact content
    await delay(5000);

    const data = await page.evaluate(() => {
      const phoneEl = document.querySelector("a[href^='tel']");
      const phone = phoneEl ? phoneEl.innerText.trim() : "";

      const nameHeader = document.querySelector("h1, h2");
      const fullName = nameHeader ? nameHeader.innerText.trim() : "";

      return {
        phone,
        fullName,
      };
    });

    console.log(`📞 ${data.fullName}: ${data.phone}`);

    // Send to your Google Sheet webhook
    const webhookURL = process.env.WEBHOOK_URL;
    const payload = {
      firstName: lead.fullName.split(" ")[0],
      lastName: lead.fullName.split(" ").slice(1).join(" "),
      address: lead.address,
      phone1: data.phone,
      email1: "" // TPS doesn't show emails
    };

    await fetch(webhookURL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" }
    });

    await delay(5000);
  }

  await browser.close();
})();