import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.html';
import './styles.css';
import './script.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className="container">
      <h1>ポモドーロタイマー</h1>
      <div className="timer-container">
        <div className="time-display">25:00</div>
        <div className="settings">
          <div className="session-info">
            <span className="session-count">セッション: <span id="session-count">1</span></span>
          </div>
          <div className="work-time-selector">
            <span>作業時間:</span>
            <input type="number" id="work-time-input" min="1" max="120" value="25" />
            <span>分</span>
          </div>
          <div className="auto-mode-selector">
            <label>
              <input type="checkbox" id="auto-mode" /> 自動連続モード
              <span className="auto-mode-info">(作業 → 短い休憩 → 作業 → ...)</span>
            </label>
          </div>
          <div className="mode-selector">
            <button className="mode-btn" id="work-mode" data-mode="work">作業</button>
            <button className="mode-btn" id="short-break" data-mode="short-break">短い休憩 (5分)</button>
            <button className="mode-btn" id="long-break" data-mode="long-break">長い休憩 (15分)</button>
          </div>
        </div>
        <div className="controls">
          <button id="start">開始</button>
          <button id="stop">停止</button>
          <button id="reset">リセット</button>
        </div>
      </div>
    </div>
  </React.StrictMode>
);
