import React, { useEffect } from 'react';

export default function VoiceflowLoader() {
  useEffect(() => {
    // prevent double-loading
    if (window.__voiceflow_widget_loaded) return;

    (function(d, t) {
      var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
      v.onload = function() {
        try {
          window.voiceflow.chat.load({
            verify: { projectID: '69b42c2dbcd2fba76f913992' },
            url: 'https://general-runtime.voiceflow.com',
            versionID: 'production',
            voice: {
              url: "https://runtime-api.voiceflow.com"
            }
          });
          window.__voiceflow_widget_loaded = true;
        } catch (e) {
          console.error('Voiceflow load error', e);
        }
      }
      v.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs"; v.type = "text/javascript"; s.parentNode.insertBefore(v, s);
    })(document, 'script');

    return () => {};
  }, []);

  return null; // purely side-effect loader
}
