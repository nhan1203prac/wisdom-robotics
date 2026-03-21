import React, { useEffect, useRef, useState } from "react";

interface TableOverlayProps {
  editor: any;
}

export default function TableOverlay({ editor }: TableOverlayProps) {
  const [tableRect, setTableRect] = useState<DOMRect | null>(null);
  const [, setTablePos] = useState(-1);
  const [visible, setVisible] = useState(false);
  const [tableSelected, setTableSelected] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track table rect + pos whenever selection changes
  useEffect(() => {
    if (!editor) return;
    const updateRect = () => {
      const { state, view } = editor;
      const { $from } = state.selection;
      let foundPos = -1;
      for (let d = $from.depth; d >= 0; d--) {
        if ($from.node(d).type.name === "table") {
          foundPos = $from.before(d);
          break;
        }
      }
      if (foundPos === -1) { setTableRect(null); setTablePos(-1); return; }
      setTablePos(foundPos);
      try {
        const dom = view.nodeDOM(foundPos) as HTMLElement;
        const tableEl = dom?.tagName === "TABLE" ? dom : dom?.querySelector?.("table");
        if (tableEl) setTableRect(tableEl.getBoundingClientRect());
      } catch { setTableRect(null); }
    };
    editor.on("selectionUpdate", updateRect);
    editor.on("transaction", updateRect);
    return () => {
      editor.off("selectionUpdate", updateRect);
      editor.off("transaction", updateRect);
    };
  }, [editor]);

  // Mouse hover detection
  useEffect(() => {
    const PADDING = 40;
    const onMove = (e: MouseEvent) => {
      if (!tableRect) return;
      const inZone =
        e.clientX >= tableRect.left - PADDING &&
        e.clientX <= tableRect.right + PADDING &&
        e.clientY >= tableRect.top - PADDING &&
        e.clientY <= tableRect.bottom + PADDING;
      if (inZone) {
        if (hideTimer.current) { clearTimeout(hideTimer.current); hideTimer.current = null; }
        setVisible(true);
      } else {
        if (!hideTimer.current) {
          hideTimer.current = setTimeout(() => { setVisible(false); hideTimer.current = null; }, 200);
        }
      }
    };
    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, [tableRect]);

  // Delete/Backspace when table selected
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!tableSelected) return;
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        editor.chain().focus().deleteTable().run();
        setTableSelected(false);
      } else {
        setTableSelected(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [tableSelected, editor]);

  // Click outside deselects
  useEffect(() => {
    const onClick = () => setTableSelected(false);
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!tableRect) return null;

  const circleBtn: React.CSSProperties = {
    position: "fixed", zIndex: 300,
    width: 24, height: 24, borderRadius: "50%",
    background: "#1132D4", color: "white", border: "none",
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 18, fontWeight: 700, lineHeight: "1",
    boxShadow: "0 2px 8px rgba(17,50,212,0.45)",
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? "auto" : "none",
    transition: "opacity 0.15s",
    padding: 0,
  };

  const selectIconBtn: React.CSSProperties = {
    position: "fixed", zIndex: 300,
    width: 22, height: 22, borderRadius: 4,
    background: tableSelected ? "#1132D4" : "#475569",
    color: "white",
    border: tableSelected ? "2px solid #1132D4" : "2px solid #475569",
    cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    boxShadow: tableSelected
      ? "0 0 0 3px rgba(17,50,212,0.25), 0 2px 8px rgba(17,50,212,0.4)"
      : "0 2px 6px rgba(0,0,0,0.2)",
    opacity: visible ? 1 : 0,
    pointerEvents: visible ? "auto" : "none",
    transition: "opacity 0.15s, background 0.1s, box-shadow 0.1s",
    padding: 0,
    left: tableRect.left - 28,
    top: tableRect.top - 28,
  };

  return (
    <>
      {/* Select icon - top left */}
      <button
        style={selectIconBtn}
        title="Click de chon bang, nhan Delete de xoa"
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setTableSelected(true);
          editor.chain().focus().run();
        }}
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <rect x="0.5" y="0.5" width="12" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
          <line x1="6.5" y1="0.5" x2="6.5" y2="12.5" stroke="currentColor" strokeWidth="1.2" />
          <line x1="0.5" y1="6.5" x2="12.5" y2="6.5" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </button>

      {/* + Add column: middle right */}
      <button
        style={{ ...circleBtn, left: tableRect.right + 8, top: tableRect.top + tableRect.height / 2 - 12 }}
        onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().addColumnAfter().run(); }}
        title="Them cot"
      >+</button>

      {/* + Add row: middle bottom */}
      <button
        style={{ ...circleBtn, left: tableRect.left + tableRect.width / 2 - 12, top: tableRect.bottom + 8 }}
        onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().addRowAfter().run(); }}
        title="Them hang"
      >+</button>

      {/* Tooltip when selected */}
      {tableSelected && (
        <div style={{
          position: "fixed", zIndex: 301,
          left: tableRect.left, top: tableRect.top - 30,
          background: "#0f172a", color: "white",
          fontSize: 11, padding: "3px 8px", borderRadius: 4,
          pointerEvents: "none", whiteSpace: "nowrap",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        }}>
          Nhan Delete de xoa bang
        </div>
      )}

      {/* Highlight overlay when selected */}
      {tableSelected && (
        <div style={{
          position: "fixed", zIndex: 10,
          left: tableRect.left, top: tableRect.top,
          width: tableRect.width, height: tableRect.height,
          background: "rgba(17,50,212,0.06)",
          border: "2px solid #1132D4", borderRadius: 2,
          pointerEvents: "none",
        }} />
      )}
    </>
  );
}