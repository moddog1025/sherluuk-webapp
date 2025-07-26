import React from "react";
import "./Menus.css";

export default function Menus({ isSolved, puzzle, timer, onRestart }) {
  function formatTimer(ms) {
    const total = Math.floor(ms / 1000);
    const m = Math.floor(total / 60).toString().padStart(2, "0");
    const s = (total % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }
  if (!isSolved) return null;
  return (
    <div className="solve-modal">
      <div className="solve-modal-inner">
        <h2 className="solve-title">Puzzle Solved!</h2>
        <div className="solve-modal-stats">
          <div className="solve-modal-stat">
            <span className="stat-label">Time:</span>
            <span className="stat-value">{formatTimer(timer)}</span>
          </div>
          <div className="solve-modal-stat">
            <span className="stat-label">Difficulty:</span>
            <span className="stat-value">{puzzle.difficulty}</span>
          </div>
          <div className="solve-modal-stat">
            <span className="stat-label">Puzzle:</span>
            <span className="stat-value">{puzzle.date}</span>
          </div>
        </div>
        <button className="btn-primary" style={{marginTop: 18}} onClick={onRestart}>Restart Puzzle</button>
      </div>
    </div>
  );
}
