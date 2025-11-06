(async function(){
  // load config from storage
  function getCfg(){ return new Promise(r=>chrome.storage.sync.get(null, r)); }
  const cfg = await getCfg();
  let keywords = cfg.keywords || ["suicide","kill","drugs","rape","bomb","meet alone","sex","die"];
  let action = cfg.action || "redirect";
  let safe_site = cfg.safe_site || "https://games.google.com";
  let backend = cfg.backend_url || "http://127.0.0.1:5000";
  let api_key = cfg.api_key || "devkey";
  let send_logs = (typeof cfg.send_logs === "undefined") ? true : cfg.send_logs;

  function buildRegex(arr){
    if(!arr || !arr.length) return null;
    const esc = arr.map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
    return new RegExp('\\b(' + esc.join('|') + ')\\b','i');
  }
  let detector = buildRegex(keywords);

  // try to post log to backend
  async function postLog(text, matched){
    if(!send_logs) return;
    try{
      await fetch(backend + "/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": api_key
        },
        body: JSON.stringify({ text: text })
      });
    }catch(e){
      // ignore network errors
      console.warn('GameGuardian: failed to send log', e);
    }
  }

  function handleDetection(text, match){
    // send message to background for notification
    chrome.runtime.sendMessage({ type: "detection", text, summary: 'Blocked chat: '+(match||'') }, ()=>{});
    // send to backend
    postLog(text, match);
    // act according to action
    if(action === "redirect"){
      window.location.href = safe_site;
    } else if(action === "open_tab"){
      chrome.runtime.sendMessage({ type: "open_tab", url: safe_site });
    } else if(action === "close"){
      chrome.runtime.sendMessage({ type: "close_tab" });
    }
  }

  // attach to inputs and contenteditable
  function attachInputs(){
    const inputs = Array.from(document.querySelectorAll("input[type=text], textarea, [contenteditable='true']"));
    for(const el of inputs){
      if(el._gg_attached) continue;
      el._gg_attached = true;
      el.addEventListener('input', (ev)=>{
        const txt = (ev.target.value || ev.target.innerText || '').trim();
        if(!txt || !detector) return;
        const m = detector.exec(txt);
        if(m) handleDetection(txt, m[0]);
      }, true);
    }
  }

  // observe DOM for chat messages
  const obs = new MutationObserver(muts=>{
    muts.forEach(m=>{
      m.addedNodes.forEach(node=>{
        if(node.nodeType === Node.ELEMENT_NODE){
          const txt = node.innerText || '';
          if(txt && detector && detector.test(txt)){
            handleDetection(txt, detector.exec(txt)[0]);
          }
        }
      });
    });
  });

  // initial attach and observers
  attachInputs();
  try{ obs.observe(document.body, { childList:true, subtree:true }); }catch(e){}
  const inputObs = new MutationObserver(attachInputs);
  try{ inputObs.observe(document.documentElement || document, { childList:true, subtree:true }); }catch(e){}

  // listen for storage updates
  chrome.storage.onChanged.addListener((changes)=>{
    if(changes.keywords || changes.action || changes.safe_site){
      chrome.storage.sync.get(null, (c)=>{
        keywords = c.keywords || keywords;
        action = c.action || action;
        safe_site = c.safe_site || safe_site;
        backend = c.backend_url || backend;
        api_key = c.api_key || api_key;
        send_logs = (typeof c.send_logs === 'undefined') ? send_logs : c.send_logs;
        detector = buildRegex(keywords);
      });
    }
  });
})();