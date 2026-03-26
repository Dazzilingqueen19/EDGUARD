import React, { useEffect, useRef } from 'react';
import VoiceflowLoader from '../components/VoiceflowLoader';

export default function Dashboard() {
  const chartRef = useRef(null);

  useEffect(() => {
    // simple chart using Chart.js from CDN
    if (window.Chart && chartRef.current) {
      // fetch recent logs to generate dynamic dataset
      fetch('http://localhost:5000/api/logs', { headers: { 'X-API-KEY': 'devkey' } })
        .then(res => res.json())
        .then(data => {
          let labels, values;
          if (!data || data.length === 0) {
            // use fake sample data when backend unavailable
            labels = ['00:00','02:00','04:00','06:00','08:00','10:00','12:00'];
            values = [2,5,1,3,6,4,2];
          } else {
            // aggregate counts by hour
            const counts = {};
            data.forEach(l => {
              const hr = new Date(l.ts).getHours();
              counts[hr] = (counts[hr] || 0) + 1;
            });
            labels = Object.keys(counts).sort((a,b)=>a-b).map(h=>`${h}:00`);
            values = labels.map(l=>counts[parseInt(l) || 0] || 0);
          }

          const ctx = chartRef.current.getContext('2d');
          new window.Chart(ctx, {
            type: 'line',
            data: {
              labels,
              datasets: [{
                label: 'Events per Hour',
                data: values,
                borderColor: 'rgba(37,99,235,0.8)',
                backgroundColor: 'rgba(37,99,235,0.2)',
                tension: 0.4,
              }]
            },
            options: {responsive: true, maintainAspectRatio: false}
          });
        })
        .catch(err => {
          console.error('chart data fetch error', err);
          const ctx = chartRef.current.getContext('2d');
          ctx.clearRect(0, 0, chartRef.current.width, chartRef.current.height);
          ctx.font = '18px Arial';
          ctx.fillStyle = '#e53e3e';
          ctx.textAlign = 'center';
          ctx.fillText('Error loading data', chartRef.current.width/2, chartRef.current.height/2);
        });
    }
  }, []);

  return (
    <div className="page-container">
      <VoiceflowLoader />
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon icon-blue">
            <i className="fas fa-tachometer-alt"></i>
          </div>
          <div>
            <h1>Live Dashboard</h1>
            <p className="header-subtitle">Visual overview of recent activity and trends</p>
          </div>
        </div>
      </div>

      <div className="page-content">
        <div className="card modern-card" style={{ height: '400px' }}>
          <canvas ref={chartRef} style={{ width: '100%', height: '100%' }}></canvas>
        </div>
      </div>
    </div>
  );
}