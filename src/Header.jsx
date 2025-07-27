import React from "react";
import { FaUndo, FaCog } from "react-icons/fa";
import "./Header.css";

// Helper for MM:SS format
function formatTimer(ms) {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60).toString().padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function Header({ puzzle, timer, onUndo, onSettings }) {
  return (
    <div className="puzzle-toolbar">
      <div className="toolbar-buttons">
        <button
          className="pill-icon"
          aria-label="Undo"
          onClick={onUndo}
        >
          <FaUndo size={20} />
        </button>
        <button
          className="pill-icon"
          aria-label="Settings"
          onClick={onSettings}
        >
          <FaCog size={20} />
        </button>
      </div>
      <div className="meta-pills">
        <span className="pill-static">{puzzle.date}</span>
        <span className="pill-static">{formatTimer(timer)}</span>
      </div>
    </div>
  );
}
