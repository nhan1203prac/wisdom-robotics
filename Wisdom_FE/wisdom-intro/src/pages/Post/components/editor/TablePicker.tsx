import { useState } from "react";

interface TablePickerProps {
  onPick: (rows: number, cols: number) => void;
}

export default function TablePicker({ onPick }: TablePickerProps) {
  const [hover, setHover] = useState({ r: 0, c: 0 });
  const MAX = 8;

  return (
    <div style={{ padding: "8px 6px 4px" }}>
      <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 6, textAlign: "center" }}>
        {hover.r > 0 ? `${hover.r} x ${hover.c}` : "Chon kich thuoc bang"}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${MAX}, 20px)`, gap: 3 }}>
        {Array.from({ length: MAX * MAX }).map((_, i) => {
          const r = Math.floor(i / MAX) + 1;
          const c = (i % MAX) + 1;
          const active = r <= hover.r && c <= hover.c;
          return (
            <div
              key={i}
              onMouseEnter={() => setHover({ r, c })}
              onClick={() => onPick(r, c)}
              style={{
                width: 20, height: 20, borderRadius: 3, cursor: "pointer",
                background: active ? "#c7d2fe" : "#f1f5f9",
                border: `1px solid ${active ? "#1132D4" : "#e2e8f0"}`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}