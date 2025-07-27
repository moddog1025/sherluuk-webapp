import React from "react";
import "./Clues.css";

// Helper SVG logic, ThreeDotDivider, RedStrike, etc. (inline here)
const verticalTypes = ['SCP', 'SCT', 'DC', 'TTO'];

function ThreeDotDivider() {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      minWidth: 36, minHeight: 32, gap: 4
    }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          display: "inline-block", width: 7, height: 7, borderRadius: "50%",
          background: "#86847eff"
        }}/>
      ))}
    </div>
  );
}
function RedStrike() {
  return (
    <svg width={36} height={36} style={{
      position: 'absolute', left: 0, top: 0, pointerEvents: 'none'
    }}>
      <line x1={6} y1={30} x2={30} y2={6} stroke="#ff1500ff" strokeWidth={4} />
    </svg>
  );
}
function RedDividerHorizontal({ yPct = 50 }) {
  return (
    <div style={{
      position: 'absolute', left: '0%', right: '0%', top: `${yPct}%`,
      height: 3.5, background: '#ff1500ff', borderRadius: 2, zIndex: 2,
      transform: 'translateY(-50%)',
    }}/>
  );
}

function parseItem(id) {
  return { rowKey: id[0], colorIndex: Number(id.slice(1)) - 1 };
}
const PALETTE = { coral: "#FF6F61", orange: "#FFB347", yellow: "#FFF176", teal: "#66CDAA", blue: "#6495ED" };
const COLOR_ORDER = Object.values(PALETTE);
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

function DCVerticalClue({ items }) {
  return (
    <div style={{
      position: 'relative', width: 42, height: 80, display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between'
    }}>
      <div className="clue-icon"><Icon id={items[0]}/></div>
      <div className="clue-icon"><Icon id={items[1]}/></div>
      <RedDividerHorizontal yPct={50} />
    </div>
  );
}
function TTOVerticalClue({ items }) {
  return (
    <div style={{
      position: 'relative', width: 40, height: 120, display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between'
    }}>
      <div className="clue-icon"><Icon id={items[0]}/></div>
      <div className="clue-icon"><Icon id={items[1]}/></div>
      <div className="clue-icon"><Icon id={items[2]}/></div>
      <RedDividerHorizontal yPct={68} />
    </div>
  );
}

function ClueVisual({ type_id, items }) {
  if (type_id === "LO" && items.length === 2) {
    return (
      <div className="clue-line" style={{ minWidth: 95 }}>
        <div className="clue-icon"><Icon id={items[0]}/></div>
        <ThreeDotDivider/>
        <div className="clue-icon"><Icon id={items[1]}/></div>
      </div>
    );
  }
  if (type_id === "TTO" && items.length === 3) return <TTOVerticalClue items={items} />;
  if (type_id === "DC" && items.length === 2) return <DCVerticalClue items={items} />;
  if (type_id === "GT" && items.length === 3) {
    return (
      <div className="clue-line">
        <div className="clue-icon"><Icon id={items[0]}/></div>
        <div className="clue-icon" style={{ position: "relative" }}>
          <Icon id={items[1]}/><RedStrike/>
        </div>
        <div className="clue-icon"><Icon id={items[2]}/></div>
      </div>
    );
  }
  const isV = verticalTypes.includes(type_id);
  return (
    <div className={isV ? "clue-line-vertical" : "clue-line"}>
      {items.map(id => (
        <div key={id} className="clue-icon"><Icon id={id}/></div>
      ))}
    </div>
  );
}

export default function Clues({ tab, setTab, clues }) {
  const horizontalClues = clues.filter(c => !verticalTypes.includes(c.type_id));
  const verticalClues   = clues.filter(c =>  verticalTypes.includes(c.type_id));
  const activeClues     = tab === 'horizontal' ? horizontalClues : verticalClues;

  return (
    <>
      <div className={`clue-strip ${tab}`}>
        {activeClues.slice(0,9).map((clue,i) => (
          <div key={i} className="clue-card">
            <ClueVisual type_id={clue.type_id} items={clue.items}/>
          </div>
        ))}
      </div>
      <div className="puzzle-toolbar">
        <div className="tab-pills">
          <button
            className={`pill ${tab === 'horizontal' ? 'active' : ''}`}
            onClick={() => setTab('horizontal')}
          >Row</button>
          <button
            className={`pill ${tab === 'vertical' ? 'active' : ''}`}
            onClick={() => setTab('vertical')}
          >Column</button>
        </div>
      </div>
    </>
  );
}
