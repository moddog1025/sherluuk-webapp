import React from "react";
import "./Header.css";

// Helper for MM:SS format
function formatTimer(ms) {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60).toString().padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function UndoIcon() {
  return (
    <svg width={22} height={22} viewBox="0 0 22 22" style={{ verticalAlign: "middle" }}>
      <path d="M7 11H18M7 11l4-4M7 11l4 4M4 11H2" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width={22} height={22} viewBox="0 0 22 22" style={{ verticalAlign: "middle" }}>
      <circle cx="11" cy="11" r="3.7" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M11 2.5V5M11 17v2.5M4.7 4.7l1.8 1.8M15.5 15.5l1.8 1.8M2.5 11H5M17 11h2.5M4.7 17.3l1.8-1.8M15.5 6.5l1.8-1.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

export default function Header({ puzzle, timer, onUndo, onSettings }) {
  return (
    <div className="puzzle-toolbar">
      <div className="toolbar-buttons">
        <button className="pill pill-icon" aria-label="Undo" onClick={onUndo}><UndoIcon /></button>
        <button className="pill pill-icon" aria-label="Settings" onClick={onSettings}><GearIcon /></button>
      </div>
      <div className="meta-pills">
        <span className="pill pill-static">{puzzle.date}</span>
        <span className="pill pill-static">{formatTimer(timer)}</span>
      </div>
    </div>
  );
}

