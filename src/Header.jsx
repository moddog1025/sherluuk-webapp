import React from "react";
import "./Header.css";

// Helper for MM:SS format
function formatTimer(ms) {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60).toString().padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function Header({ puzzle, timer }) {
  return (
    <div className="puzzle-toolbar">
      <span className="pill-static pill-date">{puzzle.date}</span>
      <span className="pill-static pill-timer">{formatTimer(timer)}</span>
    </div>
  );
}
