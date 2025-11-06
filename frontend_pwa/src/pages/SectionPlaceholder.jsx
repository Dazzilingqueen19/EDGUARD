import React from "react";
import SectionCard from "../components/SectionCard";

const sampleGames = [
  { title: "Emotion Match (game)", url: "https://example.com/emotion-game" },
  { title: "SafeChat Quiz", url: "https://example.com/safechat-quiz" }
];

export default function SectionPlaceholder({ title, desc, image, precautions }) {
  return (
    <div>
      <SectionCard
        title={title}
        description={desc}
        image={image}
        precautions={precautions}
        games={sampleGames}
      />

      <div className="card">
        <h4>Interactive demo</h4>
        <p className="hint">Use the demo to test sample inputs and see suggested precautions.</p>
        <div className="logs-panel">
          <div className="log-item">[Info] No critical issues detected in sample run</div>
          <div className="log-item">[Warn] Suggested: enable stricter filtering</div>
        </div>
      </div>
    </div>
  );
}