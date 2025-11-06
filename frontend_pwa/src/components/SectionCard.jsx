import React from "react";

export default function SectionCard({ title, description, image, precautions = [], games = [] }) {
  return (
    <div className="section-card card">
      <div className="meta">
        <h3>{title}</h3>
        <p>{description}</p>

        <div className="precautions">
          {precautions.map((p, i) => (
            <div className="precaution" key={i}>
              {p.image && <img src={p.image} alt="" />}
              <div>
                <strong>{p.title}</strong>
                <div style={{fontSize:13,color:'#64748b'}}>{p.text}</div>
              </div>
            </div>
          ))}
        </div>

        {games.length > 0 && (
          <div className="games-list">
            <strong style={{display:'block',marginTop:10}}>Helpful games & resources</strong>
            {games.map((g, i) => (
              <a key={i} href={g.url} target="_blank" rel="noreferrer">{g.title}</a>
            ))}
          </div>
        )}
      </div>

      <div className="side">
        {image && <img className="section-image" src={image} alt={title} />}
        <div style={{fontSize:12,color:'#475569'}}>Interactive insights · Tips · Visuals</div>
      </div>
    </div>
  );
}