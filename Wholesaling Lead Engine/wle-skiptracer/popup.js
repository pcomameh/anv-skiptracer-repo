document.getElementById('start').addEventListener('click', () => {
  const text = document.getElementById('urlList').value.trim();
  const urls = text.split('\n').map(url => url.trim()).filter(u => u.startsWith('https://'));

  const errorBox = document.getElementById('error');
  const messageBox = document.getElementById('message');
  errorBox.textContent = "";
  messageBox.textContent = "";

  if (urls.length === 0) {
    errorBox.textContent = "❌ No valid URLs detected.";
    return;
  }

  if (urls.length > 10) {
    errorBox.textContent = "⚠️ Please enter 10 or fewer URLs.";
    return;
  }

  chrome.runtime.sendMessage({ action: "startSkiptrace", urls });

  messageBox.textContent = `✅ Launched ${urls.length} skiptrace tabs.`;
});

document.getElementById('clear').addEventListener('click', () => {
  document.getElementById('urlList').value = "";
  document.getElementById('error').textContent = "";
  document.getElementById('message').textContent = "";
});