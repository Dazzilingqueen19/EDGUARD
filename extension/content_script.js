/*
 Real-time monitoring content script:
 - Observes input & textarea fields and contenteditable elements
 - On change/keyup it sends trimmed text to backend /api/chat
 - If backend returns risk above sensitivity, it injects a blur overlay
 - Also observes DOM mutations to detect newly added chat boxes (e.g., single page apps)
*/
const BACKEND = "http://127.0.0.1:5000";
const API_KEY = "devkey";
const SEND_DEBOUNCE_MS = 700; // wait while typing stops
let timers = new WeakMap();

function postChatText(text) {
  if (!text || text.length < 3) return;
  fetch(`${BACKEND}/api/chat`, {
    method: "POST",
    headers: {"Content-Type":"application/json","X-API-KEY":API_KEY},
    body: JSON.stringify({ text })
  }).then(r => r.json()).then(j => {
    if (j && j.info && j.info.score && j.info.score > 0.3) {
      injectBlur(j.info.flagged, j.info.score);
    }
  }).catch(err => { /* ignore network errors */ });
}

function debounceSend(node, text) {
  if (timers.has(node)) clearTimeout(timers.get(node));
  timers.set(node, setTimeout(()=>{ postChatText(text); timers.delete(node); }, SEND_DEBOUNCE_MS));
}

function trackInput(el) {
  if (!el) return;
  if (el._edguard_attached) return;
  function handler(e) {
    const text = (el.innerText || el.value || "").trim();
    debounceSend(el, text);
  }
  el.addEventListener('input', handler);
  el.addEventListener('keyup', handler);
  el._edguard_attached = true;
}

function scanAndAttach(root=document.body) {
  const inputs = Array.from(root.querySelectorAll('input[type=text], input[type=search], textarea, [contenteditable="true"]'));
  inputs.forEach(inp => { trackInput(inp); });
}

// blur overlay
let blurNode = null;
function injectBlur(flagged, score){
  if (blurNode) return; // already blurred
  blurNode = document.createElement('div');
  blurNode.style.position = 'fixed';
  blurNode.style.top = '0';
  blurNode.style.left = '0';
  blurNode.style.width = '100vw';
  blurNode.style.height = '100vh';
  blurNode.style.zIndex = '2147483647';
  blurNode.style.backdropFilter = 'blur(10px)';
  blurNode.style.backgroundColor = 'rgba(255,255,255,0.85)';
  blurNode.innerHTML = `<div style="font-family:Segoe UI,Arial;margin-top:20vh;text-align:center"><h1 style="color:#b91c1c">EDGUARD — Risk Detected</h1><p style="color:#333">Flagged: ${flagged.join(', ')}</p><p>Score: ${score}</p></div>`;
  document.documentElement.appendChild(blurNode);
  // auto-remove after 6 seconds
  setTimeout(()=>{ try { blurNode.remove(); blurNode = null; } catch(e){} }, 6000);
}

// observe mutations to attach to dynamic content
const mo = new MutationObserver((mutations)=>{
  mutations.forEach(m=>{
    if (m.addedNodes && m.addedNodes.length) {
      m.addedNodes.forEach(n=>{
        try { scanAndAttach(n); } catch(e){}
      });
    }
  });
});
mo.observe(document.body, { childList:true, subtree:true });

// initial attach
scanAndAttach();
console.log("EDGUARD content script active");
