chrome.runtime.onInstalled.addListener(() => {
  console.log("GameGuardian installed");
  chrome.storage.sync.get(null, (items) => {
    if (!items || Object.keys(items).length === 0) {
      chrome.storage.sync.set({
        enabled: true,
        keywords: ["suicide","kill","drugs","rape","bomb","meet alone","sex","die"],
        action: "redirect", // redirect | close | open_tab
        safe_site: "https://games.google.com",
        backend_url: "http://127.0.0.1:5000",
        api_key: "devkey",
        send_logs: true
      });
    }
  });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "detection") {
    // desktop notification
    chrome.notifications.create({
      type: "basic",
      iconUrl: 'icons/icon-128.png',
      title: 'GameGuardian Alert',
      message: msg.summary || ('Risky chat: ' + (msg.text||'') .substring(0,120))
    });
    sendResponse({ ok: true });
    return true;
  }
  if (msg.type === "open_options") {
    chrome.runtime.openOptionsPage();
  }
  if (msg.type === "open_tab" && msg.url) {
    chrome.tabs.create({ url: msg.url });
  }
  if (msg.type === "close_tab") {
    if (sender.tab && sender.tab.id) chrome.tabs.remove(sender.tab.id).catch(()=>{});
  }
});
