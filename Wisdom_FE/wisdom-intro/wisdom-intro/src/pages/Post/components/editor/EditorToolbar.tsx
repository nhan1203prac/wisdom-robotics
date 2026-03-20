import { useRef, useState } from "react";
import {
  Bold, Italic, Underline as UnderlineIcon,
  List as ListIcon, ListOrdered, ChevronDown,
  Palette, Image as ImageIcon,
  AlignLeft, AlignCenter, AlignRight,
  Link as LinkIcon, Type, Table as TableIcon,
} from "lucide-react";
import TablePicker from "./TablePicker";

const COLORS = [
  "#000000", "#444444", "#ff0000", "#ff9900", "#ffff00",
  "#00ff00", "#00ffff", "#0000ff", "#9900ff", "#ffffff",
];

interface EditorState {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  heading: boolean;
  bulletList: boolean;
  orderedList: boolean;
  link: boolean;
  table: boolean;
  alignLeft: boolean;
  alignCenter: boolean;
  alignRight: boolean;
}

interface EditorToolbarProps {
  editor: any;
  s: EditorState;
  fileRef: React.RefObject<HTMLInputElement | null>;
  onAlign: (align: "left" | "center" | "right") => void;
  onLinkClick: () => void;
}

export default function EditorToolbar({ editor, s, fileRef, onAlign, onLinkClick }: EditorToolbarProps) {
  const [showHeading, setShowHeading] = useState(false);
  const [showSymbol, setShowSymbol] = useState(false);
  const [showNumber, setShowNumber] = useState(false);
  const [showColor, setShowColor] = useState(false);
  const [showTable, setShowTable] = useState(false);

  return (
    <div className="toolbar">
      {/* Heading */}
      <div className="dropdown">
        <button onClick={() => setShowHeading(!showHeading)} className={s.heading ? "active" : ""}>
          <Type size={18} /><ChevronDown size={12} />
        </button>
        {showHeading && (
          <div className="menu">
            <button onClick={() => { editor.chain().focus().toggleHeading({ level: 1 }).run(); setShowHeading(false); }}>Tieu de chinh (H1)</button>
            <button onClick={() => { editor.chain().focus().toggleHeading({ level: 2 }).run(); setShowHeading(false); }}>Tieu de phu (H2)</button>
            <button onClick={() => { editor.chain().focus().setParagraph().run(); setShowHeading(false); }}>Van ban thuong</button>
          </div>
        )}
      </div>
      <div className="v-divider" />

      {/* Format */}
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={s.bold ? "active" : ""}><Bold size={18} /></button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={s.italic ? "active" : ""}><Italic size={18} /></button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={s.underline ? "active" : ""}><UnderlineIcon size={18} /></button>
      <div className="v-divider" />

      {/* Align */}
      <button onClick={() => onAlign("left")} className={s.alignLeft ? "active" : ""}><AlignLeft size={18} /></button>
      <button onClick={() => onAlign("center")} className={s.alignCenter ? "active" : ""}><AlignCenter size={18} /></button>
      <button onClick={() => onAlign("right")} className={s.alignRight ? "active" : ""}><AlignRight size={18} /></button>
      <div className="v-divider" />

      {/* Bullet list */}
      <div className="dropdown">
        <button onClick={() => setShowSymbol(!showSymbol)} className={s.bulletList ? "active" : ""}>
          <ListIcon size={18} /><ChevronDown size={12} />
        </button>
        {showSymbol && (
          <div className="menu">
            <button onClick={() => { editor.chain().focus().toggleBulletList().updateAttributes("bulletList", { listStyle: "disc" }).run(); setShowSymbol(false); }}>Cham tron</button>
            <button onClick={() => { editor.chain().focus().toggleBulletList().updateAttributes("bulletList", { listStyle: "square" }).run(); setShowSymbol(false); }}>Hinh vuong</button>
          </div>
        )}
      </div>

      {/* Ordered list */}
      <div className="dropdown">
        <button onClick={() => setShowNumber(!showNumber)} className={s.orderedList ? "active" : ""}>
          <ListOrdered size={18} /><ChevronDown size={12} />
        </button>
        {showNumber && (
          <div className="menu">
            <button onClick={() => { editor.chain().focus().toggleOrderedList().updateAttributes("orderedList", { listStyle: "decimal" }).run(); setShowNumber(false); }}>1. So thuong</button>
            <button onClick={() => { editor.chain().focus().toggleOrderedList().updateAttributes("orderedList", { listStyle: "upper-roman" }).run(); setShowNumber(false); }}>I. La ma</button>
          </div>
        )}
      </div>
      <div className="v-divider" />

      {/* Link */}
      <button onClick={onLinkClick} className={s.link ? "active" : ""}><LinkIcon size={18} /></button>

      {/* Image */}
      <button onClick={() => fileRef?.current?.click()}><ImageIcon size={18} /></button>

      {/* Table */}
      <div className="dropdown">
        <button onClick={() => setShowTable(!showTable)} className={s.table ? "active" : ""}><TableIcon size={18} /></button>
        {showTable && (
          <div className="menu">
            <TablePicker onPick={(r, c) => {
              editor.chain().focus().insertTable({ rows: r, cols: c, withHeaderRow: true }).run();
              setShowTable(false);
            }} />
          </div>
        )}
      </div>

      {/* Color */}
      <div className="dropdown">
        <button onClick={() => setShowColor(!showColor)}>
          <Palette size={18} style={{ color: editor.getAttributes("textStyle").color }} />
        </button>
        {showColor && (
          <div className="colorMenu">
            {COLORS.map((c) => (
              <button key={c} className="color-circle" style={{ background: c }}
                onClick={() => { editor.chain().focus().setColor(c).run(); setShowColor(false); }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}