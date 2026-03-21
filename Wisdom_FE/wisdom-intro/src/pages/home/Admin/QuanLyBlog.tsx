import { useRef, useState } from "react";
import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { Node, mergeAttributes } from "@tiptap/core";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { Editor } from "@tiptap/react";
import { NodeSelection } from "prosemirror-state";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List as ListIcon,
  ListOrdered,
  ChevronDown,
  Palette,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Type,
  ArrowLeft,
  Send,
  Table as TableIcon,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const COLORS = [
  "#000000",
  "#444444",
  "#ff0000",
  "#ff9900",
  "#ffff00",
  "#00ff00",
  "#00ffff",
  "#0000ff",
  "#9900ff",
  "#ffffff",
];

/* ------------------------------------------------------------------ */
/*  CustomListItem: cho phép heading bên trong + có color attribute    */
/* ------------------------------------------------------------------ */
const CustomListItem = ListItem.extend({
  content: "paragraph | heading block*",
  addAttributes() {
    return {
      ...this.parent?.(),
      color: {
        default: null,
        parseHTML: (el) => el.style.color || null,
        renderHTML: (attrs) =>
          attrs.color ? { style: `color: ${attrs.color}` } : {},
      },
    };
  },
});

const CustomBulletList = BulletList.extend({
  addAttributes() {
    return {
      listStyle: {
        default: "disc",
        parseHTML: (el) => el.style.listStyleType || "disc",
        renderHTML: (attrs) => ({
          style: `list-style-type:${attrs.listStyle};`,
        }),
      },
    };
  },
});

const CustomOrderedList = OrderedList.extend({
  addAttributes() {
    return {
      listStyle: {
        default: "decimal",
        parseHTML: (el) => el.style.listStyleType || "decimal",
        renderHTML: (attrs) => ({
          style: `list-style-type:${attrs.listStyle};`,
        }),
      },
    };
  },
});

const ImageWithText = Node.create({
  name: "imageWithText",
  group: "block",
  content: "block image",
  atom: false,
  parseHTML() {
    return [{ tag: 'div[data-type="image-with-text"]' }];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-type": "image-with-text",
        class: "image-with-text",
      }),
      0,
    ];
  },
});

/* ------------------------------------------------------------------ */
function applyHeading(editor: Editor, level: 1 | 2 | null) {
  const { $from } = editor.state.selection;

  let inList = false;

  for (let depth = $from.depth; depth > 0; depth--) {
    if ($from.node(depth).type.name === "listItem") {
      inList = true;
      break;
    }
  }

  if (inList) {
    if (level === null) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().setNode("heading", { level }).run();
    }
  } else {
    if (level === null) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().toggleHeading({ level }).run();
    }
  }
}

function applyBullet(editor: Editor, style: "disc" | "square") {
  if (editor.isActive("orderedList")) {
    editor.chain().focus().liftListItem("listItem").run();
  }

  editor
    .chain()
    .focus()
    .toggleBulletList()
    .updateAttributes("bulletList", { listStyle: style })
    .run();
}

function applyNumber(editor: Editor, style: "decimal" | "upper-roman") {
  if (editor.isActive("bulletList")) {
    editor.chain().focus().liftListItem("listItem").run();
  }

  editor
    .chain()
    .focus()
    .toggleOrderedList()
    .updateAttributes("orderedList", { listStyle: style })
    .run();
}

function applyAlign(editor: Editor, align: "left" | "center" | "right") {
  const { selection, schema } = editor.state;

  const node = selection instanceof NodeSelection ? selection.node : null;

  if (node && node.type === schema.nodes.image) {
    let style = "";

    if (align === "left") {
      style = "float: left; margin: 0 20px 12px 0; max-width: 45%;";
    } else if (align === "right") {
      style = "float: right; margin: 0 0 12px 20px; max-width: 45%;";
    } else {
      style = "display: block; margin: 12px auto; max-width: 80%;";
    }

    editor.chain().focus().updateAttributes("image", { style }).run();
  } else {
    editor.chain().focus().setTextAlign(align).run();
  }
}

/* ------------------------------------------------------------------ */
/*  applyColor: set color text + nếu trong list thì set color lên li  */
/* ------------------------------------------------------------------ */
function applyColor(editor: Editor, color: string) {
  editor.chain().focus().setColor(color).run();

  if (editor.isActive("listItem")) {
    editor.chain().focus().updateAttributes("listItem", { color }).run();
  }
}

/* ------------------------------------------------------------------ */
function TablePicker({
  onPick,
}: {
  onPick: (rows: number, cols: number) => void;
}) {
  const [hover, setHover] = useState({ r: 0, c: 0 });
  const MAX = 8;
  return (
    <div style={{ padding: "8px 6px 4px" }}>
      <div
        style={{
          fontSize: 12,
          color: "#94a3b8",
          marginBottom: 6,
          textAlign: "center",
        }}
      >
        {hover.r > 0 ? `${hover.r} × ${hover.c}` : "Chọn kích thước bảng"}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${MAX}, 20px)`,
          gap: 3,
        }}
      >
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
                width: 20,
                height: 20,
                borderRadius: 3,
                cursor: "pointer",
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

/* ================================================================== */
export default function CreatePostPage() {
  const navigate = useNavigate();
  const [showHeading, setShowHeading] = useState(false);
  const [showSymbol, setShowSymbol] = useState(false);
  const [showNumber, setShowNumber] = useState(false);
  const [showColor, setShowColor] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const linkBtnRef = useRef<HTMLButtonElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
        heading: { levels: [1, 2, 3] },
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading" && node.attrs.level === 1)
            return "Tiêu đề bài viết...";
          return "Bắt đầu viết nội dung...";
        },
      }),
      ImageWithText,
      CustomBulletList,
      CustomOrderedList,
      CustomListItem,
      Underline,
      TextStyle,
      Color,
      Image.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            style: {
              default: null,
              parseHTML: (el) => el.getAttribute("style"),
              renderHTML: (attrs) =>
                attrs.style ? { style: attrs.style } : {},
            },
          };
        },
      }).configure({ allowBase64: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({
        types: ["heading", "paragraph", "listItem"],
        alignments: ["left", "center", "right"],
      }),
    ],
    content: `<h1></h1><p></p>`,
    editorProps: { attributes: { class: "editor-canvas" } },
  });

  const s = useEditorState({
    editor,
    selector: (ctx) => {
      const e = ctx.editor;
      if (!e) return null;
      const { $from } = e.state.selection;
      const currentAlign = $from.node().attrs?.textAlign ?? null;
      return {
        bold: e.isActive("bold"),
        italic: e.isActive("italic"),
        underline: e.isActive("underline"),
        heading: e.isActive("heading"),
        bulletList: e.isActive("bulletList"),
        orderedList: e.isActive("orderedList"),
        link: e.isActive("link"),
        table: e.isActive("table"),
        alignLeft: currentAlign === "left",
        alignCenter: currentAlign === "center",
        alignRight: currentAlign === "right",
      };
    },
  });

  if (!editor || !s) return null;

  const handleLinkClick = () => {
    if (editor.isActive("link")) {
      editor.chain().focus().unsetLink().run();
      return;
    }
    const { from, to, empty } = editor.state.selection;
    if (empty) return;
    const selectedText = editor.state.doc.textBetween(from, to, " ").trim();
    if (!selectedText) return;
    const href = selectedText.startsWith("http")
      ? selectedText
      : `https://${selectedText}`;
    editor.chain().focus().setLink({ href, target: "_blank" }).run();
  };

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editor) return;

    const file = e.target.files?.[0];
    if (!file) return;

    const { $from } = editor.state.selection;
    const currentNode = $from.node();
    const lineHasText = currentNode.textContent.trim().length > 0;

    const reader = new FileReader();

    reader.onload = () => {
      const src = reader.result as string;

      if (lineHasText) {
        const endOfNode = $from.end($from.depth);

        editor
          .chain()
          .focus()
          .insertContentAt(endOfNode, { type: "paragraph" })
          .setImage({ src })
          .run();
      } else {
        const align = currentNode.attrs?.textAlign || "left";

        const floatStyle =
          align === "right"
            ? "float: right; margin: 0 0 12px 20px; max-width: 45%;"
            : "float: left; margin: 0 20px 12px 0; max-width: 45%;";

        // insert image
        editor.chain().focus().setImage({ src }).run();

        // apply style
        editor
          .chain()
          .focus()
          .updateAttributes("image", { style: floatStyle })
          .run();

        // add new paragraph
        editor
          .chain()
          .focus()
          .insertContentAt(editor.state.selection.to, { type: "paragraph" })
          .run();
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="page-container">
      <div className="header-bar">
        <button onClick={() => navigate(-1)} className="icon-btn-circle">
          <ArrowLeft size={20} />
        </button>
        <button
          className="publish-btn"
          onClick={() => console.log(editor.getHTML())}
        >
          Đăng bài <Send size={16} />
        </button>
      </div>

      <div className="toolbar">
        <div className="dropdown">
          <button
            onClick={() => setShowHeading(!showHeading)}
            className={s.heading ? "active" : ""}
          >
            <Type size={18} />
            <ChevronDown size={12} />
          </button>
          {showHeading && (
            <div className="menu">
              <button
                onClick={() => {
                  applyHeading(editor, 1);
                  setShowHeading(false);
                }}
              >
                Tiêu đề chính (H1)
              </button>
              <button
                onClick={() => {
                  applyHeading(editor, 2);
                  setShowHeading(false);
                }}
              >
                Tiêu đề phụ (H2)
              </button>
              <button
                onClick={() => {
                  applyHeading(editor, null);
                  setShowHeading(false);
                }}
              >
                Văn bản thường
              </button>
            </div>
          )}
        </div>

        <div className="v-divider" />

        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={s.bold ? "active" : ""}
        >
          <Bold size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={s.italic ? "active" : ""}
        >
          <Italic size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={s.underline ? "active" : ""}
        >
          <UnderlineIcon size={18} />
        </button>

        <div className="v-divider" />

        <button
          onClick={() => applyAlign(editor, "left")}
          className={s.alignLeft ? "active" : ""}
        >
          <AlignLeft size={18} />
        </button>
        <button
          onClick={() => applyAlign(editor, "center")}
          className={s.alignCenter ? "active" : ""}
        >
          <AlignCenter size={18} />
        </button>
        <button
          onClick={() => applyAlign(editor, "right")}
          className={s.alignRight ? "active" : ""}
        >
          <AlignRight size={18} />
        </button>

        <div className="v-divider" />

        <div className="dropdown">
          <button
            onClick={() => setShowSymbol(!showSymbol)}
            className={s.bulletList ? "active" : ""}
          >
            <ListIcon size={18} />
            <ChevronDown size={12} />
          </button>
          {showSymbol && (
            <div className="menu">
              <button
                onClick={() => {
                  applyBullet(editor, "disc");
                  setShowSymbol(false);
                }}
              >
                ● Chấm tròn
              </button>
              <button
                onClick={() => {
                  applyBullet(editor, "square");
                  setShowSymbol(false);
                }}
              >
                ■ Hình vuông
              </button>
            </div>
          )}
        </div>

        <div className="dropdown">
          <button
            onClick={() => setShowNumber(!showNumber)}
            className={s.orderedList ? "active" : ""}
          >
            <ListOrdered size={18} />
            <ChevronDown size={12} />
          </button>
          {showNumber && (
            <div className="menu">
              <button
                onClick={() => {
                  applyNumber(editor, "decimal");
                  setShowNumber(false);
                }}
              >
                1. Số thường
              </button>
              <button
                onClick={() => {
                  applyNumber(editor, "upper-roman");
                  setShowNumber(false);
                }}
              >
                I. La mã
              </button>
            </div>
          )}
        </div>

        <div className="v-divider" />

        <button
          ref={linkBtnRef}
          onClick={handleLinkClick}
          className={s.link ? "active" : ""}
          title="Gán link từ text đã bôi đen"
        >
          <LinkIcon size={18} />
        </button>
        <button onClick={() => fileRef.current?.click()} title="Chèn ảnh">
          <ImageIcon size={18} />
        </button>

        <div className="dropdown">
          <button
            onClick={() => setShowTable(!showTable)}
            className={s.table ? "active" : ""}
            title="Bảng"
          >
            <TableIcon size={18} />
          </button>
          {showTable && (
            <div className="menu">
              <TablePicker
                onPick={(rows, cols) => {
                  editor
                    .chain()
                    .focus()
                    .insertTable({ rows, cols, withHeaderRow: true })
                    .run();
                  setShowTable(false);
                }}
              />
              {s.table && (
                <>
                  <div
                    style={{ borderTop: "1px solid #e2e8f0", margin: "6px 0" }}
                  />
                  <button
                    onClick={() => {
                      editor.chain().focus().addRowAfter().run();
                      setShowTable(false);
                    }}
                  >
                    + Thêm hàng
                  </button>
                  <button
                    onClick={() => {
                      editor.chain().focus().addColumnAfter().run();
                      setShowTable(false);
                    }}
                  >
                    + Thêm cột
                  </button>
                  <button
                    onClick={() => {
                      editor.chain().focus().deleteRow().run();
                      setShowTable(false);
                    }}
                  >
                    − Xoá hàng
                  </button>
                  <button
                    onClick={() => {
                      editor.chain().focus().deleteColumn().run();
                      setShowTable(false);
                    }}
                  >
                    − Xoá cột
                  </button>
                  <div
                    style={{ borderTop: "1px solid #e2e8f0", margin: "6px 0" }}
                  />
                  <button
                    style={{ color: "#ef4444" }}
                    onClick={() => {
                      editor.chain().focus().deleteTable().run();
                      setShowTable(false);
                    }}
                  >
                    <Trash2 size={13} style={{ marginRight: 6 }} /> Xoá bảng
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <div className="dropdown">
          <button onClick={() => setShowColor(!showColor)}>
            <Palette
              size={18}
              style={{ color: editor.getAttributes("textStyle").color }}
            />
          </button>
          {showColor && (
            <div className="colorMenu">
              {COLORS.map((c) => (
                <button
                  key={c}
                  className="color-circle"
                  style={{ background: c }}
                  onClick={() => {
                    applyColor(editor, c);
                    setShowColor(false);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="paper">
        <input
          type="file"
          ref={fileRef}
          onChange={uploadImage}
          accept="image/*"
          hidden
        />
        <EditorContent editor={editor} />
      </div>

      <style>{`
  .page-container { background: #f4f6f8; min-height: 100vh; display: flex; flex-direction: column; align-items: center; padding-bottom: 60px; }
  .header-bar { width: 100%; max-width: 850px; display: flex; justify-content: space-between; padding: 20px; }
  .publish-btn { background: #1132D4; color: white; padding: 8px 24px; border-radius: 20px; font-weight: bold; border: none; cursor: pointer; display: flex; align-items: center; gap: 8px; }
  .icon-btn-circle { border: none; background: white; padding: 10px; border-radius: 50%; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }

  .toolbar { display: flex; align-items: center; gap: 4px; background: white; padding: 6px 12px; border-radius: 50px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); position: sticky; top: 20px; z-index: 100; border: 1px solid #e2e8f0; }
  .v-divider { width: 1px; height: 24px; background: #e2e8f0; margin: 0 6px; }

  button { border: none; background: transparent; padding: 8px; cursor: pointer; border-radius: 50%; color: #64748b; display: flex; align-items: center; }
  button:hover { background: #f1f5f9; color: #1132D4; }
  button.active { background: #e0e7ff; color: #1132D4; }

  .paper { background: white; width: 100%; max-width: 850px; min-height: 1000px; margin-top: 30px; padding: 60px 80px; border-radius: 4px; box-shadow: 0 0 20px rgba(0,0,0,0.03); }

  .editor-canvas { outline: none; min-height: 500px; font-size: 19px; line-height: 1.8; color: #334155; }
  .editor-canvas h1 { font-size: 44px !important; font-weight: 800; color: #1e293b; margin-bottom: 20px; line-height: 1.2; }
  .editor-canvas h2 { font-size: 32px !important; font-weight: 700; color: #1e293b; margin-bottom: 15px; line-height: 1.3; }

  /* LIST */
  .editor-canvas ul { padding-left: 1.5em; margin: 1.5em 0; }
  .editor-canvas ul > li { margin-bottom: 0.6em; list-style-position: inside; }
  /* marker inherit color từ li */
  .editor-canvas ul > li::marker { font-weight: bold; color: inherit; }

  .editor-canvas ol { list-style: none; padding-left: 0; margin: 1.5em 0; counter-reset: list-counter; }
  .editor-canvas ol > li {
    margin-bottom: 0.6em;
    counter-increment: list-counter;
    display: flex;
    align-items: baseline;
    gap: 0.4em;
  }
  /* ::before inherit color từ li */
  .editor-canvas ol > li::before {
    content: counter(list-counter) ".";
    font-weight: bold;
    flex-shrink: 0;
    min-width: 1.6em;
    color: inherit;
  }
  .editor-canvas ol[style*="upper-roman"] > li::before {
    content: counter(list-counter, upper-roman) ".";
    min-width: 2.4em;
  }
  .editor-canvas ol > li > p,
  .editor-canvas ol > li > h1,
  .editor-canvas ol > li > h2 { flex: 1; min-width: 0; }

  .editor-canvas li h1 { font-size: 44px; line-height: 1.2; margin: 0; display: inline; }
  .editor-canvas li h2 { font-size: 32px; line-height: 1.3; margin: 0; display: inline; }
  .editor-canvas li p  { margin: 0; }

  .editor-canvas ul > li:has(> h1)         { font-size: 44px; font-weight: 800; color: #1e293b; }
  .editor-canvas ul > li:has(> h1)::marker { font-size: 44px; font-weight: 800; }
  .editor-canvas ul > li:has(> h2)         { font-size: 32px; font-weight: 700; color: #1e293b; }
  .editor-canvas ul > li:has(> h2)::marker { font-size: 32px; font-weight: 700; }
  .editor-canvas ol > li:has(> h1)::before { font-size: 44px; font-weight: 800; line-height: 1.2; }
  .editor-canvas ol > li:has(> h2)::before { font-size: 32px; font-weight: 700; line-height: 1.3; }

  .editor-canvas ul > li[style*="text-align: center"] { text-align: center; }
  .editor-canvas ul > li[style*="text-align: right"]  { text-align: right; }
  .editor-canvas ul > li[style*="text-align: left"]   { text-align: left; }
  .editor-canvas ol > li[style*="text-align: center"] { justify-content: center; }
  .editor-canvas ol > li[style*="text-align: center"] > p,
  .editor-canvas ol > li[style*="text-align: center"] > h1,
  .editor-canvas ol > li[style*="text-align: center"] > h2 { flex: 0 1 auto; }
  .editor-canvas ol > li[style*="text-align: right"]  { justify-content: flex-end; }
  .editor-canvas ol > li[style*="text-align: right"] > p,
  .editor-canvas ol > li[style*="text-align: right"] > h1,
  .editor-canvas ol > li[style*="text-align: right"] > h2 { flex: 0 1 auto; }
  .editor-canvas ol > li[style*="text-align: left"]   { justify-content: flex-start; }

  .editor-canvas p.is-editor-empty:first-child::before,
  .editor-canvas h1.is-empty::before {
    content: attr(data-placeholder);
    float: left; color: #adb5bd; pointer-events: none; height: 0;
  }

  .editor-canvas img { border-radius: 8px; margin: 10px 0; display: block; max-width: 100%; cursor: pointer; }
  .editor-canvas img.ProseMirror-selectednode { outline: 3px solid #1132D4; }
  .editor-canvas p:has(+ p) { overflow: hidden; }

  .editor-canvas .image-with-text { display: flex; align-items: flex-start; gap: 20px; margin: 1em 0; }
  .editor-canvas .image-with-text > *:first-child { flex: 1; min-width: 0; margin: 0; }
  .editor-canvas .image-with-text > img { width: 45%; flex-shrink: 0; margin: 0; border-radius: 8px; object-fit: cover; }

  .editor-canvas table { border-collapse: collapse; width: 100%; margin: 1.5em 0; table-layout: fixed; }
  .editor-canvas th, .editor-canvas td { border: 1px solid #cbd5e1; padding: 10px 14px; text-align: left; vertical-align: top; min-width: 60px; position: relative; }
  .editor-canvas th { background: #f1f5f9; font-weight: 700; color: #1e293b; }
  .editor-canvas td { background: white; }
  .editor-canvas .selectedCell { background: #e0e7ff !important; }
  .editor-canvas .column-resize-handle { position: absolute; right: -2px; top: 0; bottom: 0; width: 4px; background: #1132D4; cursor: col-resize; opacity: 0; }
  .editor-canvas th:hover .column-resize-handle, .editor-canvas td:hover .column-resize-handle { opacity: 0.4; }

  .editor-canvas a { color: #1132D4; text-decoration: underline; cursor: pointer; }

  .dropdown { position: relative; }
  .menu { position: absolute; top: 45px; left: 0; background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 6px; display: flex; flex-direction: column; box-shadow: 0 10px 15px rgba(0,0,0,0.1); min-width: 200px; z-index: 101; }
  .menu button { border-radius: 4px; padding: 8px 12px; width: 100%; justify-content: flex-start; font-size: 14px; }
  .colorMenu { position: absolute; top: 45px; right: 0; background: white; border: 1px solid #e2e8f0; padding: 10px; border-radius: 12px; display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; box-shadow: 0 10px 15px rgba(0,0,0,0.1); }
  .color-circle { width: 24px; height: 24px; border-radius: 50%; border: 1px solid #e2e8f0; cursor: pointer; }
`}</style>
    </div>
  );
}
