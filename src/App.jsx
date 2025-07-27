import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import './Header.css';
import './Grid.css';
import './Clues.css';
import './Menus.css';
import './Footer.css';
import puzzleData from './assets/puzzles/puzzle_schema_example.json';
import { FaUndo } from 'react-icons/fa';
import Header from './Header.jsx';
import Grid from './Grid.jsx';
import Clues from './Clues.jsx';
import Menus from './Menus.jsx';
import Footer from './Footer.jsx';

export default function App() {
  const puzzle = puzzleData;

  const [tab, setTab] = useState('horizontal');
  const [cellCandidates, setCellCandidates] = useState({});
  const [undoStack, setUndoStack] = useState([]);
  const [activeCell, setActiveCell] = useState(null);
  const [anchorRect, setAnchorRect] = useState(null);
  const [showWarn, setShowWarn] = useState(false);
  const [isSolved, setIsSolved] = useState(false);

  const timerRef = useRef(null);
  const lastBtn = useRef(null);
  const [timer, setTimer] = useState(() => {
    const saved = localStorage.getItem(`puzzle_timer:${puzzle.signature}`);
    return saved ? parseInt(saved, 10) : 0;
  });

  // deep‑clone helper
  const deepClone = (cands) => {
    const out = {};
    for (let k in cands) out[k] = new Set(cands[k]);
    return out;
  };

  // ─── load / init ─────────────────────────────────────────────
  useEffect(() => {
    const key = 'puzzle_progress:' + puzzle.signature;
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      const loaded = {};
      for (let k in parsed) loaded[k] = new Set(parsed[k]);
      setCellCandidates(loaded);
    } else {
      const init = {};
      for (let r = 0; r < 5; r++) {
        const row = 'ABCDE'[r];
        const all = [1,2,3,4,5].map(n => `${row}${n}`);
        for (let c = 0; c < 5; c++) {
          init[`${r}-${c}`] = new Set(all);
        }
      }
      setCellCandidates(init);
    }
    setUndoStack([]);
  }, [puzzle.signature]);

  // ─── timer ────────────────────────────────────────────────────
  useEffect(() => {
    if (isSolved) return;
    timerRef.current = setInterval(() => setTimer(t => t + 1000), 1000);
    return () => clearInterval(timerRef.current);
  }, [isSolved]);

  useEffect(() => {
    if (!puzzle || typeof timer !== 'number') return;
    localStorage.setItem(`puzzle_timer:${puzzle.signature}`, timer);
  }, [timer, puzzle.signature]);

  // ─── detect solved ───────────────────────────────────────────
  useEffect(() => {
    const solved = Object.values(cellCandidates).every(s => s.size === 1);
    setIsSolved(solved);
  }, [cellCandidates]);

  // ─── auto‑save progress ───────────────────────────────────────
  useEffect(() => {
    if (!Object.keys(cellCandidates).length) return;
    const key = 'puzzle_progress:' + puzzle.signature;
    localStorage.setItem(
      key,
      JSON.stringify(
        Object.fromEntries(
          Object.entries(cellCandidates).map(([k,s]) => [k, Array.from(s)])
        )
      )
    );
  }, [cellCandidates, puzzle.signature]);

  // ─── toggle a candidate ───────────────────────────────────────
  const toggleCandidate = (r, c, id) => {
    // snapshot history
    const before = deepClone(cellCandidates);

    // build next state
    const next = deepClone(cellCandidates);
    const key = `${r}-${c}`;
    const setHere = next[key];
    const solutionId = puzzle.grid[r][c];

    // no‑ops & warn
    if (setHere.has(id) && setHere.size === 1) return;
    if (setHere.has(id) && id === solutionId) {
      setShowWarn(true);
      setTimeout(() => setShowWarn(false), 1700);
      return;
    }

    // actually toggle
    if (setHere.has(id)) setHere.delete(id);
    else setHere.add(id);

    // if solved this cell, eliminate in row
    if (setHere.size === 1 && setHere.has(solutionId)) {
      if (activeCell?.r === r && activeCell?.c === c) {
        setTimeout(() => setActiveCell(null), 150);
      }
      const [val] = setHere;
      for (let col = 0; col < 5; col++) {
        if (col !== c) next[`${r}-${col}`].delete(val);
      }
    }

    // commit both at once
    setUndoStack(us => [...us, before]);
    setCellCandidates(next);
  };

  // ─── undo ─────────────────────────────────────────────────────
  const handleUndo = () => {
    if (!undoStack.length) return;
    const last = undoStack[undoStack.length - 1];
    setCellCandidates(last);
    setUndoStack(us => us.slice(0, -1));
  };

  const handleSettings = () => alert('Settings menu coming soon!');

  // ─── cell popup ───────────────────────────────────────────────
  const openCell = (r, c, btn) => {
    const cand = cellCandidates[`${r}-${c}`];
    const sol = puzzle.grid[r][c];
    if (cand.size === 1 && cand.has(sol)) return;
    setActiveCell({ r, c });
    setAnchorRect(btn.getBoundingClientRect());
    lastBtn.current = btn;
  };
  const closeCell = () => {
    setActiveCell(null);
    setAnchorRect(null);
    lastBtn.current?.focus();
  };
  useEffect(() => {
    const onEsc = e => e.key === 'Escape' && closeCell();
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

  // ─── restart ──────────────────────────────────────────────────
  const handleRestart = () => {
    localStorage.removeItem('puzzle_progress:' + puzzle.signature);
    localStorage.removeItem('puzzle_timer:' + puzzle.signature);
    setCellCandidates({});
    setTimer(0);
    setIsSolved(false);
    setUndoStack([]);
    window.location.reload();
  };

  // ─── render ───────────────────────────────────────────────────
  return (
    <div className="app-root">
      <div className="app-shell">
        <main className="main-area">
          <div className="puzzle-container">
            <Header
              puzzle={puzzle}
              timer={timer}
              onSettings={handleSettings}
            />
            <div className="content-area">  
              <Grid
                cellCandidates={cellCandidates}
                openCell={openCell}
                activeCell={activeCell}
                anchorRect={anchorRect}
                closeCell={closeCell}
                toggleCandidate={toggleCandidate}
                showWarn={showWarn}
              />
              <div className="undo-wrapper">
                <button
                  className="pill-icon"
                  aria-label="Undo"
                  onClick={handleUndo}
                >
                  <FaUndo size={20} />
                </button>
              </div>
              <Clues tab={tab} setTab={setTab} clues={puzzle.clues} />
            </div>
          </div>
          <Footer signature={puzzle.signature} />
        </main>
      </div>
      <Menus
        isSolved={isSolved}
        puzzle={puzzle}
        timer={timer}
        onRestart={handleRestart}
      />
    </div>
  );
}
