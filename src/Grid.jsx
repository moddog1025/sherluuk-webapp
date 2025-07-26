import React from "react";
import "./Grid.css";

const CELL_SIZE = 108;
const EXPANDED_PANEL_SIZE = 200;
const Z_GRID = 10, Z_BACKDROP = 40, Z_EXPANDED = 50;
const PALETTE = { coral: "#FF6F61", orange: "#FFB347", yellow: "#FFF176", teal: "#66CDAA", blue: "#6495ED" };
const COLOR_ORDER = Object.values(PALETTE);

function parseItem(id) {
  return { rowKey: id[0], colorIndex: Number(id.slice(1)) - 1 };
}
const SHAPES = {
  A: Ring, B: Hexagon, C: NotchedSquare, D: Shield, E: WideTriangle
};
function Ring({ color }) {
  return (
    <svg viewBox="0 0 72 72" className="shape">
      <circle cx={36} cy={36} r={32} fill={color} stroke="white" strokeWidth={2.5}/>
      <circle cx={36} cy={36} r={17} fill="none" stroke="white" strokeWidth={7}/>
    </svg>
  );
}
function Hexagon({ color }) {
  return (
    <svg viewBox="0 0 72 72" className="shape">
      <polygon points="36,5 64,21 64,51 36,67 8,51 8,21" fill={color} stroke="white" strokeWidth={2.5}/>
    </svg>
  );
}
function NotchedSquare({ color }) {
  return (
    <svg viewBox="0 0 72 72" className="shape">
      <path d="M10 10 H54 L64 20 V62 H10 Z" fill={color} stroke="white" strokeWidth={2.5} strokeLinejoin="round"/>
    </svg>
  );
}
function Shield({ color }) {
  return (
    <svg viewBox="0 0 72 72" className="shape">
      <path d="M36 7 L60 14 V34c0 17-10 27-24 32C22 61 12 51 12 34V14Z" fill={color} stroke="white" strokeWidth={2.5} strokeLinejoin="round"/>
    </svg>
  );
}
function WideTriangle({ color }) {
  return (
    <svg viewBox="0 0 72 72" className="shape">
      <polygon points="36,8 68,64 4,64" fill={color} stroke="white" strokeWidth={2.5} strokeLinejoin="round"/>
    </svg>
  );
}
function Icon({ id }) {
  const { rowKey, colorIndex } = parseItem(id);
  const Shape = SHAPES[rowKey];
  return <Shape color={COLOR_ORDER[colorIndex]} />;
}

function GameCell({ rowIndex, colIndex, candidates, solved, onActivate }) {
  const count = candidates.size;
  const cols = count > 4 ? 3 : 2;
  const rows = Math.ceil(count / cols);
  return (
    <button
      className="cell"
      style={{ width: CELL_SIZE, height: CELL_SIZE }}
      onClick={e => { e.stopPropagation(); onActivate(e.currentTarget); }}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); onActivate(e.currentTarget);
        }
      }}
      aria-label={`Cell ${rowIndex + 1}-${colIndex + 1}`}
    >
      {solved
        ? <div className="cell-solved"><Icon id={solved}/></div>
        : <div
            className="cell-candidates"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gridTemplateRows: `repeat(${rows}, 1fr)`,
              gap: 4, width: '100%', height: '100%', padding: 4
            }}
          >
            {Array.from(candidates).map(id => (
              <div key={id} className="candidate"><Icon id={id}/></div>
            ))}
          </div>
      }
    </button>
  );
}

function WarningPill({ anchorRect }) {
  const style = {
    position: 'fixed', left: anchorRect ? anchorRect.left + anchorRect.width / 2 - 110 : '50%',
    top: anchorRect ? Math.max(10, anchorRect.top - 48) : '20%',
    transform: anchorRect ? undefined : 'translate(-50%,0)', zIndex: Z_EXPANDED + 2,
    background: '#FF6F61', color: 'white', fontWeight: 700, borderRadius: 22,
    padding: '12px 24px', fontSize: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.14)',
    pointerEvents: 'none'
  };
  return <div style={style}>I wouldn't do that if I were you...</div>;
}
function ExpandedPanel({ row, col, candidates, onToggle, anchorRect, showWarn }) {
  const items = Array.from(candidates);
  const cols = items.length > 4 ? 3 : 2;
  return (
    <div className="expanded-panel" style={{
      position: 'fixed', width: EXPANDED_PANEL_SIZE, height: EXPANDED_PANEL_SIZE, zIndex: Z_EXPANDED,
      left: anchorRect
        ? Math.min(Math.max(8, anchorRect.left + anchorRect.width / 2 - EXPANDED_PANEL_SIZE / 2), window.innerWidth - EXPANDED_PANEL_SIZE - 8)
        : '50%',
      top: anchorRect
        ? Math.min(Math.max(8, anchorRect.top + anchorRect.height / 2 - EXPANDED_PANEL_SIZE / 2), window.innerHeight - EXPANDED_PANEL_SIZE - 8)
        : '50%',
      transform: anchorRect ? undefined : 'translate(-50%,-50%)'
    }} role="dialog">
      {showWarn && <WarningPill anchorRect={anchorRect}/>}
      <div className="expanded-grid" style={{ gridTemplateColumns: `repeat(${cols},1fr)` }}>
        {items.map(id => (
          <button key={id} className="expanded-option" onClick={() => onToggle(row, col, id)}>
            <Icon id={id}/>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Grid({
  puzzle, cellCandidates, openCell, activeCell, anchorRect, closeCell,
  toggleCandidate, showWarn
}) {
  return (
    <section className="grid-wrapper" style={{ zIndex: Z_GRID }}>
      <div className="grid-board" style={{ gridTemplateColumns: `repeat(5,${CELL_SIZE}px)` }}>
        {Array.from({ length: 5 }).flatMap((_, r) =>
          Array.from({ length: 5 }).map((_, c) => {
            const key = `${r}-${c}`;
            const cand = cellCandidates[key] || new Set();
            const sol = cand.size === 1 ? [...cand][0] : null;
            return (
              <GameCell
                key={key}
                rowIndex={r}
                colIndex={c}
                candidates={cand}
                solved={sol}
                onActivate={btn => openCell(r, c, btn)}
              />
            );
          })
        )}
      </div>
      {activeCell && (
        <>
          <div className="backdrop" style={{ zIndex: Z_BACKDROP }} onClick={closeCell} />
          <ExpandedPanel
            row={activeCell.r}
            col={activeCell.c}
            candidates={cellCandidates[`${activeCell.r}-${activeCell.c}`]}
            onToggle={toggleCandidate}
            anchorRect={anchorRect}
            showWarn={showWarn}
          />
        </>
      )}
    </section>
  );
}
